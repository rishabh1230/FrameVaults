import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Film, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleProfileClick = () => {
    if (user) navigate("/profile");
    else navigate("/login");
  };

  return (
    <header className="bg-cinema-bg text-cinema-text-primary sticky top-0 z-50 border-b border-cinema-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-cinema-accent text-white p-2 mr-3 group-hover:bg-cinema-text-primary group-hover:text-cinema-bg transition-colors">
              <Film size={24} className="font-bold" />
            </div>
            <div className="text-2xl font-black tracking-tight font-montserrat">
              FrameVault
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link
              to="/films"
              className={`relative text-sm font-bold uppercase tracking-[0.2em] hover:text-cinema-accent transition-colors ${
                isActive("/films") ? "text-cinema-accent" : ""
              }`}
            >
              Films
              {isActive("/films") && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-cinema-accent"></div>
              )}
            </Link>

            <Link
              to="/about"
              className={`relative text-sm font-bold uppercase tracking-[0.2em] hover:text-cinema-accent transition-colors ${
                isActive("/about") ? "text-cinema-accent" : ""
              }`}
            >
              About
              {isActive("/about") && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-cinema-accent"></div>
              )}
            </Link>

            <button
              onClick={handleProfileClick}
              className="p-2 hover:text-cinema-accent transition-colors hover:bg-cinema-card rounded"
            >
              <User size={20} />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-cinema-accent transition-colors hover:bg-cinema-card rounded"
            >
              <Search size={20} />
            </button>
          </nav>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-cinema-card rounded transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-6 border-t border-cinema-card pt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search films, directors, genres..."
                className="w-full bg-cinema-card text-cinema-text-primary px-6 py-4 text-lg font-medium border-2 border-cinema-text-secondary focus:outline-none focus:border-cinema-accent transition-colors"
              />
              <Search
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cinema-text-secondary"
                size={20}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
