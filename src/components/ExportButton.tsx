// ExportButton.tsx

import React, { useEffect, useRef, useState } from "react";
import { PaginationData } from "../types/PaginationData";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";

interface PropsExportButton {
  paginationData: PaginationData;
  tempSearch: string;
}

export const ExportButton: React.FC<PropsExportButton> = ({
  paginationData,
  tempSearch,
}) => {
  const [isExportDropdownOpen, setIsExportDropdownOpen] =
    useState<boolean>(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportDropdownRef]);

  const generatePDF = async () => {
    try {
      // Fixed the endpoint string using template literals
      let endpoint = `/users?page=${paginationData.page}&size=${paginationData.page_size}&format=pdf`;
      if (tempSearch) {
        endpoint += `&search=${encodeURIComponent(tempSearch)}`;
      }

      // Set responseType to 'blob'
      const response = await api.get(endpoint, { responseType: "blob" });

      // Create a Blob from the PDF data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create an <a> element to download the PDF
      const link = document.createElement("a");
      link.href = pdfUrl;

      // Extract filename from 'Content-Disposition' header or use default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "users.pdf"; // Default filename
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      toast.success("PDF downloaded successfully!");
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const generateCSV = async () => {
    try {
      // Fixed the endpoint string using template literals
      let endpoint = `/users?page=${paginationData.page}&size=${paginationData.page_size}&format=csv`;
      if (tempSearch) {
        endpoint += `&search=${encodeURIComponent(tempSearch)}`;
      }

      // Set responseType to 'blob'
      const response = await api.get(endpoint, { responseType: "blob" });

      // Create a Blob from the CSV data
      const csvBlob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      // Create a URL for the Blob
      const csvUrl = URL.createObjectURL(csvBlob);

      // Create an <a> element to download the CSV
      const link = document.createElement("a");
      link.href = csvUrl;

      // Extract filename from 'Content-Disposition' header or use default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "users.csv"; // Default filename
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);
      toast.success("CSV downloaded successfully!");
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  /**
   * Handles the Print functionality by fetching printable HTML content
   * and opening it in a new browser tab.
   */
  const handlePrint = async () => {
    try {
      // Construct the endpoint with 'print' format
      let endpoint = `/users?page=${paginationData.page}&size=${paginationData.page_size}&format=print`;
      if (tempSearch) {
        endpoint += `&search=${encodeURIComponent(tempSearch)}`;
      }

      // Make a GET request to fetch the printable HTML content
      const response = await api.get(endpoint, { responseType: "blob" });

      // Create a Blob from the HTML content
      const printBlob = new Blob([response.data], { type: "text/html" });

      // Create a URL for the Blob
      const printUrl = URL.createObjectURL(printBlob);

      // Open the printable content in a new window
      const printWindow = window.open(printUrl, "_blank");
      if (printWindow) {
        // Optional: Automatically trigger the print dialog once the content loads
        printWindow.onload = () => {
          printWindow.print();
        };
        toast.success("Print dialog opened.");
      } else {
        toast.error(
          "Unable to open print window. Please allow pop-ups for this website."
        );
      }

      // Clean up the Blob URL after a short delay to ensure the window has loaded
      setTimeout(() => {
        URL.revokeObjectURL(printUrl);
      }, 1000);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={exportDropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isExportDropdownOpen}
          onClick={() => setIsExportDropdownOpen((prev) => !prev)}
        >
          Export
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isExportDropdownOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                setIsExportDropdownOpen(false);
                generatePDF();
              }}
            >
              PDF
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                setIsExportDropdownOpen(false);
                generateCSV();
              }}
            >
              CSV
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                setIsExportDropdownOpen(false);
                handlePrint();
              }}
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
