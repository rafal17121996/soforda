import React, { useEffect, useRef, useState } from "react";
import { PaginationData } from "../types/PaginationData";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";

interface PropsExportButton {
    paginationData: PaginationData;
    tempSearch: string
}

export const ExportButton:React.FC<PropsExportButton> = ({paginationData, tempSearch}) => {
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
      let endpoint = `/users?page=${paginationData.page}&size=${paginationData.page_size}&format=pdf`;
      if (tempSearch) {
        endpoint += `&search=${encodeURIComponent(tempSearch)}`;
      }

      // Ustawienie responseType na 'blob'
      const response = await api.get(endpoint, { responseType: "blob" });

      // Utworzenie obiektu Blob z odpowiedzi
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Utworzenie URL do Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Utworzenie elementu <a> do pobrania pliku
      const link = document.createElement("a");
      link.href = pdfUrl;

      // Opcjonalnie: pobierz nazwę pliku z nagłówka 'Content-Disposition'
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "users.pdf"; // Domyślna nazwa pliku
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;

      // Dodanie linku do dokumentu i programowe kliknięcie
      document.body.appendChild(link);
      link.click();

      // Usunięcie linku i zwolnienie URL
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      toast.success('Pobrano PDF');

    //   setError("");
    } catch (error: unknown) {
      handleAxiosError(error);
    
    } finally {
    //   setLoading(false);
    }
  };
  const generateCSV = async () => {
    try {
    //   setLoading(true);
      let endpoint = `/users?page=${paginationData.page}&size=${paginationData.page_size}&format=csv`;
      if (tempSearch) {
        endpoint += `&search=${encodeURIComponent(tempSearch)}`;
      }

      // Set responseType to 'blob'
      const response = await api.get(endpoint, { responseType: "blob" });

      // Create a Blob object from the response
      const csvBlob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      // Create a URL for the Blob
      const csvUrl = URL.createObjectURL(csvBlob);

      // Create an <a> element to download the file
      const link = document.createElement("a");
      link.href = csvUrl;

      // Optionally: Get the file name from 'Content-Disposition' header
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "users.csv"; // Default file name
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;

      // Append the link to the document and programmatically click it
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);

    //   setError("");
    } catch (error: unknown) {
      handleAxiosError(error);
    
    } finally {
    //   setLoading(false);
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
                // handlePrint();
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
