import React from 'react';
import { ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HomeViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function HomeView({ setActiveScreen }: HomeViewProps) {
  return (
    <div id="home-view" className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full bg-[#f4949a] relative overflow-hidden px-6 md:px-12 py-16 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Animated Tropical Leaves */}
        <div className="absolute -top-10 -left-10 text-[#8da77b] opacity-40 animate-[spin_12s_linear_infinite]">
          <Leaf className="w-40 h-40" />
        </div>
        <div className="absolute -bottom-16 right-10 text-[#8da77b] opacity-50 animate-[bounce_5s_ease-in-out_infinite]">
          <Leaf className="w-48 h-48 rotate-45" />
        </div>
        <div className="absolute top-1/4 right-1/3 text-[#8da77b] opacity-30 animate-[pulse_4s_ease-in-out_infinite]">
          <Leaf className="w-20 h-20 -rotate-90" />
        </div>
        <div className="absolute top-1/2 left-1/3 text-[#8da77b] opacity-20 animate-[bounce_6s_ease-in-out_infinite]">
          <Sparkles className="w-12 h-12" />
        </div>

        <div className="flex-1 space-y-6 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold border border-white/30 shadow-sm uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-white" />
            Papelería Creativa
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-sm">
            Detalles únicos para <br />
            momentos <span className="text-[#8da77b] bg-white px-2 rounded-2xl inline-block -rotate-2 transform hover:rotate-0 transition-transform">inolvidables</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
            ¡Dale vida a tus fiestas! Creamos toppers, piñatas personalizadas, banderines y papelería con amor, full color y mucho diseño tropical.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <button
              onClick={() => setActiveScreen('store')}
              className="flex items-center gap-2 bg-[#8da77b] hover:bg-[#7a936a] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-base group"
            >
              Ir a la Tienda <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveScreen('about')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold transition-all text-base"
            >
              Conócenos
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg relative z-10">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/hero.png" 
              alt="Aloha Party Designs" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4949a]/40 to-transparent mix-blend-overlay pointer-events-none"></div>
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
      <section className="w-full bg-white px-6 md:px-12 py-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#f4949a]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 text-[#8da77b] opacity-20">
           <Leaf className="w-32 h-32 -rotate-45" />
        </div>
        
        <div className="flex-1 flex justify-center z-10">
          <div className="w-[80%] max-w-[400px] aspect-square rounded-[3rem] overflow-hidden shadow-xl border-8 border-[#f4949a]/20 transform -rotate-3">
            <img src="/history.png" alt="Nuestra Historia" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex-1 space-y-6 z-10">
          <p className="text-[#8da77b] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> NUESTRA HISTORIA
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#f4949a] leading-tight tracking-tight">
            Pasión por el detalle en cada fiesta.
          </h2>
          <div className="space-y-4 text-[#867273] text-lg leading-relaxed font-medium">
            <p>
              En <strong>Aloha Party</strong> creemos que las celebraciones merecen ser tan únicas y divertidas como las personas que las festejan. Nuestra Papelería Creativa nace del amor por el color, el diseño tropical y las ganas de festejar a lo grande.
            </p>
            <p>
              Cada topper, cada banderín y cada piñata es diseñada con un espíritu juvenil, relajado y lleno de buena vibra. ¡Queremos que tus fotos queden increíbles y tus invitados se enamoren de cada detalle!
            </p>
          </div>
          <button 
            onClick={() => setActiveScreen('about')}
            className="flex items-center gap-2 text-white bg-[#f4949a] hover:bg-[#e3858b] px-6 py-3 rounded-full font-bold transition-all shadow-md mt-4 hover:-translate-y-1"
          >
            <Heart className="w-4 h-4" /> Conoce al equipo
          </button>
        </div>
      </section>
    </div>
  );
}
