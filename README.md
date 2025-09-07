# Public minecraft server scanner

It uses [masscan](https://github.com/robertdavidgraham/masscan) and [dramatiq](https://dramatiq.io/) to scan for public minecraft servers on default port `25556`.

# How does it work

`iprange.py` provides a class with utility functions to generate a file of ip ranges with either an /8 or /16 CIDR range. \
The scanner script chooses a random ip address range from this file and calls `masscan` with it, on scan end, it queues a server list ping that on success caches the response to a redis backend, then a script periodically writes the bundled responses to a MongoDB database.


# Installation and configuring

Install docker compose: [Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [CentOs / Oracle linux](https://docs.docker.com/engine/install/centos/)

Clone the repo

    git clone https://github.com/rezonmain/mc-server-scanner.git
    cd mc-server-scanner

To enable saving found servers to a db, copy the `.env.example` file to `.env` in the root directory

     cp .env.example .env

Edit the `MONGO_URI` environment variable to your connection string. You can create a free MongoDB cluster with [Atlas](https://www.mongodb.com/atlas)

# Rate limiting masscan

Running masscan on a home network unlimited will **melt** your router, in my case, I run it at 35,000 kp/s which scans a x.x.x.x/16 range (65,536 hosts) in ~2 seconds, and at 100,000 kp/s when scanner is running on a vm.

To edit the rate at which masscan runs, edit the RATE environment variable in `.env`

    MONGO_URI=MONGO_URI='mongodb+srv://<username>:<password>@<mongourl>/?retryWrites=true&w=majority'
    RATE=100000 <- set to your liking
    IDENT=SERVER_NAME

Run docker compose up

    sudo docker compose up

This will start all services:
- **Redis**: Cache and message broker
- **Web Frontend**: Next.js application with server browser and filtering
- **Caddy**: Reverse proxy serving the frontend on port 80
- **Worker**: Background processing for server pings
- **Scanner**: Masscan-based server discovery

The web interface will be available at `http://localhost` (port 80).

# Front end

The web frontend includes:
- Server browsing with infinite scroll
- Advanced filtering by server status (cracked/premium), player count, and version
- Real-time server status detection
- Responsive design with dark theme

The source code for it can be found in the `web/` directory.

# Todo

Goals completed 🎉🎉🎉🎉

- [x] Containerize application
- [x] Write found servers to db (Mongo)
- [x] Create front-end to browse servers
- [x] Add cracked server detection
- [x] Implement advanced filtering system
- [x] Add Caddy reverse proxy for production deployment
