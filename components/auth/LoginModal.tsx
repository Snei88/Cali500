import React, { useState } from 'react';
import { AlertCircle, Lock, LogIn, Mail, X } from 'lucide-react';
import { signInAdmin } from '@/services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await signInAdmin(email, password);
    setIsLoading(false);
    if (result.success) {
      onLogin(true);
      setEmail('');
      setPassword('');
    } else {
      setError(result.error ?? 'No se pudo iniciar sesion.');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-[#0B1F3A] p-6 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black">Acceso administrativo</h2>
          <p className="mt-2 text-sm text-slate-300">Autenticación conectada a Supabase Auth.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="space-y-1.5">
            <span className="text-sm font-bold text-slate-700">Correo institucional</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" autoFocus />
            </div>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-bold text-slate-700">Contraseña</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
            </div>
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button disabled={isLoading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60">
            <LogIn className="h-4 w-4" />
            {isLoading ? 'Validando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};
