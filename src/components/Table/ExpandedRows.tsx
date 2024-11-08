import React from "react";
import { ExpansionType } from "./Table";
import { Worker } from "../../types/Worker";
import { Details } from "./Details";
import { Employment } from "./Employment";

interface PropsExpandedRows {
  expandedRows: { [key: number]: ExpansionType };
  worker: Worker;
}

export const ExpandedRows: React.FC<PropsExpandedRows> = ({
  expandedRows,
  worker,
}) => {
  return (
    <tr>
      <td colSpan={7} className="py-2 px-4 border-b bg-gray-50">
        {expandedRows[worker.id] === "details" && <Details worker={worker} />}
        {expandedRows[worker.id] === "employment" && <Employment workerId = {worker.id}/>}
      </td>
    </tr>
  );
};
