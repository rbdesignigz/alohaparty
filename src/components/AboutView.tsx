import React from 'react';
import { Sparkles, Heart, Scissors, Smile } from 'lucide-react';

interface AboutViewProps {
  setActiveScreen: (screen: 'store' | 'admin' | 'checkout' | 'login') => void;
}

export default function AboutView({ setActiveScreen }: AboutViewProps) {
  return (
    <div id="about-us-view" className="w-full max-w-4xl mx-auto px-6 py-12 text-left animate-fade-in flex flex-col gap-10">
      
      {/* Intro section */}
      <section className="flex flex-col gap-3 text-center md:text-left">
        <span className="text-xs font-bold text-[#93474d] uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
          <Sparkles className="w-4 h-4" />
          Nuestra Historia
        </span>
        <h2 className="text-3xl font-sans font-extrabold text-[#1b1c1c] tracking-tight">Sobre Aloha Party</h2>
        <p className="text-sm text-[#867273] font-semibold">Papelería Creativa con Corazón y Alma.</p>
        <div className="w-16 h-1 bg-[#4d6543] rounded-full mx-auto md:mx-0 mt-2"></div>
      </section>

      {/* Narrative grid with visuals */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#534343] leading-relaxed">
            En **Aloha Party**, creemos que las mejores celebraciones son aquellas que reflejan tu propia personalidad y amor por los detalles. Lo que comenzó como un pasatiempo de recortar diseños en la mesa del comedor, se ha transformado en un taller especializado en crear papelería creativa para los momentos más dulces e inolvidables.
          </p>
          <p className="text-xs text-[#534343] leading-relaxed">
            Todos nuestros toppers, guirnaldas, piñatas y recuerdos están diseñados digitalmente con precisión y ensamblados a mano de forma artesanal. Buscamos las mejores cartulinas texturizadas de alto gramaje, papeles libres de ácido y detalles metálicos premium (como folios dorados) para asegurar que cada pieza sea digna de conservarse como un recuerdo.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square bg-[#efeded] border border-[#867273]/20 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
            alt="Aloha Party Workshop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Key core pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#867273]/15">
        
        {/* Pillar 1: Hecho a Mano */}
        <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs text-center flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#93474d]/10 text-[#93474d] flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </span>
          <h4 className="text-xs font-bold text-[#1b1c1c]">Diseño Artesanal</h4>
          <p className="text-[11px] text-[#867273] leading-relaxed">
            Cortado, plegado y encolado con extremo cuidado para lograr relieves y texturas inigualables.
          </p>
        </div>

        {/* Pillar 2: Amor */}
        <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs text-center flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#4d6543]/10 text-[#4d6543] flex items-center justify-center">
            <Heart className="w-5 h-5 animate-pulse" />
          </span>
          <h4 className="text-xs font-bold text-[#1b1c1c]">Hecho con Amor</h4>
          <p className="text-[11px] text-[#867273] leading-relaxed">
            Inyectamos alegría y pasión en cada pedido para que tu fiesta brille con su propia magia única.
          </p>
        </div>

        {/* Pillar 3: Sonrisas */}
        <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs text-center flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#cce8bd] text-[#364d2d] flex items-center justify-center">
            <Smile className="w-5 h-5" />
          </span>
          <h4 className="text-xs font-bold text-[#1b1c1c]">Momento Inolvidable</h4>
          <p className="text-[11px] text-[#867273] leading-relaxed">
            Nuestros productos están pensados para captar miradas y dejar recuerdos preciosos en tus invitados.
          </p>
        </div>
      </section>

      {/* CTA back to store */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setActiveScreen('store')}
          className="px-8 py-3 bg-[#93474d] hover:bg-[#712d34] text-white rounded-full font-sans font-bold text-xs shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          Volver a la Tienda y Comprar
        </button>
      </div>
    </div>
  );
}
