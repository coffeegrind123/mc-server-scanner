#!/usr/bin/python3
import socket
import struct
import json
import time
import random

class CrackedCheck:
    """ Check if a Minecraft server is cracked (offline-mode) """
    
    def __init__(self, host='localhost', port=25565, timeout=5):
        """ Init the hostname and the port """
        self._host = host
        self._port = port
        self._timeout = timeout

    def _unpack_varint(self, sock):
        """ Unpack the varint """
        data = 0
        for i in range(5):
            ordinal = sock.recv(1)

            if len(ordinal) == 0:
                break

            byte = ord(ordinal)
            data |= (byte & 0x7F) << 7*i

            if not byte & 0x80:
                break

        return data

    def _pack_varint(self, data):
        """ Pack the var int """
        ordinal = b''

        while True:
            byte = data & 0x7F
            data >>= 7
            ordinal += struct.pack('B', byte | (0x80 if data > 0 else 0))

            if data == 0:
                break

        return ordinal

    def _pack_data(self, data):
        """ Pack the data """
        if type(data) is str:
            data = data.encode('utf8')
            return self._pack_varint(len(data)) + data
        elif type(data) is int:
            return struct.pack('H', data)
        elif type(data) is float:
            return struct.pack('L', int(data))
        else:
            return data

    def _send_data(self, connection, *args):
        """ Send the data on the connection """
        data = b''

        for arg in args:
            data += self._pack_data(arg)

        connection.send(self._pack_varint(len(data)) + data)

    def _read_fully(self, connection):
        """ Read the connection and return the bytes """
        packet_length = self._unpack_varint(connection)
        packet_id = self._unpack_varint(connection)
        
        # Read remaining packet data
        remaining_length = packet_length - self._varint_length(packet_id)
        byte = connection.recv(remaining_length) if remaining_length > 0 else b''
        
        return packet_id, byte

    def _varint_length(self, value):
        """ Calculate the length of a varint """
        length = 0
        while True:
            length += 1
            value >>= 7
            if value == 0:
                break
        return length

    def is_cracked(self, version='1.20.1', protocol=763):
        """ Check if server is cracked by attempting login """
        username = f"CrackedTest{random.randint(100, 999)}"
        
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
                connection.settimeout(self._timeout)
                connection.connect((self._host, self._port))

                # Send handshake for login state
                self._send_data(connection, b'\x00', protocol, self._host, self._port, b'\x02')
                
                # Send login start packet
                self._send_data(connection, b'\x00', username)
                
                # Read response
                packet_id, data = self._read_fully(connection)
                
                if packet_id == 0:  # Login success
                    return 'unknown'  # Could be either, indeterminate
                elif packet_id == 1:  # Encryption request (not cracked)
                    return False
                elif packet_id == 2:  # Login success without encryption (cracked)
                    return True
                else:
                    return 'unknown'
                    
        except Exception as e:
            return 'error'

    def get_cracked_status(self, version='1.20.1', protocol=763):
        """ Get the cracked status as a string result """
        try:
            result = self.is_cracked(version, protocol)
            if result is True:
                return 'true'
            elif result is False:
                return 'false'
            else:
                return 'unknown'
        except:
            return 'error'