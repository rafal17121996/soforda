// src/components/Workers.tsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axiosConfig";
import { getErrorMessage } from "../utils/errorHandler";
import { Table } from "../components/Table/Table";
import { ButtonComponent } from "../components/ButtonComponent";
import Modal from "../components/Modal";
import { ButtonType } from "../enums/ButtonType";
import EditWorkerForm from "../components/Workers/EditWorkerForm";
import { Worker } from "../types/Worker";
import { AddWorkerForm } from "../components/Workers/AddWorkerForm";
import { toast } from "react-toastify";

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
  const [error, setError] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);

  // Stany dla paginacji
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);

  // Memoizowana funkcja pobierająca pracowników z paginacją
  const fetchWorkers = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await api.get<WorkersResponse>("/workers", {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });
      setWorkers(response.data.items);
      setPage(response.data.page);
      setSize(response.data.size);
      setPages(response.data.pages);
      setError("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Wywołanie fetchWorkers przy montowaniu komponentu oraz zmianie strony/rozmiaru
  useEffect(() => {
    fetchWorkers(page, size);
  }, [fetchWorkers, page, size]);

  const handleAddWorkerClick = () => {
    setIsAddModalOpen(true); // Otwieramy modal po kliknięciu przycisku
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false); // Zamykamy modal
    setIsEditModalOpen(false); // Zamykamy modal
    setWorkerToEdit(null); // Czyścimy wybranego pracownika do edycji
  };

  const handleEditModalOpen = (worker: Worker) => {
    setWorkerToEdit(worker);
    setIsEditModalOpen(true);
  };

  const handleAddWorker = () => {
    setIsAddModalOpen(false);
    fetchWorkers(page, size); // Ponowne pobranie pracowników po dodaniu
  };

  const handleEdit = (worker: Worker) => {
    handleEditModalOpen(worker);
  };

  const handleDelete = async (worker: Worker) => {
    if (
      window.confirm(
        `Czy na pewno chcesz usunąć pracownika ${worker.first_name} ${worker.last_name}?`
      )
    ) {
      try {
        await api.delete(`/workers/${worker.id}`);
        toast.success(`Pracownik ${worker.first_name} ${worker.last_name} został usunięty.`);
        // Sprawdzenie, czy po usunięciu nie potrzebujemy zmniejszyć numeru strony
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

  // Funkcje do obsługi paginacji
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

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <ButtonComponent
          label="Poprzednia"
          type={ButtonType.Secondary}
          onClick={handlePreviousPage}
          disabled={page === 1}
        />
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageSelect(num)}
            className={`px-3 py-1 border rounded ${
              num === page
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}
        <ButtonComponent
          label="Następna"
          type={ButtonType.Secondary}
          onClick={handleNextPage}
          disabled={page === pages}
        />
      </div>
    );
  };

  if (loading) {
    return <p className="text-red-500">Loading</p>;
  }


  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-4">Pracownicy</h1>
      <div className="flex justify-end mb-4">
        <ButtonComponent
          label="Dodaj Pracownika"
          type={ButtonType.Primary}
          onClick={handleAddWorkerClick}
        />
      </div>
      <Table workers={workers} onEdit={handleEdit} onDelete={handleDelete} />
      {renderPagination()}

      {/* Modal Dodawania Pracownika */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          title="Dodaj Nowego Pracownika"
        >
          <AddWorkerForm onAdd={handleAddWorker} />
        </Modal>
      )}

      {/* Modal Edycji Pracownika */}
      {isEditModalOpen && workerToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Edytuj Pracownika"
        >
          <EditWorkerForm
            onEdit={handleAddWorker}
            worker={workerToEdit}
          />
        </Modal>
      )}
    </div>
  );
};

export default Workers;
