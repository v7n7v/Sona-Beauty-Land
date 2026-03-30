import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Calendar, Clock, User, Phone, CheckCircle2,
  MapPin, Scissors, Sparkles, Star, ChevronRight, Menu,
  Loader2, ChevronLeft, X, Heart, Globe, Play, Lock,
  Search, Filter, Trash2, Check, XCircle, Eye,
  Flower, Plus, Tag, Coins, Edit2
} from 'lucide-react';

const IconMapping = {
  Sparkles, Scissors, Star, Heart, Flower
};

const DEFAULT_SERVICES = [
  { id: 'srv-1', name: 'Signature Glam Makeup', description: 'Flawless glam makeup for any occasion.', price: '1500 ETB', duration: '60 min', rating: '5.0', iconName: 'Sparkles', colorClass: "icon-pink", tag: 'Popular', category: 'Makeup' },
  { id: 'srv-2', name: 'Bridal Supreme', description: 'Our comprehensive bridal preparation package.', price: '5000 ETB', duration: '120 min', rating: '5.0', iconName: 'Star', colorClass: "icon-amber", tag: 'Best', category: 'Makeup' },
  { id: 'srv-m3', name: 'Everyday Natural Look', description: 'Subtle, glowing makeup for daytime wear.', price: '800 ETB', duration: '40 min', rating: '4.8', iconName: 'Flower', colorClass: "icon-blue", tag: 'Quick', category: 'Makeup' },
  { id: 'srv-m4', name: 'Event & Party Glam', description: 'Bold and striking makeup for special events.', price: '1200 ETB', duration: '50 min', rating: '4.9', iconName: 'Heart', colorClass: "icon-purple", tag: 'Hot', category: 'Makeup' },
  
  { id: 'srv-3', name: 'Expert Hair Styling', description: 'Expert styling, treatments, and elegant cuts.', price: '800 ETB', duration: '45 min', rating: '4.9', iconName: 'Scissors', colorClass: "icon-amber", tag: 'Best', category: 'Hair' },
  { id: 'srv-4', name: 'Silk Press Blowout', description: 'Silky smooth blowout for lasting volume.', price: '600 ETB', duration: '30 min', rating: '4.8', iconName: 'Heart', colorClass: "icon-pink", tag: 'Hot', category: 'Hair' },
  { id: 'srv-h3', name: 'Deep Conditioning SPA', description: 'Nourishing treatment for damaged and dry hair.', price: '1000 ETB', duration: '60 min', rating: '5.0', iconName: 'Sparkles', colorClass: "icon-blue", tag: 'Relax', category: 'Hair' },
  { id: 'srv-h4', name: 'Signature Hair Cut', description: 'Precision styling tailored perfectly to you.', price: '700 ETB', duration: '40 min', rating: '4.9', iconName: 'Scissors', colorClass: "icon-purple", tag: 'Popular', category: 'Hair' },

  { id: 'srv-5', name: 'Ombre Nails', description: 'Stunning seamless ombré nail art designs.', price: '1200 ETB', duration: '90 min', rating: '4.9', iconName: 'Star', colorClass: "icon-purple", tag: 'Hot', category: 'Nails' },
  { id: 'srv-6', name: 'Classic Nail Care', description: 'Extensive care, health, and natural beauty.', price: '400 ETB', duration: '30 min', rating: '4.8', iconName: 'Heart', colorClass: "icon-blue", tag: 'New', category: 'Nails' },
  { id: 'srv-7', name: 'Gel Extensions', description: 'Durable gel extensions with custom shapes.', price: '1500 ETB', duration: '120 min', rating: '4.9', iconName: 'Sparkles', colorClass: "icon-purple", tag: 'Popular', category: 'Nails' },
  { id: 'srv-8', name: 'Luxury Pedicure', description: 'Relaxing foot spa and premium polish.', price: '800 ETB', duration: '60 min', rating: '5.0', iconName: 'Flower', colorClass: "icon-pink", tag: 'Relax', category: 'Nails' },
];

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTok = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
  </svg>
);

