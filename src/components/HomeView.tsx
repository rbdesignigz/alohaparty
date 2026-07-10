import React from 'react';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HomeViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export default function HomeView({ setActiveScreen }: HomeViewProps) {
  return (
    <div id="home-view" className="flex flex-col w-full">
      {/* Boho Hero Section */}
      <section className="w-full relative overflow-hidden px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8da77b]/5 rounded-bl-[100px] -z-10"></div>
        <div className="absolute left-2 md:left-6 top-20 text-[#f4949a] opacity-10">
          <img src="/hoja.png" alt="Hoja" className="w-64 h-64 -rotate-45" />
        </div>

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start z-10 w-full pt-8 md:pt-0">
          <h1 className="flex flex-col relative w-full mb-6">
            <span className="font-serif font-extrabold text-[#f4949a] text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight">
              Diseñamos
            </span>
            <span className="font-script text-[#f4949a] text-5xl md:text-7xl lg:text-8xl -mt-4 md:-mt-8 ml-4 md:ml-12 transform -rotate-2 relative z-10">
              momentos únicos
            </span>
            {/* Hand-drawn heart accent */}
            <div className="absolute top-0 md:-top-10 right-10 md:right-32 text-[#f4949a] opacity-60">
              <Heart className="w-12 h-12 stroke-[1.5]" fill="transparent" />
            </div>
          </h1>
          
          <p className="text-[#867273] text-lg md:text-xl max-w-md leading-relaxed font-medium mb-10">
            Papelería creativa y personalizada para celebrar lo que más importa.
          </p>
          
          <button
            onClick={() => setActiveScreen('store')}
            className="flex items-center gap-2 bg-[#f4949a] hover:bg-[#e3858b] text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm uppercase tracking-widest mb-16"
          >
            <Heart className="w-4 h-4 fill-white" /> Conocé nuestra tienda
          </button>

          {/* 4 Feature Icons Row */}
          <div className="flex flex-wrap md:flex-nowrap items-start gap-4 md:gap-8 w-full border-t border-[#867273]/20 pt-8">
            <div className="flex items-center gap-3 w-[45%] md:w-auto">
              <div className="w-10 h-10 rounded-full border border-[#867273]/30 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#867273]" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#867273] leading-tight">Hecho<br/>con amor</span>
            </div>
            <div className="flex items-center gap-3 w-[45%] md:w-auto">
              <div className="w-10 h-10 rounded-full border border-[#867273]/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#867273]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#867273] leading-tight">Diseños<br/>personalizados</span>
            </div>
            <div className="flex items-center gap-3 w-[45%] md:w-auto">
              <div className="w-10 h-10 rounded-full border border-[#867273]/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#867273]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#867273] leading-tight">Ideal para<br/>cada ocasión</span>
            </div>
            <div className="flex items-center gap-3 w-[45%] md:w-auto">
              <div className="w-10 h-10 rounded-full border border-[#867273]/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#867273]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#867273] leading-tight">Envíos a todo<br/>el país</span>
            </div>
          </div>
        </div>

        {/* Right Image/Collage area */}
        <div className="flex-1 w-full max-w-lg relative z-10 mt-12 md:mt-0">
          <div className="relative aspect-[4/3] rounded-[4rem] rounded-tl-none overflow-visible">
            {/* Main Image styled softly */}
            <div className="w-full h-full rounded-[4rem] rounded-br-[10rem] rounded-tl-xl overflow-hidden shadow-2xl relative border-4 border-white transform hover:-rotate-1 transition-transform duration-500">
              <img 
                src="/hero.png" 
                alt="Aloha Party Designs" 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            
            {/* Floating Tags */}
            <div className="absolute -bottom-8 -left-8 bg-[#f4949a] text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg transform -rotate-12 border-4 border-[#fbf9f8] z-20">
              <span className="font-serif font-bold text-sm text-center leading-tight">Hecho<br/>con amor</span>
              <Heart className="w-3 h-3 mt-1 fill-white" />
            </div>

            <div className="absolute -top-6 -right-6 bg-white border border-[#867273]/10 rounded-2xl p-4 shadow-xl transform rotate-6 z-20">
               <span className="font-script text-[#f4949a] text-2xl font-bold">Feliz cumple</span>
            </div>
          </div>
        </div>
      </section>

      {/* Organic Wavy Divider */}
      <div className="w-full overflow-hidden leading-[0] -mt-1 md:-mt-4">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[120px]" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f4949a" fillOpacity="0.3"></path>
        </svg>
      </div>

      {/* Inspirational Quote Section */}
      <section className="w-full bg-[#fbf9f8] py-16 flex flex-col items-center justify-center text-center px-6 relative">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#867273] mb-4">♥ Papelería que cuenta historias</span>
        <h2 className="flex flex-col items-center">
          <span className="font-serif font-bold text-[#f4949a] text-4xl md:text-5xl">Creamos momentos</span>
          <span className="font-script text-[#f4949a] text-4xl md:text-5xl -mt-2 transform -rotate-1">que quedan para siempre</span>
        </h2>
        <div className="absolute bottom-4 right-10 md:right-1/4 text-[#8da77b] opacity-20">
          <img src="/hoja.png" alt="Hoja" className="w-16 h-16" />
        </div>
      </section>

      {/* Descubre Nuestra Magia Section */}
      <section className="w-full bg-white px-6 md:px-12 py-20 flex flex-col items-center">
        <div className="w-full lg:max-w-[60vw] flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-[#f4949a]">Descubre nuestra magia</h2>
              <p className="text-[#867273] text-sm mt-2">Papelería creativa hecha a mano para cada ocasión especial.</p>
            </div>
            <button 
              onClick={() => setActiveScreen('store')}
              className="text-xs font-semibold text-[#867273] hover:text-[#f4949a] flex items-center gap-1"
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
        </div>
      </section>

      {/* Nuestra Historia Section */}
      <section className="w-full bg-white px-6 md:px-12 py-24 flex flex-col items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#f4949a]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 text-[#8da77b] opacity-20">
           <img src="/hoja.png" alt="Hoja" className="w-32 h-32 -rotate-45" />
        </div>
        
        <div className="w-full lg:max-w-[60vw] flex flex-col md:flex-row items-center gap-16 z-10">
          <div className="flex-1 flex justify-center w-full">
            <div className="w-[80%] max-w-[400px] aspect-square rounded-[3rem] overflow-hidden shadow-xl border-8 border-[#f4949a]/20 transform -rotate-3">
              <img src="/history.png" alt="Nuestra Historia" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <p className="text-[#f4949a] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
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
        </div>
      </section>
    </div>
  );
}
