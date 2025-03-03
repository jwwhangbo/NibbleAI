'use client';
import { useRouter } from "next/navigation";

export default function GalleryActionBar() {
  const { push } = useRouter();
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    push('/recipes/edit');
  }
  return (
    <div className="sticky w-fit bg-white p-1 ml-auto right-4 bottom-4 rounded-full shadow-[0_0_15px_-3px_rgba(0,0,0,0.2)] flex justify-center items-center">
      <ul className="flex gap-2">
        <li>
          <button onClick={handleClick} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </li>
        <li>
          <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
            Select
          </button>
        </li>
      </ul>
    </div>
  )
}