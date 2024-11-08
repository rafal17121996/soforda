// src/components/AdminLayout.tsx
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode | ReactNode[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Przekształć children w tablicę, aby łatwiej operować na liczbie komponentów
  const childrenArray = React.Children.toArray(children);

  const count = childrenArray.length;

  // Funkcja pomocnicza do renderowania komponentów w odpowiednim układzie
  const renderLayout = () => {
    switch (count) {
      case 1:
        return <div className="w-full bg-white">{childrenArray[0]}</div>;
      case 2:
        return (
          <div className="flex flex-col h-full  gap-4 ">
            {childrenArray.map((child, index) => (
              <div key={index} className="w-full bg-white rounded-xl overflow-hidden">
                {child}
              </div>
            ))}
          </div>
        );
        case 3:
          return (
            <div className="flex flex-col h-full  gap-4">
              <div className="w-full bg-white rounded-xl overflow-hidden">
                {childrenArray[0]}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full bg-white rounded-xl overflow-hidden">
                  {childrenArray[1]}
                </div>
                <div className="w-full bg-white rounded-xl overflow-hidden">
                  {childrenArray[2]}
                </div>
              </div>
            </div>
          );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-4  h-full ">
            {childrenArray.map((child, index) => (
              <div key={index} className="w-full bg-white rounded-xl overflow-hidden">
                {child}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 gap-4  h-full ">
            {childrenArray.map((child, index) => (
              <div key={index} className="w-full bg-white rounded-xl overflow-hidden">
                {child}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 grow p-6 rounded-xl">{renderLayout()}</div>
  );
};

export default AdminLayout;
