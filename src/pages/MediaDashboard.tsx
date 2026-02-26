import { useState } from 'react';
import { Newspaper, Image as ImageIcon, Plus, Trash2, Save } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export function MediaDashboard() {
  const [posts, setPosts] = useState([]); // This would sync with your DB
  const [images, setImages] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-20 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase">Media Management</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Update Camp News & Gallery Moments</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* BLOG MANAGEMENT */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black flex items-center gap-2"><Newspaper size={20}/> BLOG POSTS</h2>
              <button className="p-2 bg-amber-400 rounded-full hover:bg-amber-300 transition-all"><Plus size={20}/></button>
            </div>
            {/* Map through posts and show edit/delete buttons */}
            <div className="space-y-4">
              <p className="text-slate-400 text-sm italic">No blog posts found. Create your first announcement.</p>
            </div>
          </section>

          {/* GALLERY MANAGEMENT */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black flex items-center gap-2"><ImageIcon size={20}/> GALLERY</h2>
              <label className="p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-slate-800 transition-all">
                <Plus size={20}/>
                <input type="file" className="hidden" multiple />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
               {/* Display uploaded image thumbnails with a delete (Trash2) overlay */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}