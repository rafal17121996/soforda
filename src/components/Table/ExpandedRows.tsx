import React from "react";
import { ExpansionType } from "./Table";
import { Worker } from "../../types/Worker";
import { Details } from "./Details";

interface PropsExpandedRows {
  expandedRows: { [key: number]: ExpansionType };
  worker: Worker;
  onUpdate: () => void;
  onUpdatePayrollDetails: () => void;
}

export const ExpandedRows: React.FC<PropsExpandedRows> = ({
  expandedRows,
  worker,
  onUpdate,
  onUpdatePayrollDetails,
}) => {
  return (
    <tr>
      <td colSpan={7} className="py-2 px-4 border-b bg-gray-50">
        {expandedRows[worker.id] === "details" && <Details worker={worker} onUpdate={onUpdate} onUpdatePayrollDetails={onUpdatePayrollDetails} />}
      </td>
    </tr>
  );
};