import './index.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SonaLogo = ({ className = "", onClick }) => {
  const [logoKey, setLogoKey] = useState(0);
  const svgRef = useRef(null);
  const [brushPos, setBrushPos] = useState({ x: 28, y: 70, angle: -25 });
  const [animPhase, setAnimPhase] = useState('writing'); // 'writing' | 'done'

  // ── Hand-crafted SVG paths that trace each letter of "Sona" in elegant cursive ──
  // S: starts top-right, curves left, sweeps down-right, curves left
  const pathS = "M 68 32 C 62 28, 38 28, 34 38 C 28 52, 58 56, 62 62 C 68 72, 62 86, 42 88 C 32 88, 24 82, 28 74";
  // o: a smooth oval
  const pathO = "M 92 88 C 92 64, 68 56, 68 72 C 68 88, 92 96, 92 72 C 92 64, 88 58, 82 62";
  // n: up-stroke then arch down
  const pathN = "M 96 88 L 96 58 C 96 58, 98 50, 110 50 C 122 50, 124 60, 124 68 L 124 88";
  // a: looping around then stem
  const pathA = "M 156 62 C 140 58, 128 62, 130 74 C 132 86, 148 90, 156 78 L 156 56 C 156 80, 158 88, 160 92";

  // Combined single path for brush tracking
  const combinedPath = `${pathS} M 68 74 ${pathO} M 82 62 ${pathN} M 124 88 ${pathA}`;

  // Each letter's drawing config: path, duration, delay, total path length estimate
  const letters = [
    { id: 'S', path: pathS, duration: 0.9, delay: 0.4, len: 180 },
    { id: 'o', path: pathO, duration: 0.7, delay: 1.3, len: 140 },
    { id: 'n', path: pathN, duration: 0.6, delay: 2.0, len: 110 },
    { id: 'a', path: pathA, duration: 0.8, delay: 2.6, len: 160 },
  ];

  const totalDuration = 3.4; // total writing time
  const DELAY_START = 0.4;

  // Brush tracking: sample points along paths using requestAnimationFrame
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const allPaths = svg.querySelectorAll('.sona-letter-path');
    if (allPaths.length === 0) return;

    // Build a timeline of {startTime, endTime, pathEl}
    const timeline = letters.map((l, i) => ({
      startTime: l.delay,
      endTime: l.delay + l.duration,
      pathEl: allPaths[i],
      pathLength: allPaths[i]?.getTotalLength() || l.len,
    }));

    const startTs = performance.now();
    let frame;

    const tick = (now) => {
      const elapsed = (now - startTs) / 1000;

      // Find which letter is currently being drawn
      let found = false;
      for (const seg of timeline) {
        if (elapsed >= seg.startTime && elapsed <= seg.endTime && seg.pathEl) {
          const progress = (elapsed - seg.startTime) / (seg.endTime - seg.startTime);
          const clamped = Math.min(Math.max(progress, 0), 1);
          const pt = seg.pathEl.getPointAtLength(clamped * seg.pathLength);

          // Compute tangent angle for brush tilt
          const pt2 = seg.pathEl.getPointAtLength(Math.min((clamped + 0.02) * seg.pathLength, seg.pathLength));
          const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI) - 90;

          setBrushPos({ x: pt.x, y: pt.y, angle });
          found = true;
          break;
        }
      }

      if (elapsed < totalDuration + 0.2) {
        frame = requestAnimationFrame(tick);
      } else {
        setAnimPhase('done');
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [logoKey]);

  // Paint drip positions (appear after writing)
  const drips = [
    { x: 42, y: 90, delay: 3.6, height: 8 },
    { x: 124, y: 90, delay: 3.8, height: 6 },
    { x: 156, y: 94, delay: 3.9, height: 10 },
  ];

  // Sparkle positions
  const sparkles = [
    { x: 20, y: 28, size: 8, delay: 3.5, color: '#FBBF24', spin: 180 },
    { x: 170, y: 26, size: 6, delay: 3.7, color: '#EC4899', spin: -180 },
    { x: 166, y: 96, size: 5, delay: 3.9, color: '#8B5CF6', spin: 120 },
  ];

  return (
    <motion.svg
      ref={svgRef}
      key={logoKey}
      onClick={(e) => {
        setLogoKey(k => k + 1);
        setAnimPhase('writing');
        if (onClick) onClick(e);
      }}
      viewBox="0 0 230 150"
      style={{ height: '7rem', cursor: 'pointer', overflow: 'visible', width: 'auto' }}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sona Beauty Land Logo"
    >
      <defs>
        {/* Glow filter for the brush tip */}
        <filter id={`brush-glow-${logoKey}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft paint texture filter */}
        <filter id={`paint-texture-${logoKey}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>

        {/* Pink gradient for the letters */}
        <linearGradient id={`sona-pink-grad-${logoKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="40%" stopColor="#F472B6" />
          <stop offset="70%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>

        {/* Shimmer gradient overlay */}
        <linearGradient id={`sona-shimmer-${logoKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          <animate attributeName="x1" from="-100%" to="100%" dur="3s" begin={`${totalDuration + 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="200%" dur="3s" begin={`${totalDuration + 0.5}s`} repeatCount="indefinite" />
        </linearGradient>
      </defs>

      {/* ═══ LETTER PATHS — drawn by stroke-dashoffset animation ═══ */}
      {letters.map((letter) => (
        <React.Fragment key={`${letter.id}-${logoKey}`}>
          {/* Shadow/glow layer */}
          <motion.path
            d={letter.path}
            stroke="rgba(236, 72, 153, 0.25)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: letter.duration, delay: letter.delay, ease: [0.22, 0.61, 0.36, 1] },
              opacity: { duration: 0.15, delay: letter.delay }
            }}
            style={{ filter: 'blur(6px)' }}
          />

          {/* Main stroke — the "paint" */}
          <motion.path
            className="sona-letter-path"
            d={letter.path}
            stroke={`url(#sona-pink-grad-${logoKey})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: letter.duration, delay: letter.delay, ease: [0.22, 0.61, 0.36, 1] },
              opacity: { duration: 0.1, delay: letter.delay }
            }}
            filter={`url(#paint-texture-${logoKey})`}
          />

          {/* Highlight/shine layer — thinner, lighter */}
          <motion.path
            d={letter.path}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: letter.duration, delay: letter.delay + 0.05, ease: [0.22, 0.61, 0.36, 1] },
              opacity: { duration: 0.15, delay: letter.delay + 0.05 }
            }}
          />
        </React.Fragment>
      ))}

      {/* ═══ SHIMMER OVERLAY — sweeps across completed text ═══ */}
      <motion.rect
        x="20" y="20" width="160" height="80"
        fill={`url(#sona-shimmer-${logoKey})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: totalDuration + 0.3, duration: 0.5 }}
        style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}
      />

      {/* ═══ PAINT DRIPS — tiny drops falling from letter endpoints ═══ */}
      {drips.map((drip, i) => (
        <motion.ellipse
          key={`drip-${i}-${logoKey}`}
          cx={drip.x}
          cy={drip.y}
          rx="1.5"
          ry="1"
          fill="#EC4899"
          initial={{ opacity: 0, cy: drip.y, ry: 1 }}
          animate={{ opacity: [0, 0.7, 0.4, 0], cy: drip.y + drip.height, ry: [1, 2.5, 1.5, 0.5] }}
          transition={{ duration: 1.2, delay: drip.delay, ease: "easeIn" }}
        />
      ))}

      {/* ═══ THE NAIL POLISH BRUSH — follows the actual letter paths ═══ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: animPhase === 'done' ? 0 : 1 }}
        transition={{ opacity: { duration: animPhase === 'done' ? 0.4 : 0.15, delay: animPhase === 'done' ? 0 : DELAY_START } }}
        style={{ willChange: 'transform' }}
      >
        <g transform={`translate(${brushPos.x}, ${brushPos.y}) rotate(${brushPos.angle * 0.3 - 15})`}>
          {/* Brush handle — gradient purple */}
          <rect x="-7" y="-55" width="14" height="32" rx="3" fill="url(#brush-handle-grad)" />
          <defs>
            <linearGradient id="brush-handle-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
          {/* Handle shine */}
          <rect x="-5" y="-52" width="3" height="26" rx="1.5" fill="#A78BFA" opacity="0.7" />
          <rect x="0" y="-50" width="1.5" height="20" rx="0.75" fill="#C4B5FD" opacity="0.4" />
          {/* Metal ferrule */}
          <rect x="-5.5" y="-23" width="11" height="14" rx="1" fill="#94A3B8" />
          <rect x="-5.5" y="-23" width="4" height="14" rx="1" fill="#CBD5E1" opacity="0.5" />
          <rect x="-4" y="-22" width="1.2" height="12" fill="#E2E8F0" opacity="0.6" />
          {/* Brush tip — loaded with pink paint */}
          <path d="M-5 -9 C-5 -9, -7 4, -3 8 C 0 10, 3 10, 5 7 C 7 3, 5 -9, 5 -9 Z" fill="#EC4899" />
          {/* Paint gloss on tip */}
          <path d="M-3 -7 C-3 -4, -2 0, 0 2 C 0.5 0, 0 -4, -1 -7 Z" fill="#F9A8D4" opacity="0.6" />
          {/* Tiny paint glow at contact point */}
          <circle cx="0" cy="8" r="4" fill="#EC4899" opacity="0.3" filter={`url(#brush-glow-${logoKey})`} />
        </g>
      </motion.g>

      {/* ═══ SPARKLES — burst in after writing completes ═══ */}
      {sparkles.map((sp, i) => (
        <motion.g
          key={`sparkle-${i}-${logoKey}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: sp.delay, duration: 0.5, type: "spring", stiffness: 300, damping: 15 }}
        >
          <motion.g
            style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
            animate={{ rotate: sp.spin }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          >
            {/* 4-pointed star sparkle */}
            <path
              d={`M ${sp.x} ${sp.y - sp.size} L ${sp.x + sp.size * 0.3} ${sp.y - sp.size * 0.3} L ${sp.x + sp.size} ${sp.y} L ${sp.x + sp.size * 0.3} ${sp.y + sp.size * 0.3} L ${sp.x} ${sp.y + sp.size} L ${sp.x - sp.size * 0.3} ${sp.y + sp.size * 0.3} L ${sp.x - sp.size} ${sp.y} L ${sp.x - sp.size * 0.3} ${sp.y - sp.size * 0.3} Z`}
              fill={sp.color}
            />
          </motion.g>
        </motion.g>
      ))}

      {/* ═══ FLOATING MICRO-DOTS — ambient beauty particles ═══ */}
      {[
        { x: 175, y: 40, r: 2, color: '#8B5CF6', d: 3.6 },
        { x: 12, y: 60, r: 1.5, color: '#EC4899', d: 3.8 },
        { x: 80, y: 20, r: 1.8, color: '#FBBF24', d: 4.0 },
      ].map((dot, i) => (
        <motion.circle
          key={`dot-${i}-${logoKey}`}
          cx={dot.x} cy={dot.y} r={dot.r}
          fill={dot.color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0.5], scale: [0, 1.2, 1] }}
          transition={{ delay: dot.d, duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* ═══ TYPEWRITTEN SUBTEXT — "BEAUTY LAND" types in character by character ═══ */}
      <text x="28" y="122" fontFamily="'Inter', 'Segoe UI', sans-serif" fontSize="14" fontWeight="800" fill="#8B5CF6" letterSpacing="6">
        {"BEAUTY LAND".split("").map((char, index) => (
          <motion.tspan
            key={`sub-${index}-${logoKey}`}
            initial={{ opacity: 0, dy: 4 }}
            animate={{ opacity: 1, dy: 0 }}
            transition={{ delay: totalDuration + 0.2 + index * 0.08, duration: 0.12 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.tspan>
        ))}
      </text>

      {/* ═══ DECORATIVE UNDERLINE — sweeps under "BEAUTY LAND" ═══ */}
      <motion.line
        x1="28" y1="128" x2="170" y2="128"
        stroke="#EC4899"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ delay: totalDuration + 1.2, duration: 0.6, ease: "easeOut" }}
      />
    </motion.svg>
  );
};

const AnimatedStat = ({ end, suffix = "", label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && typeof end === 'number') {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeInOutQuart = progress < 0.5 ? 8 * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 4) / 2;
        setCount(Math.floor(easeInOutQuart * end));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <div className="stat-item" ref={ref}>
      <h3>{typeof end === 'number' ? count : end}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
};

const ServiceCard = ({ service, onClick, delayIndex, promo }) => {
  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -15;
    const rotateY = (x / rect.width) * 15;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = `perspective(800px) rotateX(0) rotateY(0) scale(1)`;
  };

  const basePriceMatch = service.price.match(/\d+/);
  const basePrice = basePriceMatch ? parseInt(basePriceMatch[0], 10) : 0;
  const hasPromo = promo?.active && basePrice > 0 && promo?.percent > 0;
  const discountedPrice = hasPromo ? Math.round(basePrice * (1 - promo.percent / 100)) : basePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: delayIndex * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      layoutId={`service-card-${service.id}`}
      key={service.id}
      onClick={onClick}
      onMouseMove={handleTilt}
      onMouseLeave={handleLeave}
      className="service-card"
    >
      <div className="service-tag">{service.tag}</div>
      <motion.div layoutId={`service-icon-${service.id}`} className={`service-icon ${service.colorClass}`}>
        {(() => {
          const IconComponent = IconMapping[service.iconName] || Star;
          return <IconComponent size={32} />;
        })()}
      </motion.div>
      <motion.h4 layoutId={`service-title-${service.id}`} className="service-name">{service.name}</motion.h4>
      <p className="service-price">
        {hasPromo ? (
          <>
            <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.85rem', marginRight: '8px', fontWeight: 500 }}>{service.price}</span>
            <span style={{ color: '#EC4899', fontWeight: 800 }}>{discountedPrice} ETB</span>
          </>
        ) : (
          service.price
        )}
      </p>
      <div className="service-meta">
        <div className="meta-item"><Clock size={16} /> {service.duration}</div>
        <div className="rating-badge"><Star size={12} fill="currentColor" /> {service.rating}</div>
      </div>
    </motion.div>
  );
};

const RotatingFlower = () => {
  const { scrollYProgress } = useScroll();
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        right: '32px',
        bottom: '32px',
        rotate: rotation,
        zIndex: 50,
        pointerEvents: 'none',
        color: 'var(--color-primary, #EC4899)',
        opacity: 0.85,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
      }}
    >
      <Flower size={48} strokeWidth={1.5} />
    </motion.div>
  );
};

const App = () => {
  const [db, setDb] = useState(null);
  const dbRef = useRef(null);
  const [auth, setAuth] = useState(null);
  const authRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [lang, setLang] = useState('en');
  const [activeStep, setActiveStep] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', service: '', date: '', time: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Admin state
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminFilter, setAdminFilter] = useState('all');
  const [adminSearch, setAdminSearch] = useState('');

  // === Theme state: auto-detect system preference, user can override ===
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Apply/sync theme to document and respond to system changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    // Set initial
    document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    return () => mq.removeEventListener('change', handler);
  }, []);
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'Hanna Mekonnen', phone: '0911223344', service: 'Gel Polish', date: '2026-04-01', time: '10:00', status: 'confirmed', createdAt: '2026-03-28T09:15:00' },
    { id: 2, name: 'Soliana Tadesse', phone: '0922334455', service: 'Pedicure', date: '2026-04-01', time: '14:00', status: 'pending', createdAt: '2026-03-28T11:30:00' },
    { id: 3, name: 'Eden Alemu', phone: '0933445566', service: 'Acrylic', date: '2026-04-02', time: '11:00', status: 'completed', createdAt: '2026-03-27T16:45:00' },
    { id: 4, name: 'Meron Kebede', phone: '0944556677', service: 'Manicure', date: '2026-04-02', time: '15:30', status: 'confirmed', createdAt: '2026-03-29T08:00:00' },
    { id: 5, name: 'Betiel Girma', phone: '0955667788', service: 'Gel Polish', date: '2026-04-03', time: '09:00', status: 'cancelled', createdAt: '2026-03-29T10:20:00' },
  ]);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '', rating: '5.0', iconName: 'Star', colorClass: 'icon-pink', tag: '', category: 'Nails' });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [storeStatusOpen, setStoreStatusOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  // Opening Hours state (editable in admin)
  const DEFAULT_HOURS = [
    { day: 'Monday',    open: '09:00', close: '20:00', closed: false },
    { day: 'Tuesday',   open: '09:00', close: '20:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '20:00', closed: false },
    { day: 'Thursday',  open: '09:00', close: '20:00', closed: false },
    { day: 'Friday',    open: '09:00', close: '21:00', closed: false },
    { day: 'Saturday',  open: '09:00', close: '21:00', closed: false },
    { day: 'Sunday',    open: '10:00', close: '18:00', closed: false },
  ];
  const [openingHours, setOpeningHours] = useState(DEFAULT_HOURS);

  // Social Media Links state
  const [socialLinks, setSocialLinks] = useState({ instagram: '', tiktok: '', phone: '' });

  // === Store Open/Closed state ===
  // null = auto (based on hours), 'open' = forced open, 'closed' = forced closed
  const [storeOverride, setStoreOverride] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tick the clock every 30s so status updates automatically
  useEffect(() => {
    const tick = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(tick);
  }, []);

  // Derive store open/closed from hours + override
  const getStoreStatus = () => {
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if (storeOverride === 'open')  return { isOpen: true,  forced: true,  nextDay: null, nextTime: null };
    if (storeOverride === 'closed') return { isOpen: false, forced: true,  nextDay: null, nextTime: null };
    const todayIdx  = currentTime.getDay();
    const todayHours = openingHours[todayIdx === 0 ? 6 : todayIdx - 1]; // our array starts Monday
    // Convert HH:MM to today's Date for comparison
    const toDate = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      const d = new Date(currentTime);
      d.setHours(h, m, 0, 0);
      return d;
    };
    const nowOpen = !todayHours.closed && currentTime >= toDate(todayHours.open) && currentTime < toDate(todayHours.close);
    if (nowOpen) return { isOpen: true, forced: false, nextDay: null, nextTime: null };
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextIdx = (todayIdx + i) % 7;
      const nextH   = openingHours[nextIdx === 0 ? 6 : nextIdx - 1];
      if (!nextH.closed) {
        return { isOpen: false, forced: false, nextDay: DAYS[nextIdx], nextTime: nextH.open };
      }
    }
    return { isOpen: false, forced: false, nextDay: null, nextTime: null };
  };
  const storeStatus = getStoreStatus();

  // Slider state
  const [currentImg, setCurrentImg] = useState(0);
  const DEFAULT_HERO_IMAGES = [];
  const DEFAULT_ARTISTRY_IMAGES = [];
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const [artistryImages, setArtistryImages] = useState(DEFAULT_ARTISTRY_IMAGES);
  const [galleryUploading, setGalleryUploading] = useState({ hero: false, artistry: false });
  const [galleryUploadProgress, setGalleryUploadProgress] = useState({ hero: [], artistry: [] });

  // Testimonial state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [promo, setPromo] = useState({ active: false, percent: '' });
  const testimonials = [
    { text: "Sona completely transformed my nails. The gel polish lasted 3 weeks and the staff is incredibly sweet!", name: "Hanna M.", role: "Regular Client" },
    { text: "Best luxury nail experience in Addis. The salon is gorgeous and their pedicures are pure heaven.", name: "Soliana T.", role: "Beauty Blogger" },
    { text: "My acrylics have never looked sharper. Impeccable attention to detail and so relaxing.", name: "Eden A.", role: "First-time Client" }
  ];

  // Typewriter effect for testimonial quotes
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const full = testimonials[currentTestimonial].text;
    setTypedText('');
    setIsTyping(true);
    let i = 0;
    const speed = 22; // ms per character
    const timer = setInterval(() => {
      i++;
      setTypedText(full.slice(0, i));
      if (i >= full.length) { clearInterval(timer); setIsTyping(false); }
    }, speed);
    return () => clearInterval(timer);
  }, [currentTestimonial]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentImg((prev) => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % heroImages.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const configStr = typeof import.meta.env.VITE_FIREBASE_CONFIG !== 'undefined' ? import.meta.env.VITE_FIREBASE_CONFIG : '{}';
        if (configStr === '{}') { setIsAuthReady(true); setUserId("mock"); setDb({ isMock: true }); return; }
        const app = initializeApp(JSON.parse(configStr));
        const firestoreDb = getFirestore(app);
        setDb(firestoreDb);
        dbRef.current = firestoreDb;
        const fa = getAuth(app);
        setAuth(fa);
        authRef.current = fa;
        await signInAnonymously(fa);
        onAuthStateChanged(fa, (u) => { if (u) { setUserId(u.uid); setIsAuthReady(true); } });
        // Load gallery images from Firestore
        try {
          const galleryDoc = await getDoc(doc(firestoreDb, 'settings', 'gallery'));
          if (galleryDoc.exists()) {
            const data = galleryDoc.data();
            if (data.heroImages && data.heroImages.length > 0) setHeroImages(data.heroImages);
            if (data.artistryImages && data.artistryImages.length > 0) setArtistryImages(data.artistryImages);
          }
        } catch (e) { console.warn('Could not load gallery from Firestore', e); }

        // Load services
        try {
          const servicesDoc = await getDoc(doc(firestoreDb, 'settings', 'services'));
          if (servicesDoc.exists()) {
            const data = servicesDoc.data();
            if (data.items && data.items.length > 0) setServices(data.items);
          }
        } catch (e) { console.warn('Could not load services from Firestore', e); }
      } catch (e) { console.error(e); }
    };
    initFirebase();

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Save gallery to Firestore
  const saveGalleryToFirestore = async (heroImgs, artistryImgs) => {
    const currentDb = dbRef.current;
    if (!currentDb || currentDb.isMock) {
      console.warn('saveGalleryToFirestore: db not ready or mock, skipping');
      return;
    }
    try {
      await setDoc(doc(currentDb, 'settings', 'gallery'), { heroImages: heroImgs, artistryImages: artistryImgs });
      console.log('Gallery saved to Firestore successfully');
    } catch (e) { console.error('Could not save gallery to Firestore:', e); }
  };

  const saveServicesToFirestore = async (newServices) => {
    const currentDb = dbRef.current;
    if (!currentDb || currentDb.isMock) return;
    try {
      await setDoc(doc(currentDb, 'settings', 'services'), { items: newServices });
    } catch (e) { console.error('Could not save services', e); }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    const upd = [...services, { ...newService, id: `srv-${Date.now()}` }];
    setServices(upd);
    saveServicesToFirestore(upd);
    setNewService({ name: '', description: '', price: '', duration: '', rating: '5.0', iconName: 'Star', colorClass: 'icon-pink', tag: '', category: 'Nails' });
  };

  const handleDeleteService = (id) => {
    const upd = services.filter(s => s.id !== id);
    setServices(upd);
    saveServicesToFirestore(upd);
  };

  // Upload images to Firebase Storage
  const handleGalleryUpload = async (files, section) => {
    if (!files || files.length === 0) return;
    const maxCount = section === 'hero' ? 5 : 6;
    const current = section === 'hero' ? heroImages : artistryImages;
    const slotsLeft = maxCount - current.length;
    if (slotsLeft <= 0) return;
    const toUpload = Array.from(files).slice(0, slotsLeft);
    setGalleryUploading(prev => ({ ...prev, [section]: true }));
    setGalleryUploadProgress(prev => ({ ...prev, [section]: toUpload.map(f => ({ name: f.name, done: false })) }));

    const newUrls = [];
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      try {
        // If Firebase Storage is available, upload. Otherwise use a local blob URL as fallback.
        let url;
        if (dbRef.current && !dbRef.current.isMock && authRef.current) {
          const app = authRef.current.app;
          const storage = getStorage(app);
          const storageRef = ref(storage, `gallery/${section}/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          url = await getDownloadURL(storageRef);
        } else {
          url = URL.createObjectURL(file);
        }
        newUrls.push(url);
        setGalleryUploadProgress(prev => ({
          ...prev,
          [section]: prev[section].map((p, idx) => idx === i ? { ...p, done: true } : p)
        }));
      } catch (e) { console.error('Upload failed', e); }
    }

    if (section === 'hero') {
      const updated = [...heroImages, ...newUrls];
      setHeroImages(updated);
      await saveGalleryToFirestore(updated, artistryImages);
    } else {
      const tallPattern = [true, false, true, false, true, false];
      const newItems = newUrls.map((url, i) => ({
        url,
        alt: `Artistry ${artistryImages.length + i + 1}`,
        tall: tallPattern[(artistryImages.length + i) % 6]
      }));
      const updated = [...artistryImages, ...newItems];
      setArtistryImages(updated);
      await saveGalleryToFirestore(heroImages, updated);
    }
    setTimeout(() => {
      setGalleryUploading(prev => ({ ...prev, [section]: false }));
      setGalleryUploadProgress(prev => ({ ...prev, [section]: [] }));
    }, 800);
  };

  const handleGalleryDelete = (index, section) => {
    if (section === 'hero') {
      const updated = heroImages.filter((_, i) => i !== index);
      setHeroImages(updated);
      if (currentImg >= updated.length) setCurrentImg(0);
      saveGalleryToFirestore(updated, artistryImages);
    } else {
      const updated = artistryImages.filter((_, i) => i !== index);
      setArtistryImages(updated);
      saveGalleryToFirestore(heroImages, updated);
    }
  };

  const handleGalleryRestoreDefaults = (section) => {
    if (section === 'hero') {
      setHeroImages(DEFAULT_HERO_IMAGES);
      setCurrentImg(0);
      saveGalleryToFirestore(DEFAULT_HERO_IMAGES, artistryImages);
    } else {
      setArtistryImages(DEFAULT_ARTISTRY_IMAGES);
      saveGalleryToFirestore(heroImages, DEFAULT_ARTISTRY_IMAGES);
    }
  };
  const [services, setServices] = useState(DEFAULT_SERVICES);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!db || !isAuthReady) return;
    setIsSubmitting(true);
    const newAppointment = {
      id: Date.now(),
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setTimeout(() => { setActiveStep('success'); setIsSubmitting(false); setBookingData({ name: '', phone: '', service: '', date: '', time: '' }); }, 1500);
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const filteredAppointments = appointments
    .filter(a => adminFilter === 'all' || a.status === adminFilter)
    .filter(a => adminSearch === '' || a.name.toLowerCase().includes(adminSearch.toLowerCase()) || a.phone.includes(adminSearch) || a.service.toLowerCase().includes(adminSearch.toLowerCase()));

  return (
    <div className="app-wrapper">
      <RotatingFlower />
      {/* Animated Blobs Background */}
      <div className="bg-blobs">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <div className="logo-container" onClick={() => setActiveStep('home')}>
            <SonaLogo />
          </div>

          <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="nav-actions">
            <div className="btn-toggle">
              <button onClick={() => setLang('am')} className={lang === 'am' ? 'active' : ''}>አማርኛ</button>
              <button onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''}>EN</button>
            </div>
            <button onClick={() => setActiveStep('about')} className="btn-text" style={{ fontWeight: 600 }}>
              About
            </button>
            <button onClick={() => setShowLocation(true)} className="btn-text">
              <MapPin size={16} /> Location
            </button>

            {/* ✨ Stunning Day/Night Toggle ✨ */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className={`theme-toggle ${darkMode ? 'theme-night' : 'theme-day'}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to Day mode' : 'Switch to Night mode'}
            >
              {/* Sky track */}
              <span className="theme-track">
                {/* Stars (visible in night) */}
                <span className="theme-star s1" />
                <span className="theme-star s2" />
                <span className="theme-star s3" />
                {/* The sliding orb: sun or moon */}
                <span className="theme-orb">
                  {darkMode ? (
                    // Moon face
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    // Sun face
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="5" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5"/>
                      {[0,45,90,135,180,225,270,315].map(a => (
                        <line key={a}
                          x1={12 + 7.5*Math.cos(a*Math.PI/180)}
                          y1={12 + 7.5*Math.sin(a*Math.PI/180)}
                          x2={12 + 9.5*Math.cos(a*Math.PI/180)}
                          y2={12 + 9.5*Math.sin(a*Math.PI/180)}
                          stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"
                        />
                      ))}
                    </svg>
                  )}
                </span>
              </span>
            </button>

            <button onClick={() => setActiveStep('booking')} className="btn-primary">
              Book Now
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mobile-menu"
            >
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '8px' }}>
                <button
                  onClick={() => setDarkMode(d => !d)}
                  className={`theme-toggle ${darkMode ? 'theme-night' : 'theme-day'}`}
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={darkMode ? 'Switch to Day mode' : 'Switch to Night mode'}
                >
                  <span className="theme-track">
                    <span className="theme-star s1" />
                    <span className="theme-star s2" />
                    <span className="theme-star s3" />
                    <span className="theme-orb">
                      {darkMode ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="5" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5"/>
                          {[0,45,90,135,180,225,270,315].map(a => (
                            <line key={a}
                              x1={12 + 7.5*Math.cos(a*Math.PI/180)}
                              y1={12 + 7.5*Math.sin(a*Math.PI/180)}
                              x2={12 + 9.5*Math.cos(a*Math.PI/180)}
                              y2={12 + 9.5*Math.sin(a*Math.PI/180)}
                              stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"
                            />
                          ))}
                        </svg>
                      )}
                    </span>
                  </span>
                </button>
              </div>
              <button onClick={() => { setActiveStep('about'); setMobileMenuOpen(false); }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>About Me</button>
              <button onClick={() => { setShowLocation(true); setMobileMenuOpen(false); }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}><MapPin size={16} /> Location</button>
              <button onClick={() => { setActiveStep('booking'); setMobileMenuOpen(false); }} className="btn-primary" style={{ width: '100%' }}>Book Now</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="main-wrapper">
        <AnimatePresence mode="wait">
          {activeStep === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              className="container"
            >
              {/* Hero Section */}
              <div className="hero-section">
                <div className="sparkle-field">
                  {[...Array(15)].map((_, i) => (
                    <span key={i} className="sparkle" style={{
                      left: `${Math.random() * 100}%`,
                      bottom: '-10px',
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${4 + Math.random() * 4}s`,
                      background: i % 3 === 0 ? '#EC4899' : '#8B5CF6'
                    }}></span>
                  ))}
                </div>

                <div className="hero-content">
                  {/* === Unified Open/Closed Status Card === */}
                  <motion.div
                    key={storeStatus.isOpen ? 'open' : 'closed'}
                    initial={{ opacity: 0, y: -12, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    style={{ marginBottom: '28px', display: 'inline-block' }}
                  >
                    <div className={`store-hanger ${storeStatus.isOpen ? 'hanger-open' : 'hanger-closed'}`}>
                      {/* Physical hook */}
                      <div className="hanger-hook" />
                      {/* Unified card sign */}
                      <div className="hanger-sign">
                        {/* Row 1: pulse dot + location + status */}
                        <div className="hanger-row-top">
                          <div className="hanger-pulse" />
                          <span className="hanger-location">Jacross</span>
                          <div className="hanger-divider" />
                          <span className="hanger-status-text">
                            {storeStatus.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                          </span>
                          {storeStatus.forced && (
                            <span className="hanger-forced">Override</span>
                          )}
                        </div>
                        {/* Row 2: contextual message */}
                        <div className="hanger-row-bottom">
                          {storeStatus.isOpen ? (
                            <span className="hanger-sub open">
                              Walk-ins welcome · Book online for priority
                            </span>
                          ) : (
                            <span className="hanger-sub closed">
                              {storeStatus.nextDay
                                ? <>Opens {storeStatus.nextDay} at {storeStatus.nextTime} &mdash; </>                                : <>Currently unavailable &mdash; </>}
                              <button
                                onClick={() => setActiveStep('booking')}
                                className="hanger-book-btn"
                              >
                                Book your slot now →
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {promo.active && (
                    <motion.div 
                      key="hero-promo"
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '3rem',
                        fontSize: '1.25rem',
                        fontWeight: '900',
                        marginBottom: '28px',
                        boxShadow: '0 8px 25px rgba(236, 72, 153, 0.5)',
                        animation: 'pulse 2s infinite',
                        border: '2px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Sparkles size={20} />
                      🔥 {promo.percent}% OFF ONLINE BOOKINGS
                    </motion.div>
                  )}

                  <h2 className="hero-title">
                    Beauty Land <br />
                    <span className="hero-title-serif">Revealed.</span>
                  </h2>
                  <div className="hero-line"></div>
                  <p className="hero-subtitle">
                    Sona Beauty Land is Jacross's leading beauty hub combining modern techniques with world-class premium quality in Makeup, Hair, and Nails.
                  </p>
                  <div className="hero-actions">
                    <button onClick={() => setActiveStep('booking')} className="btn-primary" style={{ padding: '24px 48px', fontSize: '1.125rem', borderRadius: '2rem' }}>
                      Start Booking <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="slider-container">
                  <div className="slider-glass-frame">
                    <div className="slider-inner">
                      {heroImages.length > 0 ? (
                        <>
                          {heroImages.map((img, idx) => (
                            <div key={idx} className={`slide ${idx === currentImg ? 'active' : ''}`}>
                              <img src={img} alt="Salon look" />
                              <div className="slide-overlay"></div>
                            </div>
                          ))}
                          <div className="slider-controls">
                            <button onClick={prevImg} className="btn-nav"><ChevronLeft size={24} /></button>
                            <button onClick={nextImg} className="btn-nav"><ChevronRight size={24} /></button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="stats-bar">
                <AnimatedStat end={1200} suffix="+" label="Happy Clients" />
                <AnimatedStat end="4.9/5" suffix=" ⭐" label="Average Rating" />
                <AnimatedStat end={2024} label="Years of Beauty" />
              </div>

              {/* Service Grid Section */}
              <div className="services-section">
                <motion.div
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
                  className="section-header"
                >
                  <h3 className="section-title">Our Services</h3>
                  <p className="section-subtitle">Premium treatments crafted with detail and care by Sona.</p>
                </motion.div>

                <div className="services-container" style={{ display: 'flex', flexDirection: 'column', gap: '64px', width: '100%' }}>
                  {Array.from(new Set(services.map(s => s.category || 'Other'))).map((category, catIdx) => {
                    const catServices = services.filter(s => (s.category || 'Other') === category);
                    return (
                      <div key={category} className="service-category-block" style={{ width: '100%' }}>
                        <h4 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                          <Sparkles size={24} style={{ color: 'var(--color-primary)' }} /> {category}
                        </h4>
                        <div className="services-grid">
                          {catServices.map((service, idx) => (
                            <ServiceCard key={service.id} service={service} delayIndex={idx} onClick={() => setSelectedService(service)} promo={promo} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marquee Social Proof Strip */}
              <div className="marquee-strip" aria-hidden="true">
                {[0, 1].map(copy => (
                  <div key={copy} className="marquee-track">
                    {['Luxury Nail Art', 'Gel Polish', 'Ombré Nails', 'Bridal Makeup', 'Hair Styling', 'Nail Extensions', 'Premium Care', 'Award-Winning Studio', 'Jacross #1 Beauty', 'Book Today'].map((item, i) => (
                      <span key={i} className="marquee-item">
                        <span className="marquee-dot" />
                        {i % 3 === 0 ? <strong>{item}</strong> : item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {/* Gallery Section */}
              <div className="gallery-section">
                <motion.div
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                  className="section-header"
                >
                  <h3 className="section-title">Our Artistry</h3>
                  <p className="section-subtitle">A glimpse into our daily masterpieces.</p>
                </motion.div>
                <div className="gallery-grid">
                  {artistryImages.length > 0 ? (
                    artistryImages.map((item, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * (idx + 1), duration: 0.5 }} className={`gallery-item${item.tall ? ' tall' : ''}`}>
                        {/* Corner bracket accents — outside the inner clip */}
                        <div className="gallery-corner tl" />
                        <div className="gallery-corner tr" />
                        <div className="gallery-corner bl" />
                        <div className="gallery-corner br" />
                        {/* Inner wrapper clips image to card bounds, not touching the outer border */}
                        <div className="gallery-inner">
                          <img src={item.url} alt={item.alt} />
                          <div className="gallery-overlay">
                            <Heart size={36} />
                            <span className="gallery-overlay-label">{item.alt}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : null}
                </div>
              </div>

              {/* Opening Hours Public Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                style={{ margin: '120px 0 0', background: 'var(--color-dark)', borderRadius: '3rem', padding: '64px 40px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {/* ambient glow */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '6px 20px', borderRadius: '9999px', marginBottom: '16px' }}>
                    <Clock size={14} color="#FBBF24" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FBBF24' }}>Opening Hours</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, color: 'rgba(255,255,255,0.95)', margin: 0 }}>We're Here For You</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                  {openingHours.map(h => {
                    const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
                    const isToday = h.day === today;
                    return (
                      <div key={h.day} style={{ background: isToday ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.04)', border: isToday ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isToday ? '#EC4899' : 'rgba(255,255,255,0.7)' }}>{h.day}{isToday && <span style={{ fontSize: '0.6rem', marginLeft: '6px', background: '#EC4899', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>TODAY</span>}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: h.closed ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Testimonials + CTA — unified card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="testimonial-card"
              >
                {/* Stars */}
                <div className="stars">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
                </div>

                {/* Typewriter quote */}
                <p className="quote-text">
                  &ldquo;{typedText}<span className={`tw-cursor ${isTyping ? '' : 'tw-hide'}`}>|</span>&rdquo;
                </p>

                {/* Author */}
                <div className="customer-info">
                  <div className="customer-avatar">{testimonials[currentTestimonial].name.charAt(0)}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="customer-name">{testimonials[currentTestimonial].name}</div>
                    <div className="customer-role">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>

                {/* Pagination dots */}
                <div className="test-dots">
                  {testimonials.map((_, i) => (
                    <div key={i} onClick={() => setCurrentTestimonial(i)} className={`t-dot ${i === currentTestimonial ? 'active' : ''}`} />
                  ))}
                </div>

                {/* Divider */}
                <div className="card-divider" />

                {/* Promo badge (if active) */}
                {promo.active && (
                  <div style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#FBBF24,#F59E0B)', color: '#0F172A', padding: '6px 18px', borderRadius: '2rem', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 4px 16px rgba(251,191,36,0.35)' }}>
                    🔥 {promo.percent}% OFF — Limited Time
                  </div>
                )}

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <p className="glow-up-text">Ready for your Glow-Up?</p>
                  <button
                    onClick={() => setActiveStep('booking')}
                    className="btn-primary"
                    style={{ padding: '14px 40px', fontSize: '0.9rem', borderRadius: '2rem', letterSpacing: '0.1em' }}
                  >
                    Book Now <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* About Me Page */}
          {activeStep === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="container" style={{ padding: '120px 20px 60px 20px', display: 'flex', justifyContent: 'center' }}>
              <div className="form-card" style={{ maxWidth: '800px', width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <button onClick={() => setActiveStep('home')} className="btn-back" style={{ alignSelf: 'flex-start', marginBottom: '24px' }}>
                  <ChevronLeft size={20} /> Back to Home
                </button>
                <div style={{ width: '220px', height: '220px', borderRadius: '50%', overflow: 'hidden', border: '5px solid #FBCFE8', marginBottom: '24px', boxShadow: '0 8px 30px rgba(236, 72, 153, 0.2)' }}>
                  <img src="/yordanos.jpg" alt="Yordanos Dagnachew" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Yordanos Dagnachew</h1>
                <h3 style={{ fontSize: '1.2rem', color: '#EC4899', fontWeight: 600, letterSpacing: '2px', marginBottom: '32px', textTransform: 'uppercase' }}>Beauty Enthusiast</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', marginBottom: '40px' }}>
                    <div className="stat-item" style={{ background: '#F8FAFC', padding: '24px 20px', borderRadius: '1rem', border: '1px solid #E2E8F0', height: '100%' }}>
                        <div style={{ color: '#8B5CF6', marginBottom: '12px' }}><Star size={28} /></div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1E293B' }}>Civil Engineering</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Structural precision applied to artistic beauty.</p>
                    </div>
                    <div className="stat-item" style={{ background: '#F8FAFC', padding: '24px 20px', borderRadius: '1rem', border: '1px solid #E2E8F0', height: '100%' }}>
                        <div style={{ color: '#EC4899', marginBottom: '12px' }}><Sparkles size={28} /></div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1E293B' }}>Professional Artistry</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Expert in Makeup, Ombré, and Luxury Nail Care.</p>
                    </div>
                    <div className="stat-item" style={{ background: '#F8FAFC', padding: '24px 20px', borderRadius: '1rem', border: '1px solid #E2E8F0', height: '100%' }}>
                        <div style={{ color: '#10B981', marginBottom: '12px' }}><Heart size={28} /></div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1E293B' }}>Wellness Advocate</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>Holistic approach to health, beauty, and confidence.</p>
                    </div>
                </div>
                
                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#475569', maxWidth: '650px', margin: '0 auto 40px' }}>
                  Hi, I'm Yordanos! Though my background is in Civil Engineering, my true calling has always been the beauty industry. I've taken the structural discipline and perfectionism from my engineering practice and poured it directly into my artistry. As a dedicated beauty enthusiast, wellness advocate, and professional artist, I specialize in flawless makeup, stunning ombré designs, and holistic nail care. My goal is to empower every client who walks through Sona's doors to look breathtaking and feel incredibly confident inside and out.
                </p>
                <button onClick={() => setActiveStep('booking')} className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.1rem', borderRadius: '3rem' }}>
                  Book an Appointment <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Booking Form Content Render */}
          {activeStep === 'booking' && (
            <motion.div key="booking" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="container">
              <div className="booking-container">
                <button onClick={() => setActiveStep('home')} className="btn-back">
                  <ChevronLeft size={20} /> Go Back
                </button>
                <div className="form-card">
                  <h2 className="form-header">Confirm Booking</h2>
                  <p className="form-subtitle">Professional Nail Care Service</p>

                  <form onSubmit={handleBooking}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input required type="text" name="name" placeholder="Your name" value={bookingData.name} onChange={(e) => setBookingData(p => ({ ...p, name: e.target.value }))} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input required type="tel" name="phone" placeholder="09..." value={bookingData.phone} onChange={(e) => setBookingData(p => ({ ...p, phone: e.target.value }))} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Service</label>
                      <select required name="service" value={bookingData.service} onChange={(e) => setBookingData(p => ({ ...p, service: e.target.value }))} className="form-input" style={{ cursor: 'pointer' }}>
                        <option value="">Select Service...</option>
                        {services.map(s => <option key={s.id} value={s.name}>{s.name} - {s.price}</option>)}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input required type="date" name="date" value={bookingData.date} onChange={(e) => setBookingData(p => ({ ...p, date: e.target.value }))} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label>Time</label>
                        <input required type="time" name="time" value={bookingData.time} onChange={(e) => setBookingData(p => ({ ...p, time: e.target.value }))} className="form-input" />
                      </div>
                    </div>
                    <button disabled={isSubmitting || !isAuthReady} className="btn-primary btn-block btn-submit">
                      {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : <>Complete Booking <CheckCircle2 size={32} /></>}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Form Content */}
          {activeStep === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container">
              <div className="success-container">
                <div className="success-icon"><CheckCircle2 size={64} /></div>
                <h2 className="success-title">Success!</h2>
                <p className="success-desc">Your appointment is booked at our Zefmesh Mall location.</p>
                <button onClick={() => setActiveStep('home')} className="btn-primary" style={{ padding: '24px 64px', borderRadius: '3rem' }}>Back to Home</button>
              </div>
            </motion.div>
          )}

          {/* Admin Panel */}
          {activeStep === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="container">
              {!isAdminAuth ? (
                <div className="booking-container" style={{ maxWidth: '460px' }}>
                  <button onClick={() => setActiveStep('home')} className="btn-back"><ChevronLeft size={20} /> Go Back</button>
                  <div className="form-card" style={{ textAlign: 'center' }}>
                    <div className="modal-icon-lg icon-pink" style={{ background: '#FCE7F3', color: '#EC4899', margin: '0 auto 32px' }}><Lock size={40} /></div>
                    <h2 className="form-header" style={{ fontSize: '2rem' }}>Admin Access</h2>
                    <p className="form-subtitle">Sign in to manage appointments</p>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label>Full Name</label>
                      <input type="text" placeholder="Your name" value={adminName} onChange={(e) => { setAdminName(e.target.value); setAdminError(''); }} className="form-input" />
                    </div>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label>Password</label>
                      <input type="password" placeholder="Minimum 8 characters" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }} className="form-input" />
                    </div>
                    {adminError && <p style={{ color: '#DC2626', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px' }}>{adminError}</p>}
                    <button onClick={() => {
                      if (!adminName.trim()) { setAdminError('Please enter your name.'); return; }
                      if (adminPassword.length < 8) { setAdminError('Password must be at least 8 characters.'); return; }
                      if (adminPassword === 'sona2025') { setAdminProfile({ name: adminName.trim() }); setIsAdminAuth(true); setAdminError(''); }
                      else { setAdminError('Incorrect password.'); setAdminPassword(''); }
                    }} className="btn-primary btn-block" style={{ marginTop: '8px' }}>
                      Sign In <ChevronRight size={24} />
                    </button>
                    <p style={{ marginTop: '24px', fontSize: '0.7rem', color: '#9CA3AF' }}>Default password: sona2025</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
                    <div>
                      <button onClick={() => { setActiveStep('home'); setIsAdminAuth(false); setAdminPassword(''); setAdminName(''); setAdminProfile(null); }} className="btn-back" style={{ marginBottom: '16px' }}><ChevronLeft size={20} /> Exit Admin</button>
                      <h2 className="form-header" style={{ fontSize: '2.5rem' }}>Welcome, {adminProfile?.name || 'Admin'}</h2>
                      <p className="form-subtitle" style={{ marginBottom: 0 }}>Manage and track all bookings</p>
                    </div>
                  </div>

                  {/* Services Management */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    <button
                      onClick={() => setServicesOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Scissors size={18} color="#A78BFA" />
                        <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0 }}>Manage Services</h3>
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: servicesOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {services.map(s => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>[{s.category || 'Other'}] {s.name}</div>
                                    <input 
                                      type="text" 
                                      value={s.description || ''} 
                                      placeholder="Service Description..."
                                      onChange={(e) => {
                                        const upd = services.map(srv => srv.id === s.id ? { ...srv, description: e.target.value } : srv);
                                        setServices(upd);
                                        saveServicesToFirestore(upd);
                                      }}
                                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', padding: '6px 10px', borderRadius: '4px', fontSize: '0.85rem', width: '100%', margin: 0, outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <input 
                                        type="text" 
                                        value={s.price} 
                                        onChange={(e) => {
                                          const upd = services.map(srv => srv.id === s.id ? { ...srv, price: e.target.value } : srv);
                                          setServices(upd);
                                          saveServicesToFirestore(upd);
                                        }}
                                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#A78BFA', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', width: '100px', margin: 0 }}
                                      />
                                      <span style={{ fontSize: '0.8rem', color: '#888' }}>&bull; {s.duration}</span>
                                    </div>
                                  </div>
                                  <button onClick={() => handleDeleteService(s.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px', zIndex: 10 }}><Trash2 size={18} /></button>
                                </div>
                              ))}
                            </div>
                            
                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', alignItems: 'end' }}>
                              <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="form-input" style={{ margin: 0 }} />
                              <input type="text" placeholder="Price (e.g., 500 ETB)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="form-input" style={{ margin: 0 }} />
                              <input type="text" placeholder="Duration (e.g., 45 min)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} className="form-input" style={{ margin: 0 }} />
                              <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="form-input" style={{ margin: 0 }} />
                              <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} className="form-input" style={{ margin: 0 }}>
                                <option value="Nails">Nails</option>
                                <option value="Hair">Hair</option>
                                <option value="Makeup">Makeup</option>
                              </select>
                              <select value={newService.iconName} onChange={(e) => setNewService({ ...newService, iconName: e.target.value })} className="form-input" style={{ margin: 0 }}>
                                <option value="Sparkles">Sparkles Icon</option>
                                <option value="Scissors">Scissors Icon</option>
                                <option value="Star">Star Icon</option>
                                <option value="Heart">Heart Icon</option>
                                <option value="Flower">Flower Icon</option>
                              </select>
                              <select value={newService.tag} onChange={(e) => setNewService({ ...newService, tag: e.target.value })} className="form-input" style={{ margin: 0 }}>
                                <option value="">No Badge</option>
                                <option value="Popular">Popular</option>
                                <option value="New">New</option>
                                <option value="Hot">Hot</option>
                                <option value="Best">Best</option>
                                <option value="Relax">Relax</option>
                              </select>
                              <button onClick={handleAddService} className="btn-primary" style={{ padding: '14px', width: '100%' }}><Plus size={20} /> Add</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Promo Banner Management */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    <button
                      onClick={() => setPromoOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} color="#FBBF24" />
                        <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0 }}>Active Promotion</h3>
                        {promo.active && <span style={{ marginLeft: '12px', background: 'rgba(251,191,36,0.15)', color: '#FCD34D', padding: '4px 10px', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: 800 }}>{promo.percent}% OFF LIVE</span>}
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: promoOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>
                    <AnimatePresence>
                      {promoOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 28px 24px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>Set a flash sale discount percentage. The badge will appear on the homepage and CTA card.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '350px' }}>
                              <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 'bold' }}>%</span>
                                <input 
                                  type="number" 
                                  placeholder="0" 
                                  value={promo.percent}
                                  onChange={(e) => setPromo({ ...promo, percent: e.target.value })}
                                  disabled={promo.active}
                                  className="form-input" 
                                  style={{ width: '140px', paddingLeft: '36px', fontSize: '1.2rem', margin: 0 }}
                                />
                              </div>
                              {promo.active ? (
                                <button onClick={() => setPromo({ ...promo, active: false })} className="btn-secondary" style={{ flex: 1, backgroundColor: '#EF4444', color: 'white', border: 'none' }}>Stop Promo</button>
                              ) : (
                                <button onClick={() => { if(promo.percent > 0) setPromo({ ...promo, active: true })}} className="btn-primary" style={{ flex: 1, padding: '16px' }}>Run Promo</button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Gallery Management */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    <button
                      onClick={() => setGalleryOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Play size={18} color="#EC4899" />
                        <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0 }}>Gallery Management</h3>
                        <span style={{ marginLeft: '12px', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{heroImages.length + artistryImages.length} images live</span>
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: galleryOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>

                    <AnimatePresence>
                      {galleryOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ borderTop: '1px solid #334155' }}>
                            {/* Hero Slides */}
                            <div style={{ padding: '24px 28px', borderBottom: '1px solid #334155' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                <p style={{ color: '#F8FAFC', fontWeight: 700, margin: 0 }}>📸 Hero Slides <span style={{ color: '#64748B', fontWeight: 400, fontSize: '0.8rem' }}>({heroImages.length}/5) — Portrait photos work best (4:5 ratio)</span></p>
                                <button onClick={() => handleGalleryRestoreDefaults('hero')} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Restore Defaults</button>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {heroImages.map((url, i) => (
                                  <div key={i} className="gallery-thumb">
                                    <img src={url} alt={`hero-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button className="gallery-thumb-delete" onClick={() => handleGalleryDelete(i, 'hero')}><X size={12} /></button>
                                  </div>
                                ))}
                                {heroImages.length < 5 && (
                                  <label className="gallery-upload-tile">
                                    {galleryUploading.hero ? <Loader2 size={24} className="spin" /> : <><span style={{ fontSize: '1.8rem', lineHeight: 1 }}>+</span><span style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>Upload</span></>}
                                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleGalleryUpload(e.target.files, 'hero')} />
                                  </label>
                                )}
                              </div>
                              {galleryUploadProgress.hero.length > 0 && (
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {galleryUploadProgress.hero.map((p, i) => (
                                    <span key={i} style={{ fontSize: '0.7rem', color: p.done ? '#10B981' : '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      {p.done ? <Check size={12} /> : <Loader2 size={12} className="spin" />} {p.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Artistry Gallery */}
                            <div style={{ padding: '24px 28px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                <p style={{ color: '#F8FAFC', fontWeight: 700, margin: 0 }}>🎨 Our Artistry <span style={{ color: '#64748B', fontWeight: 400, fontSize: '0.8rem' }}>({artistryImages.length}/6) — Mix of portrait and landscape looks great</span></p>
                                <button onClick={() => handleGalleryRestoreDefaults('artistry')} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Restore Defaults</button>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {artistryImages.map((item, i) => (
                                  <div key={i} className="gallery-thumb">
                                    <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button className="gallery-thumb-delete" onClick={() => handleGalleryDelete(i, 'artistry')}><X size={12} /></button>
                                  </div>
                                ))}
                                {artistryImages.length < 6 && (
                                  <label className="gallery-upload-tile">
                                    {galleryUploading.artistry ? <Loader2 size={24} className="spin" /> : <><span style={{ fontSize: '1.8rem', lineHeight: 1 }}>+</span><span style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>Upload</span></>}
                                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleGalleryUpload(e.target.files, 'artistry')} />
                                  </label>
                                )}
                              </div>
                              {galleryUploadProgress.artistry.length > 0 && (
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {galleryUploadProgress.artistry.map((p, i) => (
                                    <span key={i} style={{ fontSize: '0.7rem', color: p.done ? '#10B981' : '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      {p.done ? <Check size={12} /> : <Loader2 size={12} className="spin" />} {p.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Admin Stats + Collapsible Appointments */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    {/* Header - always visible clickable summary */}
                    <button
                      onClick={() => setAppointmentsOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'fit-content' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Calendar size={20} color="#A78BFA" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', margin: 0, fontWeight: 800 }}>Appointments</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '32px' }}>
                        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Total</p><p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC', margin: 0, lineHeight: 1 }}>{appointments.length}</p></div>
                        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Pending</p><p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B', margin: 0, lineHeight: 1 }}>{appointments.filter(a => a.status === 'pending').length}</p></div>
                        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Confirmed</p><p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', margin: 0, lineHeight: 1 }}>{appointments.filter(a => a.status === 'confirmed').length}</p></div>
                        <div style={{ textAlign: 'left' }}><p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Completed</p><p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8B5CF6', margin: 0, lineHeight: 1 }}>{appointments.filter(a => a.status === 'completed').length}</p></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC4899', fontWeight: 700, fontSize: '0.8rem' }}>
                        {appointmentsOpen ? 'Hide' : 'View All'}
                        <ChevronRight size={18} style={{ transform: appointmentsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                      </div>
                    </button>

                    {/* Collapsible appointments list */}
                    <AnimatePresence>
                      {appointmentsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 28px 24px', borderTop: '1px solid #334155' }}>
                            {/* Filters */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0', alignItems: 'center' }}>
                              <div style={{ flex: 1, minWidth: '160px', position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                <input type="text" placeholder="Search..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} className="form-input" style={{ paddingLeft: '40px', borderRadius: '0.75rem', padding: '12px 12px 12px 40px', fontSize: '0.85rem' }} />
                              </div>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                                  <button key={f} onClick={() => setAdminFilter(f)} className={adminFilter === f ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 14px', borderRadius: '0.75rem', fontSize: '0.7rem', textTransform: 'capitalize' }}>{f}</button>
                                ))}
                              </div>
                            </div>
                            {/* Cards */}
                            <div style={{ display: 'grid', gap: '16px' }}>
                              {filteredAppointments.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 24px', color: '#9CA3AF' }}>
                                  <Search size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                  <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>No appointments found</p>
                                </div>
                              )}
                              {filteredAppointments.map((apt, i) => (
                                <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                  style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '20px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '160px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>{apt.name.charAt(0)}</div>
                                    <div>
                                      <h4 style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: '2px', color: '#F8FAFC' }}>{apt.name}</h4>
                                      <p style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700 }}>{apt.phone}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px' }}>Service</p><p style={{ fontWeight: 900, fontSize: '0.8rem', color: '#F8FAFC' }}>{apt.service}</p></div>
                                    <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px' }}>Date</p><p style={{ fontWeight: 900, fontSize: '0.8rem', color: '#F8FAFC' }}>{apt.date}</p></div>
                                    <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px' }}>Time</p><p style={{ fontWeight: 900, fontSize: '0.8rem', color: '#F8FAFC' }}>{apt.time}</p></div>
                                    <span style={{ padding: '6px 14px', borderRadius: '9999px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', background: apt.status === 'pending' ? '#FEF3C7' : apt.status === 'confirmed' ? '#D1FAE5' : apt.status === 'completed' ? '#EDE9FE' : '#FEE2E2', color: apt.status === 'pending' ? '#D97706' : apt.status === 'confirmed' ? '#059669' : apt.status === 'completed' ? '#7C3AED' : '#DC2626' }}>{apt.status}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    {apt.status === 'pending' && <button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')} title="Confirm" style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>}
                                    {apt.status === 'confirmed' && <button onClick={() => updateAppointmentStatus(apt.id, 'completed')} title="Complete" style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={16} /></button>}
                                    {apt.status !== 'cancelled' && apt.status !== 'completed' && <button onClick={() => updateAppointmentStatus(apt.id, 'cancelled')} title="Cancel" style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={16} /></button>}
                                    <button onClick={() => deleteAppointment(apt.id)} title="Delete" style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#1E293B', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Store Status Override Card */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: `1px solid ${storeStatus.isOpen ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`, overflow: 'hidden' }}>
                    <button
                      onClick={() => setStoreStatusOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Live status dot */}
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: storeStatus.isOpen ? '#10B981' : '#EF4444', boxShadow: storeStatus.isOpen ? '0 0 8px #10B981' : '0 0 8px #EF4444', flexShrink: 0 }} />
                        <div style={{ textAlign: 'left' }}>
                          <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: 0 }}>Store Status</h3>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                            Currently: <span style={{ color: storeStatus.isOpen ? '#10B981' : '#EF4444', fontWeight: 800 }}>{storeStatus.isOpen ? 'OPEN' : 'CLOSED'}</span>
                            {storeOverride && <span style={{ marginLeft: '8px', color: '#FBBF24', fontSize: '0.65rem' }}>(Admin Override Active)</span>}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: storeStatusOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>

                    <AnimatePresence>
                      {storeStatusOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 28px 24px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', fontWeight: 600 }}>Override the schedule — useful for emergencies or early closings.</p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {/* Auto */}
                              <button
                                onClick={() => setStoreOverride(null)}
                                style={{ flex: 1, minWidth: '120px', padding: '14px 20px', borderRadius: '1rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', border: '2px solid', transition: 'all 0.2s ease',
                                  borderColor: storeOverride === null ? '#8B5CF6' : '#334155',
                                  background: storeOverride === null ? 'rgba(139,92,246,0.15)' : 'transparent',
                                  color: storeOverride === null ? '#A78BFA' : '#64748B'
                                }}
                              >
                                ⏱ Auto Schedule
                              </button>
                              {/* Force Open */}
                              <button
                                onClick={() => setStoreOverride('open')}
                                style={{ flex: 1, minWidth: '120px', padding: '14px 20px', borderRadius: '1rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', border: '2px solid', transition: 'all 0.2s ease',
                                  borderColor: storeOverride === 'open' ? '#10B981' : '#334155',
                                  background: storeOverride === 'open' ? 'rgba(16,185,129,0.15)' : 'transparent',
                                  color: storeOverride === 'open' ? '#34D399' : '#64748B'
                                }}
                              >
                                🟢 Force Open
                              </button>
                              {/* Force Closed */}
                              <button
                                onClick={() => setStoreOverride('closed')}
                                style={{ flex: 1, minWidth: '120px', padding: '14px 20px', borderRadius: '1rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', border: '2px solid', transition: 'all 0.2s ease',
                                  borderColor: storeOverride === 'closed' ? '#EF4444' : '#334155',
                                  background: storeOverride === 'closed' ? 'rgba(239,68,68,0.15)' : 'transparent',
                                  color: storeOverride === 'closed' ? '#F87171' : '#64748B'
                                }}
                              >
                                🔴 Force Closed
                              </button>
                            </div>
                            {storeOverride === 'closed' && (
                              <p style={{ marginTop: '12px', fontSize: '0.7rem', color: '#F87171', background: 'rgba(239,68,68,0.08)', padding: '8px 14px', borderRadius: '0.5rem', fontWeight: 600 }}>
                                ⚠ The store is shown as Closed to all visitors. Customers will see the booking nudge.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Opening Hours Admin Card */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    <button
                      onClick={() => setHoursOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={18} color="#FBBF24" />
                        <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: 0 }}>Opening Hours</h3>
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: hoursOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>

                    <AnimatePresence>
                      {hoursOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 28px 24px', display: 'grid', gap: '12px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            {openingHours.map((h, i) => (
                              <div key={h.day} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{ width: '100px', fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', flexShrink: 0 }}>{h.day}</span>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748B', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={h.closed} onChange={e => setOpeningHours(prev => prev.map((x, j) => j === i ? { ...x, closed: e.target.checked } : x))} />
                                  Closed
                                </label>
                                {!h.closed && (
                                  <>
                                    <input type="time" value={h.open} onChange={e => setOpeningHours(prev => prev.map((x, j) => j === i ? { ...x, open: e.target.value } : x))} style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                                    <span style={{ color: '#64748B', fontSize: '0.8rem' }}>—</span>
                                    <input type="time" value={h.close} onChange={e => setOpeningHours(prev => prev.map((x, j) => j === i ? { ...x, close: e.target.value } : x))} style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: '#F8FAFC', fontSize: '0.8rem' }} />
                                  </>
                                )}
                                {h.closed && <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>Closed</span>}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Social Media Links Admin Card */}
                  <div style={{ backgroundColor: '#1E293B', borderRadius: '1.5rem', marginBottom: '32px', border: '1px solid #334155', overflow: 'hidden' }}>
                    <button
                      onClick={() => setSocialsOpen(o => !o)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={18} color="#EC4899" />
                        <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: 0 }}>Social Media Links</h3>
                      </div>
                      <ChevronRight size={18} style={{ color: '#EC4899', transform: socialsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>

                    <AnimatePresence>
                      {socialsOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 28px 24px', display: 'grid', gap: '16px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Instagram size={20} style={{ color: '#EC4899', flexShrink: 0 }} />
                              <input type="url" placeholder="https://instagram.com/yourpage" value={socialLinks.instagram} onChange={e => setSocialLinks(s => ({ ...s, instagram: e.target.value }))} className="form-input" style={{ borderRadius: '0.75rem', padding: '12px 16px', fontSize: '0.85rem', margin: 0 }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <TikTok size={20} style={{ color: '#F8FAFC', flexShrink: 0 }} />
                              <input type="url" placeholder="https://tiktok.com/@yourpage" value={socialLinks.tiktok} onChange={e => setSocialLinks(s => ({ ...s, tiktok: e.target.value }))} className="form-input" style={{ borderRadius: '0.75rem', padding: '12px 16px', fontSize: '0.85rem', margin: 0 }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Phone size={20} style={{ color: '#10B981', flexShrink: 0 }} />
                              <input type="tel" placeholder="+251 9XX XXX XXXX" value={socialLinks.phone} onChange={e => setSocialLinks(s => ({ ...s, phone: e.target.value }))} className="form-input" style={{ borderRadius: '0.75rem', padding: '12px 16px', fontSize: '0.85rem', margin: 0 }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Service Modal with Framer Shared Layout */}
        <AnimatePresence>
          {selectedService && (
            <div className="modal-overlay">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="modal-backdrop"
                onClick={() => setSelectedService(null)}
              ></motion.div>
              <motion.div
                layoutId={`service-card-${selectedService.id}`}
                className="modal-content"
                initial={{ borderRadius: "2rem" }} animate={{ borderRadius: "4rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <button onClick={() => setSelectedService(null)} className="btn-close"><X size={24} /></button>
                <motion.div layoutId={`service-icon-${selectedService.id}`} className={`modal-icon-lg ${selectedService.colorClass}`}>
                  {React.cloneElement(selectedService.icon, { size: 48 })}
                </motion.div>
                <motion.h3 layoutId={`service-title-${selectedService.id}`} className="modal-title">{selectedService.name}</motion.h3>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="modal-badges">
                    <span className="badge-primary">
                      {(() => {
                        const basePriceMatch = selectedService.price.match(/\d+/);
                        const basePrice = basePriceMatch ? parseInt(basePriceMatch[0], 10) : 0;
                        const hasPromo = promo?.active && basePrice > 0 && promo?.percent > 0;
                        const discountedPrice = hasPromo ? Math.round(basePrice * (1 - promo.percent / 100)) : basePrice;
                        return hasPromo ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.7, marginRight: '6px', fontSize: '0.9em' }}>{selectedService.price}</span>
                            {discountedPrice} ETB
                          </>
                        ) : selectedService.price;
                      })()}
                    </span>
                    <span className="badge-outline"><Clock size={20} /> {selectedService.duration}</span>
                  </div>
                  <p className="modal-desc">{selectedService.description}</p>
                  <button
                    onClick={() => { setBookingData(prev => ({ ...prev, service: selectedService.name })); setSelectedService(null); setActiveStep('booking'); }}
                    className="btn-primary btn-block"
                  >
                    Book Now <ChevronRight size={28} />
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Location Modal */}
        {showLocation && (
          <div className="modal-overlay">
            <div className="modal-backdrop" onClick={() => setShowLocation(false)}></div>
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <div className="modal-icon-lg icon-pink" style={{ background: '#FCE7F3', color: '#EC4899' }}><MapPin size={48} /></div>
              <h3 className="modal-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our Location</h3>
              <p className="modal-desc" style={{ marginBottom: '40px', fontSize: '1.25rem' }}>Jacross<br />Addis Ababa, Ethiopia</p>
              <button onClick={() => setShowLocation(false)} className="btn-primary btn-block">Close</button>
            </div>
          </div>
        )}

        {/* Global Floating Promo Banner */}
        <AnimatePresence>
          {promo.active && !promo.dismissed && activeStep === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                border: '1px solid #FBBF24',
                borderRadius: '1.25rem',
                padding: '24px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(251, 191, 36, 0.15)',
                width: 'calc(100% - 48px)',
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <button 
                onClick={() => setPromo(p => ({ ...p, dismissed: true }))}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#FCE7F3', borderRadius: '50%', padding: '12px', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={28} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>Flash Sale! 🔥</h4>
                  <p style={{ margin: 0, color: '#FBBF24', fontSize: '0.95rem', fontWeight: 600 }}>{promo.percent}% OFF all bookings</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveStep('booking'); window.scrollTo(0,0); }} 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', borderRadius: '1rem', fontSize: '1.05rem', margin: 0 }}
              >
                Claim Offer Now <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="logo-container" onClick={() => setActiveStep('home')}>
            <SonaLogo className="h-20" />
          </div>
          <div className="footer-nav">
            <a onClick={() => setActiveStep('home')}>Services</a>
            <a onClick={() => setActiveStep('about')}>About</a>
            <a onClick={() => setShowLocation(true)}>Location</a>
            <a onClick={() => setActiveStep('booking')}>Book Now</a>
            <a onClick={() => setActiveStep('admin')} style={{ opacity: 0.4, fontSize: '0.75rem' }}>Admin</a>
          </div>
          <div className="footer-hours">
            Mon-Sat: 9AM - 8PM &nbsp;|&nbsp; Sun: 10AM - 6PM
          </div>
          <div className="footer-social">
            {socialLinks.instagram ? <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="btn-social"><Instagram size={24} /></a> : <button className="btn-social" title="Set Instagram in Admin"><Instagram size={24} /></button>}
            {socialLinks.tiktok ? <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="btn-social"><TikTok size={24} /></a> : <button className="btn-social" title="Set TikTok in Admin"><TikTok size={24} /></button>}
            <button onClick={() => setShowLocation(true)} className="btn-social"><MapPin size={24} /></button>
            {socialLinks.phone ? <a href={`tel:${socialLinks.phone}`} className="btn-social"><Phone size={24} /></a> : <button className="btn-social"><Phone size={24} /></button>}
          </div>
          <div>
            <div className="footer-badge">
              <p>JACROSS • ADDIS ABABA</p>
            </div>
            <p className="footer-copy">&copy; 2026 / ET 2018 SONA SALON. ALL RIGHTS RESERVED.</p>
            <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Made with 
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Heart size={14} fill="#EC4899" color="#EC4899" />
              </motion.div> 
              by AS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
