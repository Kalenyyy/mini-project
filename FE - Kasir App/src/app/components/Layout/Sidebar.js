"use client";

import { useState } from "react";
import Link from "next/link";
import 'flowbite';      

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Set initial state to false for closed sidebar

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-[#3F4151] text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-16"}  // Control width based on isOpen state
      `}
    >
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-[-12px] bg-[#3F4151] border-2 border-white rounded-full p-2 focus:outline-none"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Logo / Brand */}
      <div className="flex items-center p-4 space-x-2">
        {isOpen && <span className="text-lg font-bold">Cartelytics</span>}
      </div>

      {/* Menu */}
      <nav className="mt-8 flex flex-col space-y-2">
        <Link
          href="/"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
            />
          </svg>
          {isOpen && <span className="ml-3">Home</span>}
        </Link>

        {/* Contoh menu tambahan */}
        <Link
          href="/products"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 110-8 4 4 0 010 8zm0-8a4 4 0 010 8"
            />
          </svg>
          {isOpen && <span className="ml-3">Products</span>}
        </Link>
        {/* Contoh menu tambahan */}
        <Link
          href="/customers"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 110-8 4 4 0 010 8zm0-8a4 4 0 010 8"
            />
          </svg>
          {isOpen && <span className="ml-3">Customers</span>}
        </Link>
        <Link
          href="/orders"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 110-8 4 4 0 010 8zm0-8a4 4 0 010 8"
            />
          </svg>
          {isOpen && <span className="ml-3">Order Reports</span>}
        </Link>
      </nav>
    </aside>
  );
}
