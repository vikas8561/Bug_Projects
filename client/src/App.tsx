import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutDashboard, CheckSquare, LogOut, Settings } from 'lucide-react';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { TaskList } from './features/tasks/TaskList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// A simple authentication wrapper
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Main Layout Component
const MainLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    // BUG-002 INJECTED: 
    // We are clearing localStorage, but we FORGOT to clear the React Query cache!
    // queryClient.clear() should be called here.
    // If a different user logs in on this same browser, they will see the previous user's tasks
    // rendered from the stale cache before a hard refresh happens.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-bold text-xl text-blue-600">TaskTracker</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">
            <LayoutDashboard className="h-5 w-5 text-gray-400" />
            Dashboard
          </Link>
          <Link to="/tasks" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-50">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            Tasks
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">
            <Settings className="h-5 w-5 text-gray-400" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8">
          <div className="md:hidden font-bold text-xl text-blue-600">TaskTracker</div>
          <div className="hidden md:block"></div> {/* Spacer */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {user?.name || 'User'}
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Navigate to="/tasks" replace />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="*" element={<Navigate to="/tasks" replace />} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
