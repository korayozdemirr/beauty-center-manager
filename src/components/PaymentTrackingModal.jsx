import React, { useState, useEffect } from 'react';

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

  // Reset state when modal opens or plan changes
  useEffect(() => {
    if (isOpen) {
      setSelectedInstallment(null);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentAmount('');
      setError('');
    }
  }, [isOpen, paymentPlan]);

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

  // Calculate totals - Robust calculation handling both old (boolean) and new (paidAmount) structures
  const calculateTotals = () => {
    if (!actualPaymentPlan || !actualPaymentPlan.installments) {
      return { total: 0, paid: 0, remaining: 0 };
    }

    const total = actualPaymentPlan.totalAmount;
    
    const paid = actualPaymentPlan.installments.reduce((sum, inst) => {
      // If paidAmount exists, use it. 
      // Fallback: If paid is true, use full amount. Else 0.
      if (inst.paidAmount !== undefined) {
        return sum + Number(inst.paidAmount);
      }
      return sum + (inst.paid ? Number(inst.amount) : 0);
    }, 0);

    return {
      total: total,
      paid: paid,
      remaining: total - paid
    };
  };

  const totals = calculateTotals();

  const handleInstallmentSelect = (installment) => {
    // If selecting an installment, default the payment amount to the remaining debt of that installment
    const currentPaid = installment.paidAmount !== undefined 
      ? installment.paidAmount 
      : (installment.paid ? installment.amount : 0);
    
    const remainingForThisInstallment = installment.amount - currentPaid;
    
    setSelectedInstallment(installment);
    setPaymentAmount(remainingForThisInstallment > 0 ? remainingForThisInstallment.toString() : '');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedInstallment || !paymentDate || !paymentAmount) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    const amountToPay = parseFloat(paymentAmount);
    if (isNaN(amountToPay) || amountToPay <= 0) {
      setError('Geçerli bir ödeme tutarı giriniz');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Clone installments to avoid direct mutation
      let updatedInstallments = [...actualPaymentPlan.installments];
      let remainingMoneyToDistribute = amountToPay;
      
      // Find the starting index
      const startIndex = updatedInstallments.findIndex(inst => inst.index === selectedInstallment.index);
      
      if (startIndex === -1) throw new Error("Taksit bulunamadı");

      // Distribute payment sequentially starting from selected installment
      for (let i = startIndex; i < updatedInstallments.length; i++) {
        if (remainingMoneyToDistribute <= 0) break;

        const inst = { ...updatedInstallments[i] };
        
        // Calculate how much is already paid for this installment
        const previouslyPaid = inst.paidAmount !== undefined 
          ? inst.paidAmount 
          : (inst.paid ? inst.amount : 0);
        
        const debtForThis = inst.amount - previouslyPaid;
        
        if (debtForThis > 0) {
          // How much we can pay for this installment
          const payHere = Math.min(debtForThis, remainingMoneyToDistribute);
          
          const newPaidAmount = previouslyPaid + payHere;
          
          inst.paidAmount = newPaidAmount;
          inst.paid = newPaidAmount >= inst.amount - 0.01; // Tolerance for float math
          // Track the latest payment date for records
          if (payHere > 0) {
             inst.paymentDate = new Date(paymentDate); // Update last payment date
          }

          updatedInstallments[i] = inst;
          remainingMoneyToDistribute -= payHere;
        }
      }

      // If there is still money left (Overpayment beyond all future installments)
      // We could add it to the last installment or handle it separately.
      // For now, let's add it to the last installment just to record it, or log a warning.
      // Or we can just leave it as 'tip'/extra. Let's add to the last installment's paidAmount for tracking.
      if (remainingMoneyToDistribute > 0) {
        const lastIdx = updatedInstallments.length - 1;
        const lastInst = { ...updatedInstallments[lastIdx] };
        const prevPaid = lastInst.paidAmount !== undefined ? lastInst.paidAmount : (lastInst.paid ? lastInst.amount : 0);
        lastInst.paidAmount = prevPaid + remainingMoneyToDistribute;
        lastInst.paid = true; 
        lastInst.paymentDate = new Date(paymentDate);
        updatedInstallments[lastIdx] = lastInst;
      }

      // Calculate paid installments count (fully paid ones)
      const fullyPaidCount = updatedInstallments.filter(inst => inst.paid).length;
      
      // Check total paid for status
      const totalPaidAmount = updatedInstallments.reduce((sum, inst) => sum + (inst.paidAmount || (inst.paid ? inst.amount : 0)), 0);
      const isCompleted = totalPaidAmount >= actualPaymentPlan.totalAmount - 1; // Tolerance

      // Prepare updated payment plan data
      const updatedPaymentPlan = {
        ...actualPaymentPlan,
        installments: updatedInstallments,
        paidInstallments: fullyPaidCount,
        status: isCompleted ? 'completed' : 'ongoing'
      };

      // Call the parent function to update the payment
      await onPaymentMade(updatedPaymentPlan);
      
      // Reset form and close
      setSelectedInstallment(null);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentAmount('');
      onClose(); // Optional: Close modal or stay open? User usually prefers closing after success.
    } catch (err) {
      setError('Ödeme kaydı sırasında bir hata oluştu: ' + err.message);
      console.error('Error recording payment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get display data for an installment
  const getInstallmentDisplayData = (inst) => {
    const paidAmt = inst.paidAmount !== undefined ? inst.paidAmount : (inst.paid ? inst.amount : 0);
    const remaining = inst.amount - paidAmt;
    const isFullyPaid = remaining <= 0.01;
    return { paidAmt, remaining, isFullyPaid };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
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
          
          {/* Summary Card */}
          <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-3">Ödeme Özeti</h4>
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
              <div>
                <div className="text-sm text-gray-500 mb-1">Toplam Borç</div>
                <div className="text-lg font-bold text-gray-800">{totals.total.toLocaleString()} ₺</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Toplam Ödenen</div>
                <div className="text-lg font-bold text-green-600">{totals.paid.toLocaleString()} ₺</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Kalan Borç</div>
                <div className="text-lg font-bold text-rose-600">{totals.remaining.toLocaleString()} ₺</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>İlerleme</span>
                <span>%{Math.round((totals.paid / totals.total) * 100) || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((totals.paid / totals.total) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Payment Form - when an installment is selected */}
          {selectedInstallment && (
            <div className="mb-6 bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm animate-fade-in">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-blue-900">Ödeme Yap</h4>
                <button 
                  onClick={() => setSelectedInstallment(null)}
                  className="text-blue-400 hover:text-blue-600"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Taksit Bilgisi
                  </label>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                    <div className="font-semibold text-gray-800">Taksit #{selectedInstallment.index}</div>
                    <div className="text-gray-600">
                      Tutar: {selectedInstallment.amount} ₺
                      {getInstallmentDisplayData(selectedInstallment).paidAmt > 0 && (
                        <span className="text-green-600 ml-2">
                          (Ödenen: {getInstallmentDisplayData(selectedInstallment).paidAmt} ₺)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-blue-800 mb-1">
                    Kalan Borç (Bu Taksit)
                  </label>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-gray-800 font-bold">
                    {Math.max(0, getInstallmentDisplayData(selectedInstallment).remaining).toLocaleString()} ₺
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Ödeme Tarihi *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Ödenecek Tutar (TL) *
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition font-bold text-gray-800"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className={`px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'İşleniyor...' : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Ödemeyi Onayla
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Installments List */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800">Taksit Planı</h4>
            
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ödenen</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kalan</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {actualPaymentPlan.installments && actualPaymentPlan.installments.map((inst, index) => {
                     const { paidAmt, remaining, isFullyPaid } = getInstallmentDisplayData(inst);
                     
                     return (
                      <tr key={index} className={`hover:bg-gray-50 transition-colors ${selectedInstallment?.index === inst.index ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{inst.index}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-bold">
                          {inst.amount} ₺
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                          {paidAmt > 0 ? `${paidAmt} ₺` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-rose-600 font-medium">
                          {remaining > 0 ? `${remaining.toLocaleString()} ₺` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isFullyPaid ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Tamamlandı
                            </span>
                          ) : (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paidAmt > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                              {paidAmt > 0 ? 'Kısmi Ödeme' : 'Bekliyor'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          {!isFullyPaid && (
                            <button
                              onClick={() => handleInstallmentSelect(inst)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Öde
                            </button>
                          )}
                          {isFullyPaid && inst.paymentDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(inst.paymentDate.seconds ? inst.paymentDate.seconds * 1000 : inst.paymentDate).toLocaleDateString('tr-TR')}
                            </span>
                          )}
                        </td>
                      </tr>
                     );
                   })}
                </tbody>
              </table>
            </div>

            {(!actualPaymentPlan.installments || actualPaymentPlan.installments.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>Görüntülenecek taksit bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTrackingModal;