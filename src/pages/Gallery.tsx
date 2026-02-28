import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const STATIC_GALLERY = [
  { id: 1, url: '/images/DSC_5754.jpg', caption: 'Tactical Drills' },
  { id: 2, url: '/images/Slider/DSC_5269.jpg', caption: 'Team Coordination' },
  { id: 3, url: '/images/Slider/DSC_5175.jpg', caption: 'Endurance Training' },
  { id: 4, url: '/images/DSC_6151.jpg', caption: 'Game Strategy' },
  { id: 5, url: '/images/DSC_5778.jpg', caption: 'Elite Performance' },
  { id: 6, url: '/images/DSC_6136.jpg', caption: 'Focus & Power' },
  { id: 7, url: '/images/DSC_5836.jpg', caption: 'Skill Mastery' },
  { id: 8, url: '/images/DSC_5731.jpg', caption: 'Victory Mindset' },

];

export function GalleryPage() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  // NAVIGATION LOGIC (Stops at ends)
  const nextImage = () => {
    if (selectedIdx !== null && selectedIdx < STATIC_GALLERY.length - 1) {
      setSelectedIdx(selectedIdx + 1);
    }
  };

  const prevImage = () => {
    if (selectedIdx !== null && selectedIdx > 0) {
      setSelectedIdx(selectedIdx - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-1 md:px-4">
          <header className="mb-10 flex flex-col items-center text-center px-6">
            <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Ife Youth Camp 2026</span>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">The Archive</h1>
          </header>

          {/* CLUSTERED GRID (Ultra-tight gap for the cluster effect) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5 md:gap-1">
            {STATIC_GALLERY.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedIdx(index)}
                className="relative aspect-square overflow-hidden cursor-pointer group bg-slate-900"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0 grayscale-[40%]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-white font-black uppercase italic text-[10px] tracking-widest border-b border-amber-500 pb-1">View</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center overflow-hidden"
          >
            {/* Close */}
            <button 
              onClick={() => setSelectedIdx(null)} 
              className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            {/* Nav Arrows (Hidden when at the end) */}
            {selectedIdx > 0 && (
              <button 
                onClick={prevImage} 
                className="absolute left-6 z-[110] text-white/30 hover:text-amber-500 transition-colors hidden md:block"
              >
                <ChevronLeft size={60} />
              </button>
            )}
            
            {selectedIdx < STATIC_GALLERY.length - 1 && (
              <button 
                onClick={nextImage} 
                className="absolute right-6 z-[110] text-white/30 hover:text-amber-500 transition-colors hidden md:block"
              >
                <ChevronRight size={60} />
              </button>
            )}

            {/* Swipeable Image Container */}
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold) prevImage();
                else if (info.offset.x < -swipeThreshold) nextImage();
              }}
              className="relative w-full h-full flex flex-col items-center justify-center p-4"
            >
              <img
                src={STATIC_GALLERY[selectedIdx].url}
                alt="Fullscreen"
                className="max-w-full max-h-[80vh] object-contain shadow-2xl select-none rounded-sm"
              />
              <div className="mt-8 text-center">
                <p className="text-amber-500 font-black uppercase italic tracking-[0.3em] text-xs">
                  {STATIC_GALLERY[selectedIdx].caption}
                </p>
                <p className="text-white/20 text-[9px] mt-4 font-bold uppercase tracking-[0.2em]">
                  {selectedIdx + 1} / {STATIC_GALLERY.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}