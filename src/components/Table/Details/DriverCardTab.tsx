// // src/components/DepartmentTab.tsx
// import React from 'react';
// import { DriverCard } from '../../../types/Worker';

// interface DriverCardTabProps {
//   driverCards: DriverCard[];
// }

// const DriverCardTab: React.FC<DriverCardTabProps> = ({ driverCards }) => {
//   if (driverCards.length === 0) {
//     return <p>Brak danych dotyczących kart kierowców.</p>;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//         <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//           <tr>
//             <th className="py-3 px-6 text-left">Numer Karty</th>
//             <th className="py-3 px-6 text-left">Wydawca</th>
//             <th className="py-3 px-6 text-left">Numer Prawa Jazdy</th>
//             <th className="py-3 px-6 text-left">Data Wydania</th>
//             <th className="py-3 px-6 text-left">Data Wygaśnięcia</th>
//             <th className="py-3 px-6 text-left">Status</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-600 text-sm font-light">
//           {driverCards.map((card) => (
//             <tr key={card.id} className="border-b border-gray-200 hover:bg-gray-100">
//               <td className="py-3 px-6 text-left">{card.card_number}</td>
//               <td className="py-3 px-6 text-left">{card.issuing_authority}</td>
//               <td className="py-3 px-6 text-left">{card.driving_license_number}</td>
//               <td className="py-3 px-6 text-left">
//                 {new Date(card.date_issued).toLocaleDateString()}
//               </td>
//               <td className="py-3 px-6 text-left">
//                 {new Date(card.valid_until).toLocaleDateString()}
//               </td>
//               <td className="py-3 px-6 text-left">
//                 {card.active ? (
//                   <span className="flex items-center text-green-500">
//                     Aktywny
//                   </span>
//                 ) : (
//                   <span className="flex items-center text-red-500">
//                     Nieaktywny
//                   </span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DriverCardTab;
// src/components/DriverCardTab.tsx
// src/components/DriverCardTab.tsx
// src/components/DriverCardTab.tsx
import React, { useState } from 'react';
import { DriverCard } from '../../../types/Worker';

interface DriverCardTabProps {
  driverCards: DriverCard[];
}

const DriverCardTab: React.FC<DriverCardTabProps> = ({ driverCards }) => {
  // State for Active and Expired columns
  const [activeCards, setActiveCards] = useState<DriverCard[]>(
    driverCards.filter(card => card.active)
  );
  const [expiredCards, setExpiredCards] = useState<DriverCard[]>(
    driverCards.filter(card => !card.active)
  );

  // State to keep track of the dragged card
  const [draggedCard, setDraggedCard] = useState<DriverCard | null>(null);

  // Handlers for drag events
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: DriverCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
    // Optional: Set data for accessibility
    e.dataTransfer.setData('text/plain', card.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow a drop
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'active' | 'expired') => {
    e.preventDefault();
    if (!draggedCard) return;

    // Determine source and target lists
    const sourceList = draggedCard.active ? activeCards : expiredCards;
    const targetList = target === 'active' ? activeCards : expiredCards;

    // Remove the card from the source list
    const updatedSource = sourceList.filter(card => card.id !== draggedCard.id);
    if (draggedCard.active) {
      setActiveCards(updatedSource);
    } else {
      setExpiredCards(updatedSource);
    }

    // Toggle the active status
    const updatedCard = { ...draggedCard, active: target === 'active' };
    if (target === 'active') {
      setActiveCards(prev => [...prev, updatedCard]);
    } else {
      setExpiredCards(prev => [...prev, updatedCard]);
    }

    // Reset dragged card
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  // Render a single Driver Card
  const renderDriverCard = (card: DriverCard) => (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => handleDragStart(e, card)}
      onDragEnd={handleDragEnd}
      className="bg-white shadow-lg rounded-lg p-6 mb-4 cursor-grab transform hover:scale-105 transition-transform duration-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{card.card_number}</h3>
        {card.active ? (
          <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">Active</span>
        ) : (
          <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">Expired</span>
        )}
      </div>
      <p><strong>Issuer:</strong> {card.issuing_authority}</p>
      <p><strong>License Number:</strong> {card.driving_license_number}</p>
      <p><strong>Issued On:</strong> {new Date(card.date_issued).toLocaleDateString()}</p>
      <p><strong>Valid Until:</strong> {new Date(card.valid_until).toLocaleDateString()}</p>
    </div>
  );

  // If there are no driver cards initially
  if (driverCards.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Brak danych dotyczących kart kierowców.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-6">
      {/* Active Licenses Column */}
      <div
        className="w-full md:w-1/2 bg-gradient-to-r from-green-200 to-green-100 p-4 rounded-xl shadow-inner"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'active')}
      >
        <h2 className="text-2xl font-bold text-green-800 mb-4">Active Licenses</h2>
        <div className="space-y-4">
          {activeCards.length === 0 ? (
            <p className="text-gray-600">No active driver cards.</p>
          ) : (
            activeCards.map(renderDriverCard)
          )}
        </div>
      </div>

      {/* Expired Licenses Column */}
      <div
        className="w-full md:w-1/2 bg-gradient-to-r from-red-200 to-red-100 p-4 rounded-xl shadow-inner"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'expired')}
      >
        <h2 className="text-2xl font-bold text-red-800 mb-4">Expired Licenses</h2>
        <div className="space-y-4">
          {expiredCards.length === 0 ? (
            <p className="text-gray-600">No expired driver cards.</p>
          ) : (
            expiredCards.map(renderDriverCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverCardTab;
