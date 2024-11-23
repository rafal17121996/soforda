import React, { useState } from "react";
import { Worker } from "../../types/Worker";
import { Item } from "./Item";
import { Skeleton } from "@mui/material";

interface PropsTable {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
  loading?: boolean;
  onUpdate: () => void;
  onUpdatePayrollDetails: () => void;
}

export type ExpansionType = "details" | "employment";

export const Table: React.FC<PropsTable> = ({
  workers,
  onEdit,
  onDelete,
  loading = false,
  onUpdate,
  onUpdatePayrollDetails,
}) => {
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

  if (!loading && workers.length === 0) {
    return <p>Brak dostępnych pracowników.</p>;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-left table-auto min-w-max">
        <thead className="bg-indigo-600 rounded-t-lg">
          <tr>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-800">ID</p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-800">
                Nazwisko
              </p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-800">Imię</p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-500">
                Drugie Imię
              </p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-500">
                Data Urodzenia
              </p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-500">Dział</p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-100">
              <p className="lock font-semibold text-sm text-slate-500"></p>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? // Render Skeleton Rows
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  {/* ID */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Imię */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Drugie Imię */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Nazwisko */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Data Urodzenia */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Dział */}
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex items-center h-full">
                      <Skeleton variant="text" width="100%" height={24} />
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="p-4 border-b border-slate-200 flex justify-center items-center">
                    <Skeleton variant="circular" width={24} height={24} />
                  </td>
                </tr>
              ))
            : workers.map((worker) => (
                <Item
                  worker={worker}
                  expandedRows={expandedRows}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  toggleRow={toggleRow}
                  key={worker.id}
                  onUpdate={onUpdate}
                  onUpdatePayrollDetails={onUpdatePayrollDetails}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
