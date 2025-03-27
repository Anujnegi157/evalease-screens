
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PhoneCall, ListChecks, BarChart3, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    {
      path: '/dashboard',
      exact: true,
      name: 'Make a Call',
      icon: <PhoneCall size={20} />,
    },
    {
      path: '/dashboard/call-logs',
      name: 'Call Logs',
      icon: <ListChecks size={20} />,
    },
    {
      path: '/dashboard/analytics',
      name: 'Analytics',
      icon: <BarChart3 size={20} />,
    },
  ];
  
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-accent/20">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-0 z-50 md:static md:z-0 md:h-screen w-full md:w-64 bg-white border-r",
          "transition-all duration-300 md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-grow p-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-accent/50 hover:text-primary",
                    isActive(item.path, item.exact) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Close Overlay */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </aside>
      
      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
