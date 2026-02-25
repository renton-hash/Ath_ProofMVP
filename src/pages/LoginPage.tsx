import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  Loader2,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
// IMPORT FIREBASE AUTH
import { auth } from '../firebase/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

type Role = 'super-admin' | 'admin' | 'coach' | 'official';

interface RoleConfig {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  idLabel: string;
  idPlaceholder: string;
  route: string;
  color: string;
}

const roles: RoleConfig[] = [
  {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'System settings & security',
    icon: <Lock size={24} />,
    idLabel: 'Security Email',
    idPlaceholder: 'admin@athproof.com',
    route: '/super-admin',
    color: 'border-red-500 bg-red-50'
  },
  {
    id: 'admin',
    title: 'Camp Admin',
    description: 'Register athletes & verify data',
    icon: <Shield size={24} />,
    idLabel: 'Admin Email',
    idPlaceholder: 'staff@athproof.com',
    route: '/admin',
    color: 'border-navy bg-navy/5'
  },
  {
    id: 'coach',
    title: 'Sports Coach',
    description: 'View & manage team rosters',
    icon: <Users size={24} />,
    idLabel: 'Coach Email',
    idPlaceholder: 'coach@school.com',
    route: '/coach',
    color: 'border-green-500 bg-green-50'
  },
  {
    id: 'official',
    title: 'Official / Scout',
    description: 'Review performance & stats',
    icon: <Eye size={24} />,
    idLabel: 'Scout Email',
    idPlaceholder: 'scout@pro.com',
    route: '/scout',
    color: 'border-purple-500 bg-purple-50'
  }
];

export function LoginPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState(''); // This acts as the Email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setCurrentUser } = useSite();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setError('');
    setLoading(true);

    try {
      // FIREBASE AUTHENTICATION CALL
      const userCredential = await signInWithEmailAndPassword(auth, userId.trim(), password);
      const user = userCredential.user;

      // Update Global State with Firebase User Data
      setCurrentUser({
        id: user.uid,
        name: user.email?.split('@')[0].toUpperCase() || selectedRole.toUpperCase(),
        role: selectedRole,
        code: user.email || ''
      });

      // Show Success Animation
      setStep(3);
      
      const targetRoute = roles.find((r) => r.id === selectedRole)?.route || '/';
      
      // Delay navigation to let the "Access Granted" animation finish
      setTimeout(() => navigate(targetRoute), 1500);

    } catch (err: any) {
      console.error("Login Error:", err.code);
      
      // Handle Firebase Error Codes
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password for " + selectedRole);
      } else if (err.code === 'auth/too-many-requests') {
        setError("Account locked due to many failed attempts. Try later.");
      } else {
        setError("Connection error. Please check your internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 mb-4">
          <div className="bg-gold p-2.5 rounded-xl shadow-lg shadow-gold/20">
            <Shield className="h-8 w-8 text-navy" />
          </div>
          <span className="font-heading text-3xl text-white tracking-tighter">ATH-PROOF</span>
        </Link>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
          Internal Administration Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-3xl font-black text-navy mb-2 text-center">WELCOME BACK</h2>
                  <p className="text-gray-500 text-center mb-8">Select your authorization level to continue</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col gap-3 ${
                          selectedRole === role.id 
                          ? 'border-gold bg-gold/5 shadow-lg' 
                          : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedRole === role.id ? 'bg-navy text-gold' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {role.icon}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{role.title}</p>
                          <p className="text-xs text-gray-400 font-medium">{role.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRole}
                    className="w-full py-4 bg-navy text-white font-black rounded-2xl hover:bg-navy-light disabled:opacity-40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    Select Role <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && selectedRole && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <button onClick={() => { setStep(1); setError(''); }} className="mb-6 text-gray-400 hover:text-navy flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Change Role
                  </button>

                  <div className="mb-8 p-4 bg-navy text-white rounded-2xl flex items-center gap-4">
                     <div className="bg-gold/20 p-2 rounded-lg text-gold">
                        {roles.find(r => r.id === selectedRole)?.icon}
                     </div>
                     <div>
                        <p className="text-[10px] text-gold font-bold uppercase tracking-widest leading-none mb-1">Authenticating as</p>
                        <p className="font-bold text-lg leading-none">{roles.find(r => r.id === selectedRole)?.title}</p>
                     </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        {roles.find((r) => r.id === selectedRole)?.idLabel}
                      </label>
                      <input
                        type="email"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        placeholder={roles.find((r) => r.id === selectedRole)?.idPlaceholder}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white rounded-2xl outline-none transition-all font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white rounded-2xl outline-none transition-all font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 text-center uppercase tracking-wider">
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gold text-navy font-black rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gold/20 uppercase tracking-widest text-sm"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-black text-navy mb-2 tracking-tighter">ACCESS GRANTED</h3>
                  <p className="text-gray-500 font-medium mb-8">Synchronizing with secure database...</p>
                  
                  <div className="max-w-[200px] mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-gold"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-center mt-8">
          <Link to="/" className="text-white/40 hover:text-gold transition-colors text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Back to Public Site
          </Link>
        </p>
      </div>
    </div>
  );
}