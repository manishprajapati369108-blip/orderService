const Search = () => {
  return (
    <div>
      <form className="max-w-md mx-auto">
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="relative">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          {/* Search input */}
          <input
            type="search"
            id="search"
            className="block mt-10 w-full p-3 pl-9 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
            placeholder="Search"
          />
        </div>
      </form>
    </div>
  );
};

export default Search;