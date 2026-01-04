import React from 'react';

const Header = ({ currentPage, setCurrentPage, currentUser, handleLogout, isMobileMenuOpen, setIsMobileMenuOpen, setSelectedCustomer }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CD</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">Çağla Dağ Güzellik Merkezi</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => {setCurrentPage('dashboard'); setSelectedCustomer(null);}}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'dashboard'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Panel
              </button>
              <button
                onClick={() => {setCurrentPage('customers'); setSelectedCustomer(null);}}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'customers'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Müşteriler
              </button>
              <button
                onClick={() => {setCurrentPage('appointments'); setSelectedCustomer(null);}}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'appointments'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Randevular
              </button>
              <button
                onClick={() => {setCurrentPage('packages'); setSelectedCustomer(null);}}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'packages'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Paketler
              </button>
              <button
                onClick={() => {setCurrentPage('settings'); setSelectedCustomer(null);}}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'settings'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Ayarlar
              </button>
            </nav>
            
            <div className="ml-4 flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {currentUser?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors duration-200"
                  >
                    Çıkış
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
            >
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                setIsMobileMenuOpen(false);
                setSelectedCustomer(null);
              }}
              className={`block px-4 py-2 text-base font-medium w-full text-left rounded-md ${
                currentPage === 'dashboard'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Panel
            </button>
            <button
              onClick={() => {
                setCurrentPage('customers');
                setIsMobileMenuOpen(false);
                setSelectedCustomer(null);
              }}
              className={`block px-4 py-2 text-base font-medium w-full text-left rounded-md ${
                currentPage === 'customers'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Müşteriler
            </button>
            <button
              onClick={() => {
                setCurrentPage('appointments');
                setIsMobileMenuOpen(false);
                setSelectedCustomer(null);
              }}
              className={`block px-4 py-2 text-base font-medium w-full text-left rounded-md ${
                currentPage === 'appointments'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Randevular
            </button>
            <button
              onClick={() => {
                setCurrentPage('packages');
                setIsMobileMenuOpen(false);
                setSelectedCustomer(null);
              }}
              className={`block px-4 py-2 text-base font-medium w-full text-left rounded-md ${
                currentPage === 'packages'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Paketler
            </button>
            <button
              onClick={() => {
                setCurrentPage('settings');
                setIsMobileMenuOpen(false);
                setSelectedCustomer(null);
              }}
              className={`block px-4 py-2 text-base font-medium w-full text-left rounded-md ${
                currentPage === 'settings'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Ayarlar
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-base font-medium w-full text-left rounded-md text-rose-600 hover:bg-gray-100 hover:text-rose-800"
            >
              Çıkış
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;