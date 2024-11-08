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

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);

  // Memoizowana funkcja pobierająca pracowników
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{items : Worker[]}>("/worker");
      setWorkers(response.data.items);
      setError("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Wywołanie fetchWorkers przy montowaniu komponentu
  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const HandleAddWorker = () => {
    setIsAddModalOpen(true); // Otwieramy modal po kliknięciu przycisku
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false); // Zamykamy modal
    setIsEditModalOpen(false); // Zamykamy modal
  };

  const handleEditModalOpen = (worker: Worker) => {
    setWorkerToEdit(worker);
    setIsEditModalOpen(true);
  };

  const handleAddWorker = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    fetchWorkers(); // Ponowne pobranie pracowników po dodaniu
  };

  const handleEdit = (worker: Worker) => {
    // Logika dla przycisku Edit
    console.log("Edit clicked for worker:", worker);
    handleEditModalOpen(worker);
  };

  const handleDelete = async (worker: Worker) => {
    // Logika dla przycisku Delete
    if (
      window.confirm(
        `Czy na pewno chcesz usunąć pracownika ${worker.first_name} ${worker.last_name}?`
      )
    ) {
      try {
        await api.delete(`/worker/${worker.id}`);
        fetchWorkers();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Ładowanie...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-4">Pracownicy</h1>
      <Table workers={workers} onEdit={handleEdit} onDelete={handleDelete} />
      <ButtonComponent
        label="Dodaj pracownika"
        type={ButtonType.Primary}
        onClick={HandleAddWorker}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Dodaj Nowego Pracownika"
      >
        <AddWorkerForm onAdd={handleAddWorker} />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Dodaj Nowego Pracownika"
      >
        <EditWorkerForm
          onEdit={handleAddWorker}
          worker={workerToEdit as Worker}
        />
      </Modal>
    </div>
  );
};

export default Workers;
