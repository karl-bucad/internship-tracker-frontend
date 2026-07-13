function SearchControls({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
}) {
    return (
        <div className="search-controls">
            <input
                className="search-input"
                type="text"
                placeholder="Search by company or role"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
                className="filter-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
            >
                <option value="All">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>

            <select
                className="filter-select"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
            >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
            </select>
        </div>
    )
}

export default SearchControls