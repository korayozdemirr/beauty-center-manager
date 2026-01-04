import React, { useState } from 'react';

const AppointmentList = ({ appointments, customers, handleEdit, handleDelete, formatDate, formatTime, isSimpleView = false }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper to get status label and styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Onaylandı</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">Tamamlandı</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">İptal</span>;
      case 'no_show':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Gelmendi</span>;
      case 'pending':
      default:
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Bekliyor</span>;
    }
  };

  // If it's simple view (for AppointmentsList), don't group by date
  if (isSimpleView) {
    // Add customer information to appointments for simple view
    const appointmentsWithCustomer = appointments.map(appointment => {
      const customer = customers.find(c => c.id === appointment.customerId) || { name: 'Bilinmeyen', phone: '' };
      return {
        ...appointment,
        customerName: customer.name,
        customerPhone: customer.phone
      };
    });

    // Sort appointments by date and time
    const sortedAppointments = [...appointmentsWithCustomer].sort((a, b) => {
      const timeA = new Date(a.date.seconds * 1000);
      const timeB = new Date(b.date.seconds * 1000);
      return timeA - timeB;
    });

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih & Saat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(new Date(appointment.date.seconds * 1000))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(new Date(appointment.date.seconds * 1000))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.customerName}</div>
                      <div className="text-sm text-gray-500">{appointment.customerPhone || 'Telefon yok'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                      {(appointment.service === 'buz lazer' || appointment.service === 'alex lazer' || appointment.service === 'lazer epilasyon') && appointment.laserAreas && appointment.laserAreas.length > 0 && (
                        <div className="mt-1">
                          {appointment.laserAreas.map(area => {
                            const areaLabels = {
                              'yuz': 'Yüz',
                              'koltuk_alti': 'Koltuk Altı',
                              'kol': 'Kol',
                              'bacak': 'Bacak',
                              'bikini': 'Bikini',
                              'sirt': 'Sırt',
                              'gogus': 'Göğüs'
                            };
                            return (
                              <span key={area} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {areaLabels[area] || area}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Randevu bulunamadı</h3>
                      <p className="text-gray-500">Başlamak için yeni bir randevu planlayın.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Filter appointments based on status
  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(appt => (appt.status || 'pending') === statusFilter);

  // Group appointments by date (for Appointments view)
  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    const date = new Date(appointment.date.seconds * 1000);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    // Add customer information to appointment
    const customer = customers.find(c => c.id === appointment.customerId);
    const appointmentWithCustomer = {
      ...appointment,
      customerName: customer ? customer.name : 'Bilinmeyen Müşteri',
      customerPhone: customer ? customer.phone : ''
    };

    groups[dateKey].push(appointmentWithCustomer);
    return groups;
  }, {});

  // Sort dates (from today onwards)
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      {/* Filters */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Durum Filtresi:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">Tümü</option>
            <option value="pending">Bekliyor</option>
            <option value="confirmed">Onaylandı</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
            <option value="no_show">Gelmendi</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notlar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDates.length > 0 ? (
              sortedDates.map(date => {
                const dayAppointments = groupedAppointments[date];
                // Sort appointments by time within each day
                const sortedAppointments = [...dayAppointments].sort((a, b) => {
                  const timeA = new Date(a.date.seconds * 1000);
                  const timeB = new Date(b.date.seconds * 1000);
                  return timeA - timeB;
                });

                return sortedAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {index === 0 ? formatDate(new Date(appointment.date.seconds * 1000)) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(new Date(appointment.date.seconds * 1000))}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.customerName}</div>
                      {appointment.customerPhone && (
                        <div className="text-sm text-gray-500">{appointment.customerPhone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                      {(appointment.service === 'buz lazer' || appointment.service === 'alex lazer' || appointment.service === 'lazer epilasyon') && appointment.laserAreas && appointment.laserAreas.length > 0 && (
                        <div className="mt-1">
                          {appointment.laserAreas.map(area => {
                            const areaLabels = {
                              'yuz': 'Yüz',
                              'koltuk_alti': 'Koltuk Altı',
                              'kol': 'Kol',
                              'bacak': 'Bacak',
                              'bikini': 'Bikini',
                              'sirt': 'Sırt',
                              'gogus': 'Göğüs'
                            };
                            return (
                              <span key={area} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {areaLabels[area] || area}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.duration} dk</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{appointment.notes || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Randevu bulunamadı</h3>
                    <p className="text-gray-500">Seçilen kriterlere uygun randevu yok veya henüz hiç randevu oluşturulmamış.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;