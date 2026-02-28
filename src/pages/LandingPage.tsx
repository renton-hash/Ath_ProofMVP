import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

 
  const HERO_SLIDES = [
    { url: '/images/Slider/DSC_5145.jpg', alt: 'High Performance Training' },
    { url: '/images/Slider/DSC_5175.jpg', alt: 'Next Gen Champions' },
    { url: '/images/Slider/DSC_5269.jpg', alt: 'Ife Youth Sports Camp' },
    { url: '/images/Slider/DSC_5304.jpg', alt: 'Level Up' },
    { url: '/images/Slider/DSC_5314.jpg', alt: 'Motivation and Grit' }
  ];

  
  const STATIC_GALLERY = [
    { url: '/images/Slider/DSC_5145.jpg', caption: 'Tactical Drills' },
    { url: '/images/Slider/DSC_5175.jpg', caption: 'Team Coordination' },
    { url: '/images/Slider/DSC_5269.jpg', caption: 'Endurance Training' },
    { url: '/images/Slider/DSC_5304.jpg', caption: 'Game Strategy' },
    { url: '/images/Slider/DSC_5314.jpg', caption: 'Elite Performance' },
    { url: '/images/Slider/DSC_5320.jpg', caption: 'Focus & Power' }, // Reusing or adding new filenames
    { url: '/images/Slider/DSC_5175.jpg', caption: 'Skill Mastery' },
    { url: '/images/Slider/DSC_5269.jpg', caption: 'Victory Mindset' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -1000 : 1000, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentSlide}
              src={HERO_SLIDES[currentSlide].url}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 100, damping: 30 }, opacity: { duration: 0.5 } }}
              className="absolute w-full h-full object-cover opacity-60"
              alt={HERO_SLIDES[currentSlide].alt}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-left">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-8 uppercase italic">
              Train <br />
              <span className="text-amber-400">Harder.</span>
            </h1>
            <p className="text-slate-300 text-xl md:text-2xl mb-12 max-w-2xl font-medium leading-relaxed">
              Ife Youth Sports Camp 2026. High-performance training for the next generation of champions.
            </p>
            <Link
              to="/registration"
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-amber-400 transition-all uppercase tracking-tight shadow-2xl"
            >
              Register Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                currentSlide === idx ? 'w-12 bg-amber-400' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 underline decoration-2 underline-offset-4">The Camp Experience</p>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Gallery</h2>
            </div>
            <Link 
              to="/gallery" 
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase text-xs hover:bg-amber-500 transition-all shadow-lg"
            >
              Full Gallery <ImageIcon size={16} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STATIC_GALLERY.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100 group shadow-md hover:shadow-2xl transition-shadow"
              >
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end text-center">
                  <p className="text-white text-[10px] font-black uppercase italic tracking-[0.2em]">
                    {img.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CountdownTimer />
      <Footer />
    </div>
  );
}