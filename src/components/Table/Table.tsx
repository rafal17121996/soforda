import React, { useState } from "react";
import { Worker } from "../../types/Worker";
import { Item } from "./Item";

interface PropsTable {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

export type ExpansionType = "details" | "employment";

export const Table: React.FC<PropsTable> = ({ workers, onEdit, onDelete }) => {
  // Stan do śledzenia rozszerzonych wierszy
  const [expandedRows, setExpandedRows] = useState<{
    [key: number]: ExpansionType;
  }>({});

  // Funkcja do toggle'owania rozszerzenia wiersza
  const toggleRow = (workerId: number, type: ExpansionType) => {
    setExpandedRows((prev) => {
      const currentType = prev[workerId];
      if (currentType === type) {
        // Jeśli aktualnie jest otwarty ten sam typ, zamykamy
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [workerId]: _, ...rest } = prev;
        return rest;
      } else {
        // Otwieramy nowy typ
        return { ...prev, [workerId]: type };
      }
    });
  };

  if (workers.length === 0) {
    return <p>Brak dostępnych pracowników.</p>;
  }

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg">
    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
      <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Imię</th>
          <th className="py-2 px-4 border-b">Drugie Imię</th>
          <th className="py-2 px-4 border-b">Nazwisko</th>
          <th className="py-2 px-4 border-b">Data Urodzenia</th>
          <th className="py-2 px-4 border-b">Dział</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {workers.map((worker) => (
          <Item
            worker={worker}
            expandedRows={expandedRows}
            onEdit={onEdit}
            onDelete={onDelete}
            toggleRow={toggleRow}
            key={worker.id}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
