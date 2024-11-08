import React from 'react'
import { Worker } from '../../../types/Worker'

interface PropsDetailsMainInfo {
    worker: Worker
}

export const DetailsMainInfo:React.FC<PropsDetailsMainInfo> = ({worker}) => {
  return (
    <div className="mb-6">
    <p>
      <strong>ID:</strong> {worker.id}
    </p>
    <p>
      <strong>Imię:</strong> {worker.first_name}
    </p>
    <p>
      <strong>Drugie Imię:</strong> {worker.middle_name || '-'}
    </p>
    <p>
      <strong>Nazwisko:</strong> {worker.last_name}
    </p>
    <p>
      <strong>Data Urodzenia:</strong> {worker.birthday}
    </p>
    <p>
      <strong>Dział:</strong> {worker.department_name}
    </p>
  </div>
  )
}
