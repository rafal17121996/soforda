import React from "react";
import { Worker } from "../../types/Worker";
import { ButtonComponent } from "../ButtonComponent";
import { ButtonType } from "../../enums/ButtonType";
import { ExpansionType } from "./Table";
import { ExpandedRows } from "./ExpandedRows";

interface PropsItem {
  worker: Worker;
  expandedRows: { [key: number]: ExpansionType };
  toggleRow: (workerId: number, type: ExpansionType) => void;
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
  onUpdate: () => void;
  onUpdatePayrollDetails: () => void;
}
export const Item: React.FC<PropsItem> = ({
  worker,
  expandedRows,
  toggleRow,
  onEdit,
  onDelete,
  onUpdate,
  onUpdatePayrollDetails
}) => {
  return (
    <React.Fragment key={worker.id}>
      <tr className="group hover:bg-slate-50 border-b border-slate-200">
        <td className="p-4 py-5">
          <p className="block font-semibold text-sm text-slate-800">
            {worker.id}
          </p>
        </td>
        <td className="p-4 py-5">
          <p className="block font-semibold text-sm text-slate-800">{worker.last_name}</p>
        </td>
        <td className="p-4 py-5">
          <p className="block font-semibold text-sm text-slate-800">{worker.first_name}</p>
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-slate-600">{worker.middle_name}</p>
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-slate-600">{worker.birthday}</p>
        </td>
        <td className="p-4 py-5">
          <p className="text-sm text-slate-600">{worker.department_name}</p>
        </td>
        <td className="p-4 py-5">
          <div className="flex justify-center space-x-2">
            <ButtonComponent
              label="Details"
              type={ButtonType.Icon}
              className="text-green-600 group-hover:bg-green-600 group-hover:text-white"
              onClick={() => toggleRow(worker.id, "details")}
            />
            <ButtonComponent
              label="Edit"
              type={ButtonType.Icon}
              className="text-yellow-400 group-hover:bg-yellow-400 group-hover:text-white"
              onClick={() => onEdit(worker)}
            />
            <ButtonComponent
              label="Delete"
              type={ButtonType.Icon}
              className="text-red-500 group-hover:bg-red-500 group-hover:text-white"
              onClick={() => onDelete(worker)}
            />
          </div>
        </td>
      </tr>
      {expandedRows[worker.id] && (
        <ExpandedRows expandedRows={expandedRows} worker={worker} onUpdate={onUpdate} onUpdatePayrollDetails={onUpdatePayrollDetails}/>
      )}
    </React.Fragment>
  );
};
