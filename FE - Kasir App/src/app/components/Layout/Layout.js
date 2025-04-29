import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import "flowbite";

export default function Layout({ children }) {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar />
      <div className="content ml-20 transform ease-in-out duration-500 pt-10 px-2 md:px-5 pb-4">
        {children}
      </div>
    </div>
  );
}
