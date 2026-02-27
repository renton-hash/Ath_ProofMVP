import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Loader2, Trash2, Download, Search, 
  Phone, FileText, Fingerprint, Calendar, Users, Database, 
  Camera, Save, X, Edit2
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 

// --- Reusable UI Components ---
const Field = ({ label, value, onChange, type = "text", required = true }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      required={required} type={type} value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-800 focus:border-amber-400 transition-all uppercase" 
    />
  </div>
);

const Select = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value} onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 uppercase outline-none focus:border-amber-400"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export function AdminDashboard() {
  const { athletes, addAthlete } = useSite();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    homeAddress: '', parentPhone: '', 
    sport: 'Football', age: '', gender: 'Male', dob: '', photo: ''
  });

  // --- Image Processing: Headshot Crop + Size Validation ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict Size Validation: 200KB to 1MB
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB < 200 || fileSizeKB > 1000) {
      alert(`Invalid File Size: ${fileSizeKB.toFixed(0)}KB. Please upload between 200KB and 1MB.`);
      e.target.value = ""; // Clear input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height); // Square dimension
        
        canvas.width = 400; // Output width
        canvas.height = 400; // Output height

        if (ctx) {
          // Center-crop logic for "Headshot Only" effect
          ctx.drawImage(
            img,
            (img.width - size) / 2, (img.height - size) / 2, size, size, // Source
            0, 0, 400, 400 // Destination
          );
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          isEdit ? setEditData({ ...editData, photo: base64 }) : setFormData({ ...formData, photo: base64 });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age.toString();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(calculateAge(formData.dob));
    if (ageNum < 7 || ageNum > 20) {
      setStatus({ type: 'error', msg: 'AGE MUST BE 7-20' });
      return;
    }
    if (!formData.photo) {
      setStatus({ type: 'error', msg: 'PHOTO REQUIRED' });
      return;
    }

    setIsSubmitting(true);
    try {
      const athleteId = `IYSDC-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await addAthlete({ ...formData, age: ageNum.toString(), athleteId, timestamp: new Date() });
      setFormData({ firstName: '', middleName: '', lastName: '', homeAddress: '', parentPhone: '', sport: 'Football', age: '', gender: 'Male', dob: '', photo: '' });
      setStatus({ type: 'success', msg: `SAVED: ${athleteId}` });
    } catch (err) {
      setStatus({ type: 'error', msg: 'SAVE FAILED' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const downloadIndividualID = (a: any) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("IYSDC ATHLETE PASS", 105, 30, { align: 'center' });
    
    if (a.photo) {
      doc.addImage(a.photo, 'JPEG', 75, 60, 60, 60);
    }

    autoTable(doc, {
      startY: 130,
      body: [
        ["Reg ID", a.athleteId],
        ["Full Name", `${a.firstName} ${a.lastName}`],
        ["DOB", a.dob],
        ["Current Age", a.age],
        ["Category", a.sport],
        ["Contact", a.parentPhone]
      ],
      styles: { fontSize: 12, cellPadding: 6 },
      theme: 'grid'
    });
    doc.save(`${a.athleteId}_Profile.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR: REGISTRATION */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl sticky top-28">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserPlus size={18} className="text-amber-500" /> Secure Registration
            </h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <label className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-400">
                    {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" size={32} />}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e)} />
                </label>
                <p className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-tighter">Min 200KB / Max 1MB</p>
              </div>

              <Field label="First Name" value={formData.firstName} onChange={(v:any) => setFormData({...formData, firstName: v})} />
              <Field label="Last Name" value={formData.lastName} onChange={(v:any) => setFormData({...formData, lastName: v})} />
              <Field type="date" label="Date of Birth" value={formData.dob} onChange={(v:any) => setFormData({...formData, dob: v})} />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                  <div className="px-4 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600">{calculateAge(formData.dob) || '--'}</div>
                </div>
                <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} />
              </div>

              <Field label="Phone" value={formData.parentPhone} onChange={(v:any) => setFormData({...formData, parentPhone: v})} />
              <Select label="Sport" options={['Football', 'Basketball', 'Tennis', 'Volleyball']} value={formData.sport} onChange={(v:any) => setFormData({...formData, sport: v})} />

              <button disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-amber-500 transition-all shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Database size={16} className="text-amber-400"/> Authenticate Entry</>}
              </button>
            </form>
          </div>
        </aside>

        {/* MAIN: REGISTRY LISTING */}
        <main className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3 mb-6">
            <Search size={20} className="text-slate-300" />
            <input placeholder="SEARCH REGISTRY..." className="bg-transparent outline-none w-full font-bold text-xs uppercase" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {athletes?.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((a: any) => (
            <div key={a.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-md transition-all">
              {editingId === a.id ? (
                <div className="p-8 bg-amber-50/20 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Field label="First Name" value={editData.firstName} onChange={(v:any) => setEditData({...editData, firstName: v})} />
                    <Field label="Last Name" value={editData.lastName} onChange={(v:any) => setEditData({...editData, lastName: v})} />
                    <Field type="date" label="DOB" value={editData.dob} onChange={(v:any) => setEditData({...editData, dob: v})} />
                    <Select label="Sport" options={['Football', 'Basketball', 'Tennis', 'Volleyball']} value={editData.sport} onChange={(v:any) => setEditData({...editData, sport: v})} />
                    <Field label="Phone" value={editData.parentPhone} onChange={(v:any) => setEditData({...editData, parentPhone: v})} />
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Photo</label>
                       <input type="file" className="text-[10px]" onChange={(e) => handlePhotoUpload(e, true)} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      await updateDoc(doc(db, 'athletes', a.id), {...editData, age: calculateAge(editData.dob)});
                      setEditingId(null);
                    }} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Save Changes</button>
                    <button onClick={() => setEditingId(null)} className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <img src={a.photo} className="w-24 h-24 rounded-[1.5rem] object-cover border-2 border-slate-50 shadow-sm" />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <Fingerprint size={12} className="text-slate-300" />
                      <span className="text-[9px] font-mono text-slate-400">{a.athleteId}</span>
                    </div>
                    <h3 className="font-black text-slate-900 uppercase text-xl leading-none">{a.firstName} {a.lastName}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                      <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase italic">{a.sport}</span>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase">Age {a.age}</span>
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">{a.dob}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => downloadIndividualID(a)} className="p-3 text-slate-300 hover:text-emerald-500 transition-colors"><Download size={20}/></button>
                    <button onClick={() => { setEditingId(a.id); setEditData(a); }} className="p-3 text-slate-300 hover:text-blue-500 transition-colors"><Edit2 size={20}/></button>
                    <button onClick={() => window.confirm("Delete?") && deleteDoc(doc(db, 'athletes', a.id))} className="p-3 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20}/></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}