import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { ToastContainer } from 'react-toastify';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log(children)
  return (
    <div className="flex flex-row min-h-screen">
      <Navbar />
      <main className="h-screen max-h-screen flex justify-center flex-grow p-5 overflow-y-scroll">
        {children}
      </main>
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />
    </div>
  );
};

export default Layout;