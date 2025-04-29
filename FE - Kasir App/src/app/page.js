// src/app/dashboard/page.js
import Layout from "./components/Layout/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <nav
        className="flex px-5 py-3 text-white rounded-lg bg-[#3F4151] "
        aria-label="Breadcrumb"
      >
        {/* Contoh Breadcrumb */}
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-white"
            >
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <a
                href="#"
                className="ml-1 text-sm font-medium text-white md:ml-2"
              >
                Dashboard
              </a>
            </div>
          </li>
        </ol>
      </nav>
      <div className="mt-4">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        <p>Ini adalah konten utama dashboard.</p>
      </div>
    </Layout>
  );
}
