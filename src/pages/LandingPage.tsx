import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const HERO_SLIDES = [
    { url: '/images/DSC_6151.jpg', alt: ' ' },
    { url: '/images/DSC_5272.jpg', alt: ' ' },
    { url: '/images/Slider/DSC_5145.jpg', alt: 'High Performance Training' },
    { url: '/images/Slider/DSC_5175.jpg', alt: 'Next Gen Champions' },
    { url: '/images/Slider/DSC_5269.jpg', alt: 'Ife Youth Sports Camp' },
    { url: '/images/Slider/DSC_5304.jpg', alt: 'Level Up' },
    { url: '/images/Slider/DSC_5314.jpg', alt: 'Motivation and Grit' }
  ];

  const STATIC_GALLERY = [
    { url: '/images/DSC_6151.jpg', caption: 'Tactical Drills' },
    { url: '/images/Slider/DSC_5175.jpg', caption: 'Team Coordination' },
    { url: '/images/DSC_5882.jpg', caption: 'Endurance Training' },
    { url: '/images/Slider/DSC_5304.jpg', caption: 'Game Strategy' },
    { url: '/images/Slider/DSC_5314.jpg', caption: 'Elite Performance' },
    { url: '/images/Slider/DSC_5320.jpg', caption: 'Focus & Power' },
    { url: '/images/DSC_5655.jpg', caption: 'Skill Mastery' },
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
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    }),
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0B1C2D] overflow-hidden">
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
              transition={{
                x: { type: 'spring', stiffness: 100, damping: 30 },
                opacity: { duration: 0.5 }
              }}
              className="absolute w-full h-full object-cover opacity-75"
              alt={HERO_SLIDES[currentSlide].alt}
            />
          </AnimatePresence>

          {/* Deep Navy Overlay (Not Gray) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D] via-[#0B1C2D]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-left">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Train <br />
              <span className="text-amber-400">Harder.</span>
            </h1>

            <p className="text-white text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Ife Youth Sports Development Camp 2026.
              High-performance training for the next generation of champions.
            </p>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                currentSlide === idx
                  ? 'w-12 bg-amber-400'
                  : 'w-4 bg-white/50'
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
              <p className="text-amber-500 font-semibold uppercase tracking-widest text-xs mb-2">
                The Camp Experience
              </p>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-black">
                Gallery
              </h2>
            </div>

            <Link
              to="/gallery"
              className="group flex items-center gap-3 px-6 py-3 bg-[#0B1C2D] text-white rounded-full font-semibold text-sm hover:bg-amber-500 transition-all shadow-md"
            >
              View Full Gallery
              <ImageIcon
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {STATIC_GALLERY.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className="relative aspect-square overflow-hidden rounded-3xl group shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Deep Navy Overlay Instead of Gray */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <p className="text-white text-sm font-semibold tracking-wide">
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