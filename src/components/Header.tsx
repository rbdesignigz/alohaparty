import React, { useState } from 'react';
import { ShoppingCart, User, Search, PartyPopper, LogIn, LayoutDashboard, Menu, X } from 'lucide-react';
import { ActiveScreen, User as UserType } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserType | null;
  logout: () => void;
}

export default function Header({
  activeScreen,
  setActiveScreen,
  cartCount,
  searchQuery,
  setSearchQuery,
  currentUser,
  logout
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenuAndNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <header id="store-header" className="w-full sticky top-0 z-40 flex flex-col shadow-sm">
      {/* Announcement Bar */}
      <div className="w-full bg-[#f4949a] text-white text-[10px] md:text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 tracking-widest uppercase shadow-inner">
        <span>♥</span> Papelería personalizada para momentos inolvidables <span>♥</span>
      </div>

      <div className="w-full bg-[#fbf9f8] border-b border-[#867273]/20 py-3 md:py-4 px-4 md:px-12 flex flex-row gap-4 justify-between items-center backdrop-blur-md bg-opacity-95">
        {/* Brand Logo */}
        <div 
          id="header-logo-container"
          className="flex items-center gap-3 cursor-pointer group shrink-0" 
          onClick={() => { setActiveScreen('home'); setSearchQuery(''); }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 bg-[#fbf9f8] flex items-center justify-center relative">
             <span className="text-[#f4949a] font-serif font-bold text-lg absolute">AP</span>
             <img src="/logo.png?v=2" alt="Aloha Party Logo" className="w-full h-full object-cover relative z-10" onError={(e) => {
               e.currentTarget.style.display = 'none';
               e.currentTarget.parentElement?.classList.add('fallback-logo');
             }} />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif italic font-bold text-2xl tracking-tight text-[#f4949a]">Aloha Party</span>
            <p className="text-[10px] uppercase tracking-widest text-[#f4949a] font-bold -mt-1">Papelería Creativa</p>
          </div>
        </div>

      {/* Desktop Navigation Links */}
      <nav id="header-nav" className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button
          id="nav-home-btn"
          onClick={() => { setActiveScreen('home'); setSearchQuery(''); }}
          className={`transition-colors duration-200 cursor-pointer ${
            activeScreen === 'home' && !searchQuery
              ? 'text-[#f4949a] font-semibold border-b-2 border-[#f4949a] pb-1'
              : 'text-[#867273] hover:text-[#f4949a]'
          }`}
        >
          Inicio
        </button>
        <button
          id="nav-store-btn"
          onClick={() => { setActiveScreen('store'); }}
          className={`transition-colors duration-200 cursor-pointer ${
            activeScreen === 'store'
              ? 'text-[#f4949a] font-semibold border-b-2 border-[#f4949a] pb-1'
              : 'text-[#867273] hover:text-[#f4949a]'
          }`}
        >
          Tienda
        </button>
        <button
          id="nav-about-btn"
          onClick={() => { setActiveScreen('about'); }}
          className={`transition-colors duration-200 cursor-pointer ${
            activeScreen === 'about'
              ? 'text-[#f4949a] font-semibold border-b-2 border-[#f4949a] pb-1'
              : 'text-[#867273] hover:text-[#f4949a]'
          }`}
        >
          Nosotros
        </button>
      </nav>

      {/* Actions and Search */}
      <div id="header-actions" className="flex items-center gap-2 md:gap-4 w-auto justify-end">
        {/* Search Input */}
        <div id="search-input-container" className="relative hidden sm:block w-full max-w-[150px] md:max-w-[200px] lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867273]" />
          <input
            id="search-input-field"
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeScreen !== 'store') setActiveScreen('store');
            }}
            className="w-full bg-[#f5f3f3] border-b-2 border-[#867273]/20 focus:border-[#4d6543] py-1.5 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-t-md outline-none transition-all duration-200"
          />
        </div>

        {/* Cart Trigger */}
        <button
          id="cart-trigger-btn"
          onClick={() => setActiveScreen('checkout')}
          className="relative p-2 text-[#867273] hover:text-[#f4949a] hover:bg-[#f4949a]/5 rounded-full transition-colors cursor-pointer"
          title="Ver Carrito"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span 
              id="cart-badge-count"
              className="absolute -top-1 -right-1 bg-[#4d6543] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Auth / Admin Button */}
        <div id="auth-menu-container" className="relative">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="user-menu-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 px-3 bg-[#4d6543]/10 text-[#4d6543] hover:bg-[#4d6543]/20 rounded-full transition-all text-xs font-semibold cursor-pointer border border-[#4d6543]/20"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[80px] truncate">{currentUser.name}</span>
              </button>

              {showProfileMenu && (
                <div id="user-profile-dropdown" className="absolute right-0 mt-8 w-48 bg-white border border-[#867273]/20 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#867273]/10">
                    <p className="text-xs font-bold text-[#1b1c1c] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#867273] truncate">{currentUser.email}</p>
                  </div>
                  {currentUser.role === 'admin' && (
                    <button
                      id="dropdown-go-admin-btn"
                      onClick={() => {
                        setActiveScreen('admin');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#f4949a] hover:bg-[#f4949a]/5 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Panel Administrador
                    </button>
                  )}
                  <button
                    id="dropdown-logout-btn"
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => setActiveScreen('login')}
              className="flex items-center gap-1.5 p-1 px-4 bg-[#f4949a] hover:bg-[#e3858b] text-white rounded-full transition-all text-xs font-semibold cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
        {/* Mobile Hamburger Trigger */}
        <button
          id="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#867273] hover:text-[#f4949a] rounded-full transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full h-screen bg-[#fbf9f8] flex flex-col items-center pt-10 gap-8 md:hidden animate-fade-in border-t border-[#867273]/10" style={{ height: '100vh' }}>
          <button
            onClick={() => closeMobileMenuAndNavigate('home')}
            className={`text-2xl font-serif font-bold ${activeScreen === 'home' ? 'text-[#8da77b]' : 'text-[#867273]'}`}
          >
            Inicio
          </button>
          <button
            onClick={() => closeMobileMenuAndNavigate('store')}
            className={`text-2xl font-serif font-bold ${activeScreen === 'store' ? 'text-[#8da77b]' : 'text-[#867273]'}`}
          >
            Tienda
          </button>
          <button
            onClick={() => closeMobileMenuAndNavigate('about')}
            className={`text-2xl font-serif font-bold ${activeScreen === 'about' ? 'text-[#8da77b]' : 'text-[#867273]'}`}
          >
            Nosotros
          </button>
          <div className="mt-auto mb-12 opacity-30 text-[#8da77b]">
            <PartyPopper className="w-24 h-24" />
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
