import React from 'react'

interface PropsComponentName {
    name: string
}
export const ComponentName:React.FC<PropsComponentName> = ({name}) => {
  return (
    <div className="flex justify-between items-center p-6">
    <h1 className="text-xl font-bold">{name}</h1>
  </div>
  )
}
