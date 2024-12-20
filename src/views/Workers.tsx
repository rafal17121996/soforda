// src/components/Workers.tsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axiosConfig";
import { getErrorMessage } from "../utils/errorHandler";
import { Table } from "../components/Table/Table";
import Modal from "../components/Modal";
import EditWorkerForm from "../components/Workers/EditWorkerForm";
import { Worker } from "../types/Worker";
import { AddWorkerForm } from "../components/Workers/AddWorkerForm";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";
import { ButtonComponent } from "../components/ButtonComponent";
import { ButtonType } from "../enums/ButtonType";
import { Skeleton } from "@mui/material";
import Search from "../components/Search";

interface WorkersResponse {
  items: Worker[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempSearch, setTempSearch] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);

  // States for pagination
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);

  // Memoized function to fetch workers with pagination
  const fetchWorkers = useCallback(
    async (currentPage: number, pageSize: number, search: string = '') => {
      try {
        setLoading(true);
        const response = await api.get<WorkersResponse>("/workers", {
          params: {
            page: currentPage,
            size: pageSize,
            search
          },
        });
        setWorkers(response.data.items);
        setPage(response.data.page);
        setSize(response.data.size);
        setPages(response.data.pages);
      } catch (err: unknown) {
        handleAxiosError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch workers on component mount and when page or size changes
  useEffect(() => {
    fetchWorkers(page, size, tempSearch);
  }, [fetchWorkers, page, size]);

  const handleAddWorkerClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setWorkerToEdit(null);
  };

  const handleEditModalOpen = (worker: Worker) => {
    setWorkerToEdit(worker);
    setIsEditModalOpen(true);
  };

  const handleAddWorker = () => {
    setIsAddModalOpen(false);
    fetchWorkers(page, size);
  };

  const handleEdit = (worker: Worker) => {
    handleEditModalOpen(worker);
  };

  const handleLicenseUpdate = () => {
    fetchWorkers(page, size);
  };

  const handlePayrollDetailsUpdate = () => {
    fetchWorkers(page, size);
  };

  const handleDelete = async (worker: Worker) => {
    if (
      window.confirm(
        `Czy na pewno chcesz usunąć pracownika ${worker.first_name} ${worker.last_name}?`
      )
    ) {
      try {
        await api.delete(`/workers/${worker.id}`);
        toast.success(
          `Pracownik ${worker.first_name} ${worker.last_name} został usunięty.`
        );
        // Check if page needs to be decremented
        if (workers.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchWorkers(page, size);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        toast.error(`Błąd podczas usuwania pracownika: ${errorMessage}`);
      }
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const handlePageSelect = (selectedPage: number) => {
    if (selectedPage !== page && selectedPage >= 1 && selectedPage <= pages) {
      setPage(selectedPage);
    }
  };

  const handleSearch = (search: string) => {
    setTempSearch(search);
    fetchWorkers(1, size, search);
  };


  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Poprzednia
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageSelect(num)}
            className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal border rounded transition duration-200 ease ${
              num === page
                ? "bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                : "text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          onClick={handleNextPage}
          disabled={page === pages}
        >
          Następna
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {loading ? (
              <Skeleton width="60%" height={24} />
            ) : (
              "Pracownicy"
            )}
          </h3>
          <p className="text-slate-500">
            {loading ? (
              <Skeleton width="80%" height={20} />
            ) : (
              "Przegląd bieżących informacji o pracownikach."
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
          {/* Add Worker Button */}
          <ButtonComponent
            label="Add Worker"
            text="Dodaj pracownika"
            type={ButtonType.Primary}
            onClick={handleAddWorkerClick}
            disabled={loading} // Optionally disable while loading
          />

          {/* Search Input */}
    <Search label="Wyszukaj" handleSubmit={handleSearch}/>
        </div>
      </div>

      {/* Table */}
      <Table
        workers={workers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        onUpdate={handleLicenseUpdate}
        onUpdatePayrollDetails={handlePayrollDetailsUpdate}

      />

      {/* Pagination */}
      {pages > 1 && renderPagination()}

      {/* Add Worker Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title="Dodaj Nowego Pracownika"
          subtitle="Wprowadź wszystkie informacje dotyczące pracownika."
        >
          <AddWorkerForm
            onAdd={handleAddWorker}
            onClose={handleCloseModal}
          />
        </Modal>
      )}

      {/* Edit Worker Modal */}
      {isEditModalOpen && workerToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          title="Edytuj Pracownika"
          subtitle="Zaktualizuj informacje dotyczące pracownika."
        >
          <EditWorkerForm
            onEdit={handleAddWorker}
            worker={workerToEdit}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Workers;