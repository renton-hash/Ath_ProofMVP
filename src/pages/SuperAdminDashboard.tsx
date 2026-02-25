import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, Activity, Plus, LogOut, Check, Loader2, Settings
} from 'lucide-react';

// FIREBASE & CONTEXT
import { auth, db } from '../firebase/firebase'; 
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

// --- Interfaces ---
interface AdminAccount {
  id?: string;
  code: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin'; // Added role for security rules
  status: 'Active' | 'Inactive';
  created: any;
}

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [generatedAdmin, setGeneratedAdmin] = useState<{ code: string; pass: string } | null>(null);

  const navigate = useNavigate();
  const { setCurrentUser } = useSite();

  // --- 1. Fetch Admins ---
  useEffect(() => {
    const fetchAdmins = async () => {
      setFetchLoading(true);
      try {
        // Querying the admin_users collection we defined in rules
        const q = query(collection(db, 'admin_users'), orderBy('created', 'desc'));
        const querySnapshot = await getDocs(q);
        const adminList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdminAccount[];
        setAdmins(adminList);
      } catch (err) {
        console.error("Error fetching admins:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // --- 2. Handle Create Admin ---
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate credentials for the admin to use later
    const code = `ADM2026-${String(admins.length + 1).padStart(3, '0')}`;
    const tempPassword = `Admin@${Math.random().toString(36).slice(-6).toUpperCase()}`;
    
    try {
      const newAdminData = {
        code,
        name: form.name,
        email: form.email.toLowerCase(),
        role: form.role, // Essential for your 'isAdmin' security rule
        status: 'Active' as const,
        created: serverTimestamp(),
      };

      // Save to admin_users collection
      const docRef = await addDoc(collection(db, 'admin_users'), newAdminData);

      // Update local UI state
      setAdmins([{ ...newAdminData, id: docRef.id, created: { seconds: Date.now()/1000 } } as any, ...admins]);
      setGeneratedAdmin({ code, pass: tempPassword });
      setForm({ name: '', email: '', role: 'admin' });

    } catch (err) {
      console.error("Error adding admin:", err);
      alert("Permission Denied: Ensure you are logged in as a Super Admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-navy min-h-screen flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-gold p-1.5 rounded-lg">
              <Shield size={18} className="text-navy" />
            </div>
            <span className="font-heading text-lg text-white">ATH-PROOF</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: <Activity size={18} /> },
            { id: 'create', icon: <Plus size={18} /> },
            { id: 'manage', icon: <Users size={18} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-gold text-navy' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="capitalize">{item.id}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { auth.signOut(); setCurrentUser(null); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <h1 className="font-heading text-xl font-bold text-navy uppercase">{activeTab} Control</h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-navy">Super Admin</p>
              <p className="text-[10px] text-gray-400">System Root</p>
            </div>
            <div className="w-10 h-10 bg-navy text-gold rounded-full flex items-center justify-center font-bold">SA</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'create' && (
              <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-xl">
                  <h3 className="text-lg font-bold text-navy mb-6">Provision Admin Account</h3>
                  <form onSubmit={handleCreateAdmin} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gold"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gold"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-navy text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors">
                      {loading ? <Loader2 className="animate-spin" /> : 'Create Admin Account'}
                    </button>
                  </form>
                </div>

                {generatedAdmin && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl max-w-xl">
                    <p className="text-green-700 font-bold flex items-center gap-2"><Check size={18}/> Provisioning Successful</p>
                    <p className="text-xs text-green-600 mb-4">Provide these credentials to the new administrator.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Admin Code</p>
                        <p className="font-mono font-bold text-navy">{generatedAdmin.code}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Temp Password</p>
                        <p className="font-mono font-bold text-navy">{generatedAdmin.pass}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'manage' && (
              <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {fetchLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin mb-2" />
                    <p className="text-sm">Accessing encrypted admin records...</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                      <tr>
                        <th className="px-6 py-4">Admin ID</th>
                        <th className="px-6 py-4">Administrator</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {admins.map(admin => (
                        <tr key={admin.id || admin.code} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-navy font-bold text-xs">{admin.code}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm text-navy">{admin.name}</p>
                            <p className="text-xs text-gray-400">{admin.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase ${admin.role === 'superadmin' ? 'text-purple-600' : 'text-gray-500'}`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                              {admin.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-navy transition-colors">
                              <Settings size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}