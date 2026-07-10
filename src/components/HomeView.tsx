import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HomeViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function HomeView({ setActiveScreen }: HomeViewProps) {
  return (
    <div id="home-view" className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full bg-[#fbf9f8] px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d8eed4] text-[#4d6543] rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-[#4d6543] rounded-full"></span>
            Papelería Creativa & Diseño
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1b1c1c] leading-tight tracking-tight">
            Detalles únicos para momentos <span className="text-[#93474d]">inolvidables</span>.
          </h1>
          <p className="text-[#867273] text-sm md:text-base max-w-md leading-relaxed">
            Especialistas en decoración artesanal para tus celebraciones. Creamos toppers, piñatas personalizadas, banderines y papelería con amor y dedicación.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={() => setActiveScreen('store')}
              className="flex items-center gap-2 bg-[#f0a8ae] hover:bg-[#eb969d] text-[#1b1c1c] px-6 py-3 rounded-full font-semibold transition-colors text-sm"
            >
              Ir a la Tienda <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveScreen('store')}
              className="border border-[#867273]/30 hover:border-[#93474d] text-[#1b1c1c] px-6 py-3 rounded-full font-semibold transition-colors text-sm"
            >
              Ver Galería
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg relative">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
            <img 
              src="/hero.png" 
              alt="Herramientas de Papelería y Diseño" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Descubre Nuestra Magia Section */}
      <section className="w-full bg-white px-6 md:px-12 py-20 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold text-[#93474d]">Descubre nuestra magia</h2>
            <p className="text-[#867273] text-sm mt-2">Papelería creativa hecha a mano para cada ocasión especial.</p>
          </div>
          <button 
            onClick={() => setActiveScreen('store')}
            className="text-xs font-semibold text-[#867273] hover:text-[#93474d] flex items-center gap-1"
          >
            Ver todo el catálogo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] md:h-[500px]">
          {/* Main big item */}
          <div 
            className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
            onClick={() => setActiveScreen('store')}
          >
            <img src="/topper.png" alt="Toppers Personalizados" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <span className="bg-[#f0a8ae] text-[#1b1c1c] text-[10px] font-bold px-2 py-1 rounded w-fit mb-3">Más vendido</span>
              <h3 className="text-2xl font-bold">Toppers Personalizados</h3>
              <p className="text-white/80 text-sm mt-1">El toque final perfecto para tu pastel.</p>
            </div>
          </div>
          
          {/* Two small items stack */}
          <div className="flex flex-col gap-6">
            <div 
              className="flex-1 relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
              onClick={() => setActiveScreen('store')}
            >
              <img src="/pinata.png" alt="Piñatas Mini" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold">Piñatas Mini</h3>
                <p className="text-white/80 text-xs mt-1">Diversión en formato pequeño.</p>
              </div>
            </div>
            
            <div 
              className="flex-1 relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
              onClick={() => setActiveScreen('store')}
            >
              <img src="/banner.png" alt="Banderines & Invites" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold">Banderines & Invites</h3>
                <p className="text-white/80 text-xs mt-1">Arma el kit completo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia Section */}
      <section className="w-full bg-[#fbf9f8] px-6 md:px-12 py-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        {/* Decorative blur circle */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#f0a8ae]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 flex justify-center z-10">
          <div className="w-[80%] max-w-[400px] aspect-square rounded-full overflow-hidden shadow-xl border-8 border-white">
            <img src="/history.png" alt="Nuestra Historia" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex-1 space-y-6 z-10">
          <p className="text-[#4d6543] font-bold text-xs tracking-widest uppercase">NUESTRA HISTORIA</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1b1c1c] leading-tight">
            Pasión por el detalle en cada doblez.
          </h2>
          <div className="space-y-4 text-[#867273] text-sm leading-relaxed">
            <p>
              En Aloha Party creemos que las celebraciones merecen ser tan únicas como las personas que las festejan. Nuestra <strong>Papelería Creativa</strong> nace del amor por el diseño, el papel de alta calidad y el trabajo artesanal meticuloso.
            </p>
            <p>
              Cada topper, cada banderín y cada piñata es concebida como una pequeña obra de arte, diseñada a medida para aportar calidez, alegría y estilo a tus eventos. No hacemos productos en serie; creamos recuerdos palpables.
            </p>
          </div>
          <button 
            onClick={() => setActiveScreen('about')}
            className="flex items-center gap-2 text-[#93474d] font-semibold text-sm hover:text-[#712d34] transition-colors pt-4"
          >
            <Heart className="w-4 h-4" /> Conoce al equipo
          </button>
        </div>
      </section>
    </div>
  );
}
