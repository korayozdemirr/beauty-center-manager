import { useState, useEffect } from 'react';
import { auth } from './firebase/init';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from './services/customerService';
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from './services/appointmentService';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Check auth state on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setCurrentPage('login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-rose-500">
          <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} currentUser={currentUser} />;
      case 'customers':
        return <Customers setCurrentPage={setCurrentPage} currentUser={currentUser} setSelectedCustomer={setSelectedCustomer} />;
      case 'appointments':
        return <Appointments setCurrentPage={setCurrentPage} currentUser={currentUser} selectedCustomer={selectedCustomer} />;
      case 'appointmentsList':
        return <AppointmentsList setCurrentPage={setCurrentPage} currentUser={currentUser} />;
      case 'login':
      default:
        return <Login setCurrentPage={setCurrentPage} />;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('login');
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!currentUser && currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Çağla Dağ Güzellik Merkezi</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-12">
          <Login setCurrentPage={setCurrentPage} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Çağla Dağ Güzellik Merkezi</h1>
          
          <button 
            className="md:hidden text-rose-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <nav className="hidden md:flex space-x-1">
            <button 
              onClick={() => {setCurrentPage('dashboard'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 'dashboard' 
                  ? 'bg-rose-100 text-rose-700 shadow-sm' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => {setCurrentPage('customers'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 'customers' 
                  ? 'bg-rose-100 text-rose-700 shadow-sm' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Customers
            </button>
            <button 
              onClick={() => {setCurrentPage('appointmentsList'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 'appointmentsList' 
                  ? 'bg-rose-100 text-rose-700 shadow-sm' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              All Appointments
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-200"
            >
              Logout
            </button>
          </nav>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm border-t border-rose-100">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
              <button 
                onClick={() => {setCurrentPage('dashboard'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
                className={`px-4 py-2 rounded-lg text-left font-medium ${
                  currentPage === 'dashboard' 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'text-rose-600'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => {setCurrentPage('customers'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
                className={`px-4 py-2 rounded-lg text-left font-medium ${
                  currentPage === 'customers' 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'text-rose-600'
                }`}
              >
                Customers
              </button>
              <button 
                onClick={() => {setCurrentPage('appointmentsList'); setIsMobileMenuOpen(false); setSelectedCustomer(null);}}
                className={`px-4 py-2 rounded-lg text-left font-medium ${
                  currentPage === 'appointmentsList' 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'text-rose-600'
                }`}
              >
                All Appointments
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-left font-medium text-rose-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-1 bg-gradient-to-r from-rose-400 to-purple-500"></div>
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-rose-400 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ setCurrentPage, currentUser }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    todayAppointments: 0,
    upcomingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const data = await loadDashboardData();
      setTodayAppointments(data.todayAppointments);
      setTomorrowAppointments(data.tomorrowAppointments);
    };
    loadData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const customers = await getAllCustomers();
      const appointments = await getAllAppointments();
      
      // Add customer names and phone numbers to appointments
      const appointmentsWithCustomerInfo = appointments.map(appointment => {
        const customer = customers.find(c => c.id === appointment.customerId);
        return {
          ...appointment,
          customerName: customer ? customer.name : 'Unknown Customer',
          customerPhone: customer ? customer.phone : ''
        };
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      
      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(23, 59, 59, 999);
      
      const todayAppointments = appointmentsWithCustomerInfo.filter(app => {
        const appDate = new Date(app.date.seconds * 1000);
        return appDate >= today && appDate <= todayEnd;
      }).length;
      
      const tomorrowAppointments = appointmentsWithCustomerInfo.filter(app => {
        const appDate = new Date(app.date.seconds * 1000);
        return appDate >= tomorrow && appDate <= tomorrowEnd;
      }).length;
      
      const upcomingAppointments = appointmentsWithCustomerInfo.filter(app => {
        const appDate = new Date(app.date.seconds * 1000);
        return appDate > tomorrowEnd;
      }).length;
      
      setStats({
        totalCustomers: customers.length,
        todayAppointments,
        upcomingAppointments
      });
      
      return { 
        todayAppointments: appointmentsWithCustomerInfo.filter(app => {
          const appDate = new Date(app.date.seconds * 1000);
          return appDate >= today && appDate <= todayEnd;
        }), 
        tomorrowAppointments: appointmentsWithCustomerInfo.filter(app => {
          const appDate = new Date(app.date.seconds * 1000);
          return appDate >= tomorrow && appDate <= tomorrowEnd;
        }) 
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      return { todayAppointments: [], tomorrowAppointments: [] };
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-rose-500">
          <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser.email}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setCurrentPage('customers')}
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add New Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-rose-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentPage('customers')}
            className="flex flex-col items-center justify-center p-6 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Customers</span>
          </button>
          
          <button 
            onClick={() => setCurrentPage('appointments')}
            className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">New Appointment</span>
          </button>
          
          <button 
            onClick={() => setCurrentPage('appointmentsList')}
            className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors duration-200"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">All Appointments</span>
          </button>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Settings</span>
          </div>
        </div>
      </div>
      
      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Today's Appointments ({todayAppointments.length})</h3>
          <button 
            onClick={() => setCurrentPage('appointmentsList')}
            className="text-sm text-rose-600 hover:text-rose-800 font-medium"
          >
            View All
          </button>
        </div>
        
        {todayAppointments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {todayAppointments.map(appointment => {
              const appDate = new Date(appointment.date.seconds * 1000);
              return (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.service}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.customerName || 'Unknown Customer'}
                    </div>
                    {appointment.customerPhone && (
                      <div className="text-xs text-gray-500">
                        {appointment.customerPhone}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No appointments scheduled for today</p>
          </div>
        )}
      </div>
      
      {/* Tomorrow's Appointments */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Tomorrow's Appointments ({tomorrowAppointments.length})</h3>
          <button 
            onClick={() => setCurrentPage('appointmentsList')}
            className="text-sm text-rose-600 hover:text-rose-800 font-medium"
          >
            View All
          </button>
        </div>
        
        {tomorrowAppointments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {tomorrowAppointments.map(appointment => {
              const appDate = new Date(appointment.date.seconds * 1000);
              return (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.service}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.customerName || 'Unknown Customer'}
                    </div>
                    {appointment.customerPhone && (
                      <div className="text-xs text-gray-500">
                        {appointment.customerPhone}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No appointments scheduled for tomorrow</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Customers = ({ setCurrentPage, currentUser, setSelectedCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const customerList = await getAllCustomers();
      setCustomers(customerList);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setEditingCustomer(null);
      setShowForm(false);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      notes: customer.notes || ''
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleSelectForAppointment = (customer) => {
    setSelectedCustomer(customer);
    setCurrentPage('appointments');
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setEditingCustomer(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-rose-500">
          <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your clients and their information</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
                  Notes
                </label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="Special requests or notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {customer.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleSelectForAppointment(customer)}
                      className="text-rose-600 hover:text-rose-900 mr-3"
                    >
                      Schedule
                    </button>
                    <button 
                      onClick={() => handleEdit(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                      <p className="text-gray-500">Get started by adding a new customer.</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Add Customer
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Appointments = ({ setCurrentPage, currentUser, selectedCustomer }) => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!selectedCustomer);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    customerId: selectedCustomer?.id || '',
    date: '',
    time: '',
    service: '',
    notes: '',
    duration: '60'
  });

  useEffect(() => {
    loadAppointments();
    loadCustomers();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const appointmentList = await getAllAppointments();
      setAppointments(appointmentList);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const customerList = await getAllCustomers();
      setCustomers(customerList);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const checkForConflicts = (newDate, durationMinutes = 60) => {
    const newStart = new Date(newDate);
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60000);
    
    return appointments.some(appointment => {
      const existingStart = new Date(appointment.date.seconds * 1000);
      const existingDuration = appointment.duration || 60;
      const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);
      
      // Check if appointments overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Check for conflicts
      if (checkForConflicts(appointmentDateTime, parseInt(formData.duration) || 60)) {
        if (!window.confirm('There is already an appointment scheduled at this time. Do you want to proceed anyway?')) {
          return;
        }
      }
      
      const appointmentData = {
        ...formData,
        date: appointmentDateTime,
        customerId: formData.customerId,
        service: formData.service,
        notes: formData.notes,
        duration: parseInt(formData.duration) || 60
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      
      setFormData({ customerId: selectedCustomer?.id || '', date: '', time: '', service: '', notes: '', duration: '60' });
      setEditingAppointment(null);
      setShowForm(false);
      loadAppointments();
      
      if (selectedCustomer) {
        setCurrentPage('customers');
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    const dateObj = new Date(appointment.date.seconds * 1000);
    const dateStr = dateObj.toISOString().split('T')[0];
    const timeStr = dateObj.toTimeString().slice(0, 5);
    
    setFormData({
      customerId: appointment.customerId,
      date: dateStr,
      time: timeStr,
      service: appointment.service || '',
      notes: appointment.notes || '',
      duration: appointment.duration?.toString() || '60'
    });
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(appointmentId);
        loadAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ customerId: selectedCustomer?.id || '', date: '', time: '', service: '', notes: '', duration: '60' });
    setEditingAppointment(null);
    setShowForm(false);
    setSelectedDate(null);
    
    if (selectedCustomer) {
      setCurrentPage('customers');
    }
  };

  const getAppointmentsForMonth = () => {
    return appointments.filter(app => {
      const appDate = new Date(app.date.seconds * 1000);
      return (
        appDate.getMonth() === currentDate.getMonth() &&
        appDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dayDate = new Date(year, month, day);
    
    return appointments.filter(app => {
      const appDate = new Date(app.date.seconds * 1000);
      return (
        appDate.getDate() === day &&
        appDate.getMonth() === month &&
        appDate.getFullYear() === year
      );
    });
  };

  const handleDayClick = (day) => {
    if (!day) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const selectedDateObj = new Date(year, month, day);
    
    setSelectedDate(selectedDateObj);
    
    // Set the date in form data
    setFormData(prev => ({
      ...prev,
      date: selectedDateObj.toISOString().split('T')[0]
    }));
    
    // Show time selector
    setShowTimeSelector(true);
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString.seconds * 1000).toLocaleTimeString('en-US', options);
  };

  const days = getDaysInMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get appointments for the selected date
  const selectedDateAppointments = selectedDate 
    ? appointments.filter(app => {
        const appDate = new Date(app.date.seconds * 1000);
        return (
          appDate.getDate() === selectedDate.getDate() &&
          appDate.getMonth() === selectedDate.getMonth() &&
          appDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-rose-500">
          <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedCustomer ? `New Appointment for ${selectedCustomer.name}` : 'Appointment Calendar'}
          </h1>
          <p className="text-gray-600 mt-1">Schedule and manage your appointments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {!selectedCustomer && (
            <button 
              onClick={() => setCurrentPage('appointmentsList')}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              All Appointments
            </button>
          )}
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {!selectedCustomer && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customerId">
                    Customer *
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone || 'No phone'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedCustomer && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Selected Customer
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{selectedCustomer.name}</div>
                        <div className="text-xs text-gray-500">{selectedCustomer.phone || 'No phone'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="service">
                  Service *
                </label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="Facial, Manicure, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="duration">
                  Duration (minutes) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration || '60'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                  Date *
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
                  Time *
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
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition"
                  placeholder="Special requests or notes"
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                {editingAppointment ? 'Update Appointment' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayAppointments = day ? getAppointmentsForDay(day) : [];
            const isToday = day && 
              day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear();
            const isSelected = selectedDate && 
              day === selectedDate.getDate() && 
              currentDate.getMonth() === selectedDate.getMonth() && 
              currentDate.getFullYear() === selectedDate.getFullYear();
            
            return (
              <div 
                key={index} 
                className={`min-h-20 p-1 border rounded-lg ${
                  day 
                    ? isSelected
                      ? 'bg-purple-100 border-purple-300'
                      : isToday 
                        ? 'bg-rose-50 border-rose-200' 
                        : 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {day && (
                  <>
                    <div 
                      className={`text-right pr-1 text-sm font-medium cursor-pointer ${
                        isSelected 
                          ? 'text-purple-700 font-bold' 
                          : isToday 
                            ? 'text-rose-600' 
                            : 'text-gray-700'
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayAppointments.slice(0, 2).map(app => (
                        <div 
                          key={app.id} 
                          className="text-xs bg-purple-50 text-purple-800 p-1 rounded truncate"
                          title={`${formatDate(app.date)} - ${app.service}`}
                        >
                          <span className="font-medium">{formatDate(app.date)}</span> {app.service}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showTimeSelector && (
        <TimeSlotSelector 
          selectedDate={selectedDate} 
          appointments={appointments} 
          onSelectTime={(time) => {
            setFormData(prev => ({
              ...prev,
              time: time
            }));
            setShowTimeSelector(false);
            setShowForm(true);
          }}
          onCancel={() => {
            setShowTimeSelector(false);
            setSelectedDate(null);
          }}
        />
      )}

      {selectedDate && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Appointments for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-3">
              {selectedDateAppointments.map(appointment => {
                const customer = customers.find(c => c.id === appointment.customerId) || { name: 'Unknown' };
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(appointment.date.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="text-sm text-gray-500">{customer.name}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">{appointment.service}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No appointments scheduled for this day</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments
                .filter(app => new Date(app.date.seconds * 1000) >= new Date())
                .sort((a, b) => new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000))
                .map((appointment) => {
                  const customer = customers.find(c => c.id === appointment.customerId) || { name: 'Unknown' };
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date.seconds * 1000).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.date.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(appointment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {appointments.filter(app => new Date(app.date.seconds * 1000) >= new Date()).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                      <p className="text-gray-500">Schedule a new appointment to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TimeSlotSelector = ({ selectedDate, appointments, onSelectTime, onCancel }) => {
  // Generate time slots from 9:00 AM to 6:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Check if a time slot is occupied
  const isTimeSlotOccupied = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);
    
    return appointments.some(app => {
      const appDate = new Date(app.date.seconds * 1000);
      const appDuration = app.duration || 60;
      const appEndTime = new Date(appDate.getTime() + appDuration * 60000);
      
      return slotTime >= appDate && slotTime < appEndTime;
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white">
          <h3 className="text-xl font-bold">Select Time Slot</h3>
          <p className="text-rose-100 mt-1">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((time, index) => {
              const isOccupied = isTimeSlotOccupied(time);
              return (
                <button
                  key={index}
                  onClick={() => !isOccupied && onSelectTime(time)}
                  disabled={isOccupied}
                  className={`py-3 px-2 text-center rounded-lg transition-all duration-200 ${
                    isOccupied 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 hover:shadow-sm'
                  }`}
                >
                  <div className="font-medium">{time}</div>
                  <div className="text-xs mt-1">
                    {isOccupied ? 'Occupied' : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentsList = ({ setCurrentPage, currentUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    loadAppointments();
    loadCustomers();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const appointmentList = await getAllAppointments();
      setAppointments(appointmentList);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const customerList = await getAllCustomers();
      setCustomers(customerList);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleEdit = (appointment) => {
    // Navigate to the appointments page with the appointment data
    // This would require passing the appointment data to the appointments page
    console.log('Edit appointment:', appointment);
    // For now, we'll just log it - a full implementation would require
    // passing state between components or using a global state management solution
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(appointmentId);
        loadAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return appointments.filter(app => new Date(app.date.seconds * 1000) >= now);
      case 'past':
        return appointments.filter(app => new Date(app.date.seconds * 1000) < now);
      case 'all':
      default:
        return [...appointments];
    }
  };

  const sortedAppointments = getFilteredAppointments().sort((a, b) => new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-rose-500">
          <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage all scheduled appointments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'upcoming'
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'past'
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-200'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'all'
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All
            </button>
          </div>
          <button 
            onClick={() => setCurrentPage('customers')}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAppointments.map((appointment) => {
                const customer = customers.find(c => c.id === appointment.customerId) || { name: 'Unknown' };
                const appointmentDate = new Date(appointment.date.seconds * 1000);
                                const isPast = appointmentDate < new Date();
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date.seconds * 1000).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.date.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        isPast 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          // Since we can't easily pass the appointment data to the other component,
                          // we'll just show an alert for now
                          alert('Editing would be implemented here. In a full app, this would open the edit form.');
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sortedAppointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                      <p className="text-gray-500">Schedule a new appointment to get started.</p>
                      <button
                        onClick={() => setCurrentPage('customers')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Create Appointment
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;