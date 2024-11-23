import React from 'react'

interface PropsSwitch {
    switchValue: boolean;
    handleSwitch: () => void
}

export const Switch:React.FC<PropsSwitch> = ({switchValue, handleSwitch}) => {
  return (
    <div className="flex items-center">
    <div className="relative">
      <input
        type="checkbox"
        id="edit-mode-toggle"
        className="sr-only"
        checked={switchValue}
        onChange={handleSwitch}
      />
      <div
        onClick={handleSwitch}
        className={`w-12 h-6 bg-gray-400 rounded-full shadow-inner transition-colors duration-300 cursor-pointer ${
          switchValue ? "bg-blue-500" : ""
        }`}
      ></div>
      <div
        onClick={handleSwitch}
        className={`dot cursor-pointer absolute left-0 top-0 w-6 h-6 bg-white border-2 border-gray-400 rounded-full transition-transform duration-300 transform ${
          switchValue ? "translate-x-6 border-blue-500" : ""
        }`}
      ></div>
    </div>
  </div>
  )
}
