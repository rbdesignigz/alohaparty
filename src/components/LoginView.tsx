import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Sparkles, Key, AlertCircle } from 'lucide-react';
import { User, ActiveScreen } from '../types';

interface LoginViewProps {
  login: (user: User) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function LoginView({ login, setActiveScreen }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle email/password submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Standard logins mapping
    if (email === 'admin@alohaparty.cl' || email.toLowerCase().includes('admin')) {
      const adminUser: User = {
        id: 'usr-admin',
        name: 'Aloha Admin',
        email: email,
        role: 'admin'
      };
      login(adminUser);
      setActiveScreen('admin');
    } else {
      const customerUser: User = {
        id: `usr-${Math.floor(100 + Math.random() * 900)}`,
        name: email.split('@')[0],
        email: email,
        role: 'customer'
      };
      login(customerUser);
      setActiveScreen('store');
    }
  };

  // Quick action mock logins
  const handleQuickLogin = (role: 'admin' | 'customer') => {
    setError('');
    if (role === 'admin') {
      const adminUser: User = {
        id: 'usr-admin',
        name: 'Aloha Admin',
        email: 'admin@alohaparty.cl',
        role: 'admin'
      };
      login(adminUser);
      setActiveScreen('admin');
    } else {
      const customerUser: User = {
        id: 'usr-1',
        name: 'María Pérez',
        email: 'maria@email.com',
        role: 'customer'
      };
      login(customerUser);
      setActiveScreen('store');
    }
  };

  return (
    <div 
      id="login-bg-canvas" 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fbf9f8]"
      style={{
        backgroundImage: 'radial-gradient(#b3cfa5 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      <main className="w-full max-w-[440px] animate-fade-in">
        {/* Auth Card */}
        <div id="login-auth-card" className="bg-white rounded-3xl p-6 md:p-8 border border-[#b3cfa5]/30 shadow-2xl relative overflow-hidden text-center flex flex-col gap-6">
          
          {/* Decorative bubble backgrounds blur matching Mockup 5 */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f4979c] rounded-full opacity-20 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#cce8bd] rounded-full opacity-30 blur-2xl pointer-events-none"></div>

          {/* Logo, title and description header */}
          <div className="flex flex-col items-center relative z-10">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaphhooucOcNO1hNblQSf8UWsWCH8L3Dcoz5OFiX6s7VCvx5VyEJ9hv0IFWORmll1n32IjwgOmHQhgJOHvoC7YoTp9olS4TlLdyDdDQnwgBwLJ3onnFsebnMsNu1SwfEzrCaj5IoIqrfm1bPXytpJbxpeiJISuodsW2nEbhS1AB63H0rF07KnqU99ogjh27-PCToKyX_pACV34fBlFr5smPdkI8WVWP0Izo5pfTonbXHLS833mQgEjCPoa0nXFsIvIsg" 
              alt="Aloha Party Logo" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4"
            />
            <h1 className="font-sans font-extrabold text-xl text-[#1b1c1c] leading-tight mb-1">¡Hola de nuevo!</h1>
            <p className="text-xs text-[#867273]">Inicia sesión para continuar creando.</p>
          </div>

          {/* Form alert notices */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 text-left relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google SSO simulated option */}
          <button
            id="google-sso-btn"
            onClick={() => handleQuickLogin('admin')}
            className="w-full bg-[#f5f3f3] hover:bg-[#eae8e7] text-[#1b1c1c] text-xs font-bold py-3 px-6 rounded-full border border-[#d9c1c1] flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer relative z-10"
          >
            {/* SVG Google vector */}
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.23 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Divider matching mockup 5 */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex-1 h-px bg-[#d9c1c1]/55"></div>
            <span className="text-[9px] text-[#867273] font-bold uppercase tracking-wider">o con email</span>
            <div className="flex-1 h-px bg-[#d9c1c1]/55"></div>
          </div>

          {/* Signin Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <div className="text-left flex flex-col gap-1">
              <label className="sr-only">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#fbf9f8] border border-[#d9c1c1] focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] placeholder-[#867273]/60 outline-none transition-all"
              />
            </div>

            <div className="text-left flex flex-col gap-1 relative">
              <label className="sr-only">Contraseña</label>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#fbf9f8] border border-[#d9c1c1] focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#1b1c1c] placeholder-[#867273]/60 outline-none transition-all"
              />
              <button
                id="toggle-password-vis"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#867273] hover:text-[#93474d] transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forget password trigger */}
            <div className="text-right">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Se ha enviado un correo para restablecer la contraseña.'); }}
                className="text-[11px] font-bold text-[#93474d] hover:text-[#712d34] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Iniciar Sesión main button */}
            <button
              id="login-submit-btn"
              type="submit"
              className="w-full bg-[#93474d] hover:bg-[#712d34] text-white font-sans font-bold text-xs py-3 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border border-[#867273]/20 mt-1"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Account switcher footer */}
          <p className="text-xs text-[#867273] relative z-10 mt-1">
            ¿No tienes cuenta?{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Simulación de creación de cuenta: ingresa cualquier email para probar.'); }}
              className="font-bold text-[#4d6543] hover:text-[#364d2d] underline underline-offset-4"
            >
              Crear cuenta
            </a>
          </p>
        </div>

        {/* Quick Testing Access Helper widget */}
        <div id="quick-test-helper" className="bg-[#cce8bd]/30 border border-[#4d6543]/20 rounded-2xl p-4 mt-6 text-left shadow-xs relative overflow-hidden">
          <div className="absolute top-2 right-2 text-[#4d6543]/20"><Key className="w-8 h-8" /></div>
          <h4 className="text-xs font-bold text-[#364d2d] flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceso de Prueba (Quick Access)</span>
          </h4>
          <p className="text-[10px] text-[#516947] leading-relaxed mb-3">
            Para probar la aplicación completa, haz clic en cualquiera de estos accesos directos:
          </p>
          <div className="flex gap-2.5">
            <button
              id="quick-login-admin"
              onClick={() => handleQuickLogin('admin')}
              className="flex-1 bg-[#4d6543] text-white hover:bg-[#364d2d] text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
            >
              Ver Administrador (Admin)
            </button>
            <button
              id="quick-login-client"
              onClick={() => handleQuickLogin('customer')}
              className="flex-1 bg-[#93474d] text-white hover:bg-[#712d34] text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
            >
              Ver como Cliente
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
