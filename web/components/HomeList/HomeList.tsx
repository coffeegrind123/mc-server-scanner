import React, { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import InfiniteList from '../InfiniteList/InfiniteList';
import HomeView from '../HomeView/HomeView';
import FilterComponent from '../FilterComponent/FilterComponent';

export const showOpts = ['mostRecent', 'history'] as const;

interface FilterOptions {
	cracked: 'all' | 'true' | 'false' | 'unknown' | 'error';
	minPlayers?: number;
	maxPlayers?: number;
	version?: string;
}

const HomeList = () => {
	const [showing, setShowing] = useState<typeof showOpts[number]>('mostRecent');
	const [rendered, setRendered] = useState(false);
	const [filters, setFilters] = useState<FilterOptions>({ cracked: 'all' });
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setShowing(e.target.value as typeof showOpts[number]);
		sessionStorage.setItem('showing', e.target.value);
	};
	useEffect(() => {
		const savedShowing = sessionStorage.getItem('showing');
		savedShowing && setShowing(savedShowing as typeof showOpts[number]);
		setRendered(true);
	}, []);
	const handleFilterChange = (newFilters: FilterOptions) => {
		setFilters(newFilters);
	};

	return (
		<>
			<HomeView onChange={onChange} showing={showing} />
			<FilterComponent onFilterChange={handleFilterChange} />
			<InfiniteList queryKey={showing} input={filters}></InfiniteList>
		</>
	);
};

export default HomeList;
