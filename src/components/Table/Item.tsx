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
}
export const Item: React.FC<PropsItem> = ({
  worker,
  expandedRows,
  toggleRow,
  onEdit,
  onDelete,
}) => {
  return (
    <React.Fragment key={worker.id}>
      <tr>
        <td className="py-2 px-4 border-b">{worker.id}</td>
        <td className="py-2 px-4 border-b">{worker.first_name}</td>
        <td className="py-2 px-4 border-b">{worker.middle_name || "-"}</td>
        <td className="py-2 px-4 border-b">{worker.last_name}</td>
        <td className="py-2 px-4 border-b">{worker.birthday}</td>
        <td className="py-2 px-4 border-b">{worker.department_name}</td>
        <td className="py-2 px-4 border-b space-x-2">
          <ButtonComponent
            label="Details"
            type={ButtonType.Info}
            onClick={() => toggleRow(worker.id, "details")}
          />
          <ButtonComponent
            label="Employment"
            type={ButtonType.Secondary}
            onClick={() => toggleRow(worker.id, "employment")}
          />
          <ButtonComponent
            label="Edit"
            type={ButtonType.Primary}
            onClick={() => onEdit(worker)}
          />
          <ButtonComponent
            label="Delete"
            type={ButtonType.Danger}
            onClick={() => onDelete(worker)}
          />
        </td>
      </tr>
      {expandedRows[worker.id] && <ExpandedRows expandedRows={expandedRows} worker={worker}/>}
    </React.Fragment>
  );
};
