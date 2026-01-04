import React, { useState, useEffect } from 'react';

const WhatsAppMessaging = ({ customers, onBack }) => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [messageTemplate, setMessageTemplate] = useState('general');
  const [customMessage, setCustomMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [birthdayCustomers, setBirthdayCustomers] = useState([]);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        (customer.phone && customer.phone.includes(term))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Find customers with birthdays today
  useEffect(() => {
    const today = new Date();
    const todayStr = today.getDate() + '/' + (today.getMonth() + 1);
    
    const birthdayCusts = customers.filter(customer => {
      if (customer.birthDate) {
        const birthDate = new Date(customer.birthDate);
        const birthDayMonth = birthDate.getDate() + '/' + (birthDate.getMonth() + 1);
        return birthDayMonth === todayStr;
      }
      return false;
    });
    
    setBirthdayCustomers(birthdayCusts);
  }, [customers]);

  const toggleCustomerSelection = (customer) => {
    setSelectedCustomers(prev => {
      const isSelected = prev.some(c => c.id === customer.id);
      if (isSelected) {
        return prev.filter(c => c.id !== customer.id);
      } else {
        return [...prev, customer];
      }
    });
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...filteredCustomers]);
    }
  };

  const getPredefinedMessage = () => {
    const customerNames = selectedCustomers.map(c => c.name.split(' ')[0]).join(', ');
    
    switch (messageTemplate) {
      case 'birthday':
        return `🎉 Sevgili ${customerNames}, doğum günün kutlu olsun! 😊`;
      case 'newyear':
        return `🎊 Yeni Yılınız sağlık, mutluluk ve başarılar dolu olsun! ${customerNames} 🎊`;
      case 'easter':
        return `🐰 Paskalya Bayramınız kutlu olsun! Mutlu ve huzurlu günler dileriz, ${customerNames} 🐰`;
      case 'eid':
        return `🐑 Ramazan Bayramınız mübarek olsun! Hayırlı bayramlar dileriz, ${customerNames} 🌙`;
      case 'appointment':
        return `Merhaba ${customerNames}, randevunuz yaklaşıyor. Randevu tarihiniz: `;
      case 'general':
      default:
        return `Merhaba ${customerNames}, sizi değerli müşterimiz olarak düşünüyoruz. `;
    }
  };

  const handleSendMessage = () => {
    if (selectedCustomers.length === 0) {
      alert('Lütfen mesaj göndermek için en az bir müşteri seçin.');
      return;
    }

    const message = customMessage || getPredefinedMessage();
    
    selectedCustomers.forEach(customer => {
      if (customer.phone) {
        // Remove any non-digit characters except +
        const cleanPhone = customer.phone.replace(/\D/g, '');
        // Ensure it starts with the country code (assuming Turkey: +90)
        let phoneNumber = cleanPhone;
        if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
          // Add Turkey country code
          phoneNumber = '90' + cleanPhone;
        } else if (!cleanPhone.startsWith('90') && cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
          // Replace leading 0 with 90
          phoneNumber = '90' + cleanPhone.substring(1);
        } else if (!cleanPhone.startsWith('90') && cleanPhone.startsWith('+90')) {
          // Remove + if present
          phoneNumber = cleanPhone.substring(1);
        }
        
        // Open WhatsApp with the message
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        alert(`${customer.name} müşterisinin telefon numarası bulunmamaktadır.`);
      }
    });
  };

  const getWhatsAppLink = (customer, message) => {
    if (!customer.phone) return null;
    
    const cleanPhone = customer.phone.replace(/\D/g, '');
    let phoneNumber = cleanPhone;
    if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
      phoneNumber = '90' + cleanPhone;
    } else if (!cleanPhone.startsWith('90') && cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      phoneNumber = '90' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('90') && cleanPhone.startsWith('+90')) {
      phoneNumber = cleanPhone.substring(1);
    }
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Mesajlaşma</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
        >
          Geri Dön
        </button>
      </div>

      {/* Message Type Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Mesaj Türü Seçin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ön Tanımlı Mesajlar</label>
            <select
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
            >
              <option value="general">Genel Selamlama</option>
              <option value="birthday">Doğum Günü Kutlama</option>
              <option value="newyear">Yılbaşı Dileği</option>
              <option value="eid">Bayram Dileği</option>
              <option value="appointment">Randevu Hatırlatması</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Özel Mesaj</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Kendi mesajınızı yazın..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Oluşturulan Mesaj</label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg min-h-[56px] flex items-center">
              {customMessage || getPredefinedMessage()}
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Reminder */}
      {birthdayCustomers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-800">Doğum Günü Olan Müşteriler</h3>
          </div>
          <div className="mt-2">
            {birthdayCustomers.map(customer => (
              <div key={customer.id} className="flex items-center justify-between py-1">
                <span className="text-yellow-700">{customer.name} - {new Date(customer.birthDate).toLocaleDateString('tr-TR')}</span>
                <a
                  href={getWhatsAppLink(customer, `🎉 Sevgili ${customer.name.split(' ')[0]}, doğum günün kutlu olsun! 😊`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Mesaj Gönder
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Search and Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2 md:mb-0">Müşteriler</h2>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition w-full md:w-64"
            />
            <button
              onClick={selectAllCustomers}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
            >
              {selectedCustomers.length === filteredCustomers.length ? 'Hiçbiri' : 'Tümünü Seç'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600">
            {selectedCustomers.length} müşteri seçildi
            {selectedCustomers.length > 0 && (
              <button
                onClick={() => setSelectedCustomers([])}
                className="ml-2 text-rose-600 hover:text-rose-800 text-sm"
              >
                (temizle)
              </button>
            )}
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Müşteri bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedCustomers.some(c => c.id === customer.id)
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleCustomerSelection(customer)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.phone || 'Telefon yok'}</div>
                      {customer.birthDate && (
                        <div className="text-xs text-gray-500">
                          {new Date(customer.birthDate).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.some(c => c.id === customer.id)}
                      onChange={() => toggleCustomerSelection(customer)}
                      className="ml-auto h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Message Button */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-end">
          <button
            onClick={handleSendMessage}
            disabled={selectedCustomers.length === 0}
            className={`px-6 py-3 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
              selectedCustomers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
            }`}
          >
            WhatsApp ile Mesaj Gönder ({selectedCustomers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessaging;