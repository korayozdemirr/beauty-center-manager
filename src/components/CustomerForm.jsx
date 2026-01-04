import React from 'react';

const CustomerForm = ({
  showForm,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  editingCustomer
}) => {
  return (
    showForm && (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editingCustomer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Ad Soyad *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="Müşterinin adını girin"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="555 123 45 67"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="birthDate">
                Doğum Tarihi
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
                Notlar
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="Müşteriye ait özel notlar"
                rows="3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              {editingCustomer ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default CustomerForm;