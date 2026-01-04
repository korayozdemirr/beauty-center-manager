import React from 'react';

const AppointmentForm = ({
  showForm,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  customers,
  laserAreas,
  handleLaserAreaChange,
  editingAppointment
}) => {
  return (
    showForm && (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editingAppointment ? 'Randevuyu Düzenle' : 'Yeni Randevu'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {!formData.customerId && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customerId">
                  Müşteri *
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  required
                >
                  <option value="">Bir müşteri seçin</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone || 'Telefon yok'})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.customerId && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Seçilen Müşteri
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {formData.customerId ? customers.find(c => c.id === formData.customerId)?.name.charAt(0).toUpperCase() : ''}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {formData.customerId ? customers.find(c => c.id === formData.customerId)?.name : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData.customerId ? customers.find(c => c.id === formData.customerId)?.phone || 'Telefon yok' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="service">
                Hizmet *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                required
              >
                <option value="">Hizmet Seçin</option>
                <option value="buz lazer">Buz Lazer</option>
                <option value="alex lazer">Alex Lazer</option>
                <option value="cilt bakımı">Cilt Bakımı</option>
                <option value="nail art">Nail Art</option>
                <option value="yağ yakımı">Yağ Yakımı</option>
                <option value="lazer epilasyon">Lazer Epilasyon</option>
                <option value="masaj">Masaj</option>
                <option value="saç kesimi">Saç Kesimi</option>
              </select>
              
              {/* Laser area selection - only show when laser service is selected */}
              {(formData.service === 'buz lazer' || formData.service === 'alex lazer' || formData.service === 'lazer epilasyon') && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Lazer Uygulanacak Bölgeleri Seçin:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      { value: 'yuz', label: 'Yüz' },
                      { value: 'koltuk_alti', label: 'Koltuk Altı' },
                      { value: 'kol', label: 'Kol' },
                      { value: 'bacak', label: 'Bacak' },
                      { value: 'bikini', label: 'Bikini' },
                      { value: 'sirt', label: 'Sırt' },
                      { value: 'gogus', label: 'Göğüs' },
                      { value: 'genital_bolge', label:'Genital Bölge' },
                      { value: 'tam_bacak', label: 'Tam Bacak' },
                      { value: 'yarim_bacak', label: 'Yarım Bacak' },
                    ].map((area) => (
                      <div key={area.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`laser_${area.value}`}
                          checked={(laserAreas || []).includes(area.value)}
                          onChange={() => handleLaserAreaChange(area.value)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`laser_${area.value}`} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {area.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="duration">
                Süre (dakika) *
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration || '60'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                required
              >
                <option value="30">30 dakika</option>
                <option value="60">60 dakika</option>
                <option value="90">90 dakika</option>
                <option value="120">120 dakika</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                Tarih *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="time">
                Saat *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                required
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
                placeholder="Özel istekler veya notlar"
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
              {editingAppointment ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default AppointmentForm;