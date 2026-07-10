import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { User, ActiveScreen } from '../types';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

// CONFIG: This email will ALWAYS be considered the primary admin and cannot be demoted.
const PRIMARY_ADMIN_EMAIL = 'pablo.da.ber@gmail.com';

interface LoginViewProps {
  login: (user: User) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function LoginView({ login, setActiveScreen }: LoginViewProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (!user.email) {
        throw new Error('No se pudo obtener el email de Google.');
      }

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let role: 'admin' | 'customer' = 'customer';

      if (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        role = 'admin'; // Irrevocable admin rule
      } else if (userSnap.exists()) {
        role = userSnap.data().role || 'customer';
      }

      const userData: User = {
        id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: role
      };

      // Always update/create the user document so we have the latest info
      await setDoc(userRef, userData, { merge: true });

      login(userData);
      setActiveScreen(role === 'admin' ? 'admin' : 'store');

    } catch (err: any) {
      console.error('Error con Google Auth:', err);
      setError('Ocurrió un error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
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
            <p className="text-xs text-[#867273]">Inicia sesión para continuar comprando.</p>
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
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-[#f5f3f3] hover:bg-[#eae8e7] text-[#1b1c1c] text-xs font-bold py-3.5 px-6 rounded-full border border-[#d9c1c1] flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer relative z-10 disabled:opacity-50"
          >
            {/* SVG Google vector */}
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.23 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
