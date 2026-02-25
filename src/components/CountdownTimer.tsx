import  { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
function calculateTimeLeft(): TimeLeft {
  const targetDate = new Date('2026-02-25T08:00:00');
  const difference = +targetDate - +new Date();
  if (difference <= 0)
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(difference / (1000 * 60 * 60) % 24),
    minutes: Math.floor(difference / 1000 / 60 % 60),
    seconds: Math.floor(difference / 1000 % 60)
  };
}
function FlipUnit({ value, label }: {value: number;label: string;}) {
  const display = value.toString().padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-navy border-2 border-gold/40 rounded-xl overflow-hidden shadow-2xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{
              y: -30,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 30,
              opacity: 0
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut'
            }}
            className="font-heading text-4xl md:text-5xl text-gold">

            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-gray-300 text-xs md:text-sm font-semibold uppercase tracking-widest">
        {label}
      </span>
    </div>);

}
export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="bg-navy py-16 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
          'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}>

          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            IYSDC 2026 • Maiden Edition
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-2">
            CAMP BEGINS IN
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            February 25–28, 2026 • Ife Grand Resort, Ile-Ife
          </p>
        </motion.div>
        <div className="flex justify-center items-center gap-4 md:gap-8">
          <FlipUnit value={timeLeft.days} label="Days" />
          <span className="text-gold font-heading text-4xl md:text-5xl mb-6">
            :
          </span>
          <FlipUnit value={timeLeft.hours} label="Hours" />
          <span className="text-gold font-heading text-4xl md:text-5xl mb-6">
            :
          </span>
          <FlipUnit value={timeLeft.minutes} label="Minutes" />
          <span className="text-gold font-heading text-4xl md:text-5xl mb-6">
            :
          </span>
          <FlipUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </section>);

}