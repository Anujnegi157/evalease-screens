
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent",
        isDashboard && "bg-white/90 backdrop-blur-lg shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="z-10">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          
          <Link 
            to="/dashboard" 
            className={cn(
              "bg-primary text-white px-4 py-2 rounded-lg transition-all hover:bg-primary/90 hover:shadow-md",
              "font-medium text-sm"
            )}
          >
            Dashboard
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-10" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white/95 flex flex-col items-center justify-center animate-fade-in">
            <nav className="flex flex-col items-center gap-8">
              <Link 
                to="/" 
                className={cn(
                  "text-lg font-medium transition-all hover:text-primary",
                  location.pathname === "/" ? "text-primary" : "text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                to="/dashboard" 
                className={cn(
                  "bg-primary text-white px-6 py-3 rounded-lg transition-all hover:bg-primary/90",
                  "font-medium text-lg"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
