import { PayrollDetail } from "../../../types/Worker";

interface PayrollDetailsTabProps {
  payrollDetail: PayrollDetail;
}

const PayrollDetailsTab: React.FC<PayrollDetailsTabProps> = ({ payrollDetail }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold">Szczegóły Wynagrodzenia</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Adres */}
        <div>
          <strong className="text-gray-700">Adres:</strong>
          <p className="text-gray-600">{payrollDetail.address}</p>
        </div>

        {/* Narodowość */}
        <div>
          <strong className="text-gray-700">Narodowość:</strong>
          <p className="text-gray-600">{payrollDetail.nationality}</p>
        </div>

        {/* Klasa podatkowa */}
        <div>
          <strong className="text-gray-700">Klasa Podatkowa:</strong>
          <p className="text-gray-600">{payrollDetail.tax_class}</p>
        </div>

        {/* Ulga podatkowa na dzieci */}
        <div>
          <strong className="text-gray-700">Ulga Podatkowa na Dzieci:</strong>
          <p className="text-gray-600">{payrollDetail.children_tax_allowance}</p>
        </div>

        {/* Numer identyfikacji podatkowej */}
        <div>
          <strong className="text-gray-700">Numer Identyfikacji Podatkowej:</strong>
          <p className="text-gray-600">{payrollDetail.tax_id_number}</p>
        </div>

        {/* Numer ubezpieczenia społecznego */}
        <div>
          <strong className="text-gray-700">Numer Ubezpieczenia Społecznego:</strong>
          <p className="text-gray-600">{payrollDetail.social_security_number}</p>
        </div>

        {/* Dostawca ubezpieczenia zdrowotnego */}
        <div>
          <strong className="text-gray-700">Dostawca Ubezpieczenia Zdrowotnego:</strong>
          <p className="text-gray-600">{payrollDetail.health_insurance_provider}</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailsTab;