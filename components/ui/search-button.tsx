import { ChangeEventHandler, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SearchButton({ onChange }: { onChange: ChangeEventHandler<HTMLInputElement>}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="relative flex items-center justify-end">
      <button
        className="relative z-10 hover:bg-gray-200 rounded-md p-1"
        onClick={toggleSearch}
        aria-label="Toggle search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "200px" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-0"
          >
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 focus:ring focus:outline-none border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              aria-label="Search input"
              onChange={onChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

