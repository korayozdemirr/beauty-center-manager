import React, { useState } from 'react';

const PaymentTrackingModal = ({ 
  customer, 
  paymentPlan, 
  isOpen, 
  onClose, 
  onPaymentMade 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!isOpen) return null;
  
  // Handle the case where paymentPlan is actually a customer package with payment plan info
  const actualPaymentPlan = paymentPlan?.paymentPlanId ? {
    id: paymentPlan.paymentPlanId,
    packageName: paymentPlan.packageName,
    totalAmount: paymentPlan.totalPrice,
    installmentCount: paymentPlan.installmentCount,
    installmentAmount: paymentPlan.installmentAmount,
    paidInstallments: paymentPlan.paidInstallments || 0,
    status: paymentPlan.status,
    installments: paymentPlan.installments || [],
    customerId: paymentPlan.customerId
  } : paymentPlan;

  const handlePaymentSubmit = async () => {
    if (!selectedInstallment || !paymentDate) {
      setError('Lütfen taksit ve ödeme tarihini seçin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Update the installment as paid
      const updatedInstallments = paymentPlan.installments.map(installment => {
        if (installment.index === selectedInstallment.index) {
          return {
            ...installment,
            paid: true,
            paymentDate: new Date(paymentDate),
            amount: selectedInstallment.amount
          };
        }
        return installment;
      });

      // Calculate paid installments count
      const paidInstallments = updatedInstallments.filter(inst => inst.paid).length;

      // Prepare updated payment plan data
      const updatedPaymentPlan = {
        ...actualPaymentPlan,
        installments: updatedInstallments,
        paidInstallments: paidInstallments,
        status: paidInstallments === actualPaymentPlan.installmentCount ? 'completed' : 'ongoing'
      };

      // Call the parent function to update the payment
      await onPaymentMade(updatedPaymentPlan);
      
      // Reset form and close
      setSelectedInstallment(null);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (err) {
      setError('Ödeme kaydı sırasında bir hata oluştu: ' + err.message);
      console.error('Error recording payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const unpaidInstallments = actualPaymentPlan.installments?.filter(inst => !inst.paid) || [];
  const paidInstallments = actualPaymentPlan.installments?.filter(inst => inst.paid) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {customer?.name || customer?.customerName || 'Müşteri'} - Ödeme Takibi
            </h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-rose-100 mt-1">{actualPaymentPlan.packageName || 'Paket'}</p>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3">Paket Bilgileri</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium text-gray-700">Paket Adı:</span> {actualPaymentPlan.packageName}</div>
                <div><span className="font-medium text-gray-700">Toplam Tutar:</span> {actualPaymentPlan.totalAmount} ₺</div>
                <div><span className="font-medium text-gray-700">Taksit Sayısı:</span> {actualPaymentPlan.installmentCount}</div>
                <div><span className="font-medium text-gray-700">Taksit Tutarı:</span> {actualPaymentPlan.installmentAmount} ₺</div>
                <div><span className="font-medium text-gray-700">Ödenen:</span> {actualPaymentPlan.paidInstallments || 0} / {actualPaymentPlan.installmentCount}</div>
                <div><span className="font-medium text-gray-700">Durum:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    actualPaymentPlan.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {actualPaymentPlan.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unpaid Installments */}
          {unpaidInstallments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Ödenmemiş Taksitler</h4>
              <div className="space-y-3">
                {unpaidInstallments.map((installment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">Taksit #{installment.index}</div>
                      <div className="text-sm text-gray-600">{installment.amount} ₺</div>
                    </div>
                    <div>
                      <button
                        onClick={() => setSelectedInstallment(installment)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Ödeme Yap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Form - when an installment is selected */}
          {selectedInstallment && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-bold text-blue-800 mb-3">Ödeme Kaydı</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taksit Bilgisi
                  </label>
                  <div className="bg-white p-3 rounded border">
                    <div>Taksit #{selectedInstallment.index} - {selectedInstallment.amount} ₺</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ödeme Tarihi *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedInstallment(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className={`px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'İşleniyor...' : 'Ödeme Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paid Installments */}
          {paidInstallments.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Ödenmiş Taksitler</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taksit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödeme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paidInstallments.map((installment, index) => (
                      <tr key={index} className="bg-green-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{installment.index}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {installment.amount} ₺
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {installment.paymentDate ? new Date(installment.paymentDate.seconds * 1000).toLocaleDateString('tr-TR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {unpaidInstallments.length === 0 && paidInstallments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz ödeme bilgisi yok</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={loading}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTrackingModal;