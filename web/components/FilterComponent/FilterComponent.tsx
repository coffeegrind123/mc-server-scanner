import React, { useState, useEffect } from 'react';

interface FilterOptions {
	cracked: 'all' | 'true' | 'false' | 'unknown' | 'error';
	minPlayers?: number;
	maxPlayers?: number;
	version?: string;
}

interface FilterComponentProps {
	onFilterChange: (filters: FilterOptions) => void;
	initialFilters?: FilterOptions;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
	onFilterChange,
	initialFilters = { cracked: 'all' },
}) => {
	const [filters, setFilters] = useState<FilterOptions>(initialFilters);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		onFilterChange(filters);
	}, [filters, onFilterChange]);

	const handleFilterChange = (key: keyof FilterOptions, value: any) => {
		setFilters(prev => ({
			...prev,
			[key]: value === '' ? undefined : value,
		}));
	};

	const clearFilters = () => {
		setFilters({ cracked: 'all' });
		setIsExpanded(false);
	};

	return (
		<div className="bg-neutral-800 rounded-lg p-4 mb-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-white">Filters</h3>
				<div className="flex gap-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
					>
						{isExpanded ? 'Hide Filters' : 'Show Filters'}
					</button>
					<button
						onClick={clearFilters}
						className="text-sm text-red-400 hover:text-red-300 transition-colors"
					>
						Clear All
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Cracked Status Filter */}
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">
						Server Status
					</label>
					<select
						value={filters.cracked}
						onChange={(e) => handleFilterChange('cracked', e.target.value)}
						className="w-full p-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-blue-500 focus:outline-none"
					>
						<option value="all">All Servers</option>
						<option value="true">Cracked Only</option>
						<option value="false">Premium Only</option>
						<option value="unknown">Unknown Status</option>
						<option value="error">Error Status</option>
					</select>
				</div>

				{isExpanded && (
					<>
						{/* Min Players Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Min Players
							</label>
							<input
								type="number"
								min="0"
								value={filters.minPlayers || ''}
								onChange={(e) => handleFilterChange('minPlayers', parseInt(e.target.value) || undefined)}
								placeholder="Any"
								className="w-full p-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-blue-500 focus:outline-none"
							/>
						</div>

						{/* Max Players Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Max Players
							</label>
							<input
								type="number"
								min="0"
								value={filters.maxPlayers || ''}
								onChange={(e) => handleFilterChange('maxPlayers', parseInt(e.target.value) || undefined)}
								placeholder="Any"
								className="w-full p-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-blue-500 focus:outline-none"
							/>
						</div>

						{/* Version Filter */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Version Contains
							</label>
							<input
								type="text"
								value={filters.version || ''}
								onChange={(e) => handleFilterChange('version', e.target.value)}
								placeholder="e.g. 1.20"
								className="w-full p-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-blue-500 focus:outline-none"
							/>
						</div>
					</>
				)}
			</div>

			{/* Active Filters Display */}
			{(filters.cracked !== 'all' || filters.minPlayers || filters.maxPlayers || filters.version) && (
				<div className="mt-4 flex flex-wrap gap-2">
					<span className="text-sm text-gray-400">Active filters:</span>
					{filters.cracked !== 'all' && (
						<span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
							{filters.cracked === 'true' ? 'Cracked' : 
							 filters.cracked === 'false' ? 'Premium' : 
							 filters.cracked === 'unknown' ? 'Unknown' : 'Error'}
						</span>
					)}
					{filters.minPlayers && (
						<span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
							Min: {filters.minPlayers}
						</span>
					)}
					{filters.maxPlayers && (
						<span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
							Max: {filters.maxPlayers}
						</span>
					)}
					{filters.version && (
						<span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
							Version: {filters.version}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default FilterComponent;