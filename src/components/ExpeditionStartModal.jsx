import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpeditionStartModal({ planet, microbes, onClose, onStart }) {
  if (!planet) return null;

  const requiredName = planet.requiredMicrobe;
  const planetIndex = planet.id - 1;
  const col = planetIndex % 4;
  const row = Math.floor(planetIndex / 4);
  const iconStyle = {
    backgroundImage: `url('/images/icons_spritesheet.webp')`,
    backgroundPosition: `-${col * 32}px -${row * 32}px`,
    width: '32px',
    height: '32px',
    display: 'inline-block',
    transform: 'scale(1.5)',
    transformOrigin: 'center'
  };
  const availableMicrobe = microbes.find(m => m.name === requiredName && m.state !== 'expedition');
  const hasMicrobe = !!availableMicrobe;

  return (
    <div className="fixed top-0 left-0 w-screen h-[100dvh] z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md wood-modal overflow-hidden flex flex-col"
      >
        <div className="p-4 wood-panel-dark border-t-0 border-l-0 border-r-0 border-b-4 flex justify-between items-center rounded-none">
          <h2 className="text-xl font-bold text-[#343a40] flex items-center gap-2">
            <div style={iconStyle} className="mr-2"></div> {planet.name} 탐사
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center pixel-btn-orange text-white cursor-pointer font-bold leading-none p-0"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-6 wood-panel border-0 rounded-none">
          <div className="w-24 h-24 rounded-full border-4 border-[#ced4da] bg-white flex items-center justify-center shadow-inner text-5xl">
            <div style={{ ...iconStyle, transform: 'scale(2.5)' }}></div>
          </div>

          <div className="w-full bg-white p-4 rounded-xl border-4 border-[#dee2e6] text-center shadow-inner">
            <h3 className="text-sm font-bold text-[#868e96] mb-2 font-pixel">필요한 미생물</h3>
            <p className="text-xl font-bold text-[#495057]">
              {requiredName} {hasMicrobe ? '✅' : '❌'}
            </p>
            {!hasMicrobe && (
              <p className="mt-2 text-sm text-[#e63946] font-bold">
                배양조에 휴식 중인 '{requiredName}'(이)가 필요합니다!
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (hasMicrobe) onStart(planet.id, availableMicrobe.id);
            }}
            className={`w-full py-4 text-xl font-bold transition-all ${
              hasMicrobe 
                ? 'pixel-btn-green cursor-pointer' 
                : 'pixel-btn-gray cursor-not-allowed opacity-80'
            }`}
          >
            {hasMicrobe ? '탐사 출발!' : '조건 미달'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
