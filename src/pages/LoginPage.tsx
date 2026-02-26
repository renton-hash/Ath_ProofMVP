import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Users, Eye, EyeOff, ArrowLeft,
  Check, Loader2, ChevronRight, Lock, AlertCircle
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { auth, db } from '../firebase/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// FIX: Standardized IDs to use underscores to match Firestore Rules
type Role = 'super_admin' | 'admin' | 'coach' | 'official';

interface RoleConfig {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  idLabel: string;
  idPlaceholder: string;
  route: string;
}

const roles: RoleConfig[] = [
  {
    id: 'super_admin',
    title: 'Super Admin',
    description: 'System settings & security',
    icon: <Lock size={20} />,
    idLabel: 'Security Email',
    idPlaceholder: 'admin@athproof.com',
    route: '/admin/dashboard',
  },
  {
    id: 'admin',
    title: 'Camp Admin',
    description: 'Register athletes & media',
    icon: <Shield size={20} />,
    idLabel: 'Staff Email',
    idPlaceholder: 'staff@athproof.com',
    route: '/admin/dashboard',
  },
  {
    id: 'coach',
    title: 'Sports Coach',
    description: 'Manage team rosters',
    icon: <Users size={20} />,
    idLabel: 'Coach Email',
    idPlaceholder: 'coach@school.com',
    route: '/coach',
  },
  {
    id: 'official',
    title: 'Official / Scout',
    description: 'Review performance stats',
    icon: <Eye size={20} />,
    idLabel: 'Scout Email',
    idPlaceholder: 'scout@pro.com',
    route: '/scout',
  }
];

export function LoginPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
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
      // 1. Primary Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Role Verification - FIX: Use 'admin_users' collection
      const userRef = doc(db, 'admin_users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        // Check if the role in Firestore matches the one selected in UI
        if (userData.role !== selectedRole) {
          throw new Error('Mismatched Role: Authorized level does not match selected portal.');
        }

        // 3. Update Site Context
        setCurrentUser({
          id: user.uid,
          name: user.email?.split('@')[0].toUpperCase() || 'USER',
          role: userData.role,
          email: user.email || ''
        });

        setStep(3);
        const targetRoute = roles.find((r) => r.id === selectedRole)?.route || '/';
        setTimeout(() => navigate(targetRoute), 1500);

      } else {
        throw new Error('Access Denied: You are not registered in the Administrative Registry.');
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      // Handle Firebase specific errors or custom role errors
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError("Invalid email or password.");
      } else if (err.message.includes('Mismatched Role') || err.message.includes('Access Denied')) {
        setError(err.message);
      } else if (err.code === 'permission-denied') {
        setError("Security Block: Profile not found in Admin database.");
      } else {
        setError("Access Denied. Please contact system admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-10 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="bg-amber-400 p-2.5 rounded-2xl shadow-lg shadow-amber-400/20 group-hover:rotate-12 transition-transform">
            <Shield className="h-7 w-7 text-[#0F172A]" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase italic">AthProof <span className="text-amber-400">Hub</span></span>
        </Link>
        <div className="flex items-center justify-center gap-2">
           <div className="h-[1px] w-8 bg-slate-700" />
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Auth System</p>
           <div className="h-[1px] w-8 bg-slate-700" />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-3xl font-black text-[#0F172A] mb-2 uppercase italic tracking-tight">Access Level</h2>
                  <p className="text-slate-400 text-sm mb-8 font-medium">Select your authorized department to proceed.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col gap-4 group ${
                          selectedRole === role.id 
                          ? 'border-amber-400 bg-amber-50 shadow-md' 
                          : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedRole === role.id ? 'bg-[#0F172A] text-amber-400' : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          {role.icon}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] uppercase text-xs tracking-tight">{role.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{role.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRole}
                    className="w-full py-5 bg-[#0F172A] text-white font-black rounded-2xl hover:bg-slate-800 disabled:opacity-20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] shadow-xl"
                  >
                    Enter Portal <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 2 && selectedRole && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => { setStep(1); setError(''); }} className="mb-8 text-slate-400 hover:text-[#0F172A] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} /> Go Back
                  </button>

                  <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-5">
                     <div className="bg-[#0F172A] p-3 rounded-2xl text-amber-400 shadow-lg">
                        {roles.find(r => r.id === selectedRole)?.icon}
                     </div>
                     <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">Department Access</p>
                        <p className="font-black text-xl text-[#0F172A] uppercase italic leading-none">{roles.find(r => r.id === selectedRole)?.title}</p>
                     </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={roles.find((r) => r.id === selectedRole)?.idPlaceholder}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-amber-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-amber-400 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-100 flex items-center gap-3 uppercase tracking-wider">
                        <AlertCircle size={16} /> {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-[#0F172A] text-white font-black rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-slate-200 uppercase tracking-widest text-[11px] mt-4"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Request Authorization'}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                    <Check className="h-10 w-10 text-green-500" strokeWidth={4} />
                  </div>
                  <h3 className="text-3xl font-black text-[#0F172A] mb-2 uppercase italic">Success</h3>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10">Authorizing secure environment...</p>
                  
                  <div className="max-w-[180px] mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link to="/" className="text-slate-500 hover:text-amber-400 transition-colors text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Back to Public Feed
          </Link>
        </div>
      </div>
    </div>
  );
}