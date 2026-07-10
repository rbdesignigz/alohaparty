import React from 'react';
import { Camera, ThumbsUp, MessageSquare, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="store-footer" className="w-full bg-[#e4e2e2] dark:bg-[#eae8e7] border-t border-[#867273]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About column */}
        <div id="footer-col-brand" className="flex flex-col gap-4">
          <span className="text-xl font-sans font-bold text-[#93474d] tracking-tight">Aloha Party</span>
          <p className="text-xs text-[#534343] leading-relaxed max-w-xs">
            Papelería creativa y detalles hermosos hechos a mano con amor para que tus celebraciones más especiales sean momentos inolvidables.
          </p>
          <p className="text-[11px] text-[#534343]/70 font-medium">
            &copy; 2024 Aloha Party - Papelería Creativa. Todos los derechos reservados.
          </p>
        </div>

        {/* Links column */}
        <div id="footer-col-links" className="flex flex-col gap-3">
          <h4 className="text-xs font-sans font-bold text-[#1b1c1c] uppercase tracking-wider">Enlaces</h4>
          <a 
            id="footer-link-shipping"
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="text-xs text-[#534343] hover:text-[#93474d] hover:underline decoration-[#93474d] transition-all font-medium"
          >
            Políticas de Envío
          </a>
          <a 
            id="footer-link-terms"
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="text-xs text-[#534343] hover:text-[#93474d] hover:underline decoration-[#93474d] transition-all font-medium"
          >
            Términos y Condiciones
          </a>
          <a 
            id="footer-link-help"
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="text-xs text-[#534343] hover:text-[#93474d] hover:underline decoration-[#93474d] transition-all font-medium"
          >
            Preguntas Frecuentes
          </a>
        </div>

        {/* Social column */}
        <div id="footer-col-social" className="flex flex-col gap-3">
          <h4 className="text-xs font-sans font-bold text-[#1b1c1c] uppercase tracking-wider">Síguenos</h4>
          <a 
            id="social-instagram"
            href="https://instagram.com" 
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#534343] hover:text-[#93474d] flex items-center gap-2 transition-colors font-medium"
          >
            <Camera className="w-4 h-4 text-[#93474d]" />
            <span>Instagram</span>
          </a>
          <a 
            id="social-facebook"
            href="https://facebook.com" 
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#534343] hover:text-[#93474d] flex items-center gap-2 transition-colors font-medium"
          >
            <ThumbsUp className="w-4 h-4 text-[#93474d]" />
            <span>Facebook</span>
          </a>
          <a 
            id="social-whatsapp"
            href="https://wa.me/something" 
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#534343] hover:text-[#93474d] flex items-center gap-2 transition-colors font-medium"
          >
            <MessageSquare className="w-4 h-4 text-[#93474d]" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
      <div className="w-full bg-[#dbdad9] py-3 text-center text-[10px] text-[#534343]/60 font-semibold flex items-center justify-center gap-1">
        <span>Creado con</span>
        <Heart className="w-3 h-3 text-[#93474d] fill-[#93474d]" />
        <span>para Aloha Party</span>
      </div>
    </footer>
  );
}
