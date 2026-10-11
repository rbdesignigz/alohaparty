import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Layers } from 'lucide-react';
import { Product } from '../types';

interface ImageGalleryModalProps {
  product: Product | null;
  onClose: () => void;
  addToCart?: (product: Product) => void;
}

export default function ImageGalleryModal({ product, onClose, addToCart }: ImageGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combinar portada y galería sin duplicados
  const allImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      for (const img of product.images) {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      }
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'];
  }, [product]);

  // Reset al cambiar de producto
  useEffect(() => {
    setActiveIndex(0);
  }, [product]);

  // Controles por teclado (Escape para salir, flechas para navegar)
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, allImages.length, onClose]);

  if (!product) return null;

  const currentImg = allImages[activeIndex] || allImages[0];
  const hasMultiple = allImages.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      id="product-gallery-lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de la Galería */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#867273]/15 bg-white/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f4949a]/20 flex items-center justify-center text-[#f4949a]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#867273] uppercase tracking-wider">
                  {product.category}
                </span>
                {hasMultiple && (
                  <span className="text-[10px] bg-[#f4949a]/15 text-[#e3858b] font-bold px-2 py-0.5 rounded-full">
                    {activeIndex + 1} de {allImages.length} fotos
                  </span>
                )}
              </div>
              <h3 className="font-sans font-bold text-base text-[#1b1c1c] leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            id="close-gallery-lightbox-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#867273] hover:text-[#1b1c1c] transition-colors cursor-pointer"
            title="Cerrar galería (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visor Principal de la Imagen */}
        <div className="relative flex-grow flex items-center justify-center bg-[#1b1c1c]/5 min-h-[320px] md:min-h-[440px] max-h-[58vh] p-4 select-none overflow-hidden">
          <img
            key={currentImg}
            src={currentImg}
            alt={`${product.name} - Foto ${activeIndex + 1}`}
            referrerPolicy="no-referrer"
            className="max-h-[54vh] max-w-full w-auto object-contain rounded-2xl shadow-md transition-all duration-300 animate-fade-in"
          />

          {/* Botones de navegación Anterior / Siguiente */}
          {hasMultiple && (
            <>
              <button
                id="gallery-prev-btn"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#1b1c1c] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                title="Foto anterior (←)"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              <button
                id="gallery-next-btn"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#1b1c1c] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                title="Foto siguiente (→)"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Badge de Portada */}
          {activeIndex === 0 && (
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#364d2d] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#364d2d]/10">
              <Sparkles className="w-3 h-3 text-[#f4949a]" />
              Foto de Portada
            </span>
          )}
        </div>

        {/* Tira de Miniaturas (Thumbnails) */}
        {hasMultiple && (
          <div className="px-6 py-3 bg-[#fbf9f8] border-t border-[#867273]/15 flex items-center gap-3 overflow-x-auto scrollbar-thin">
            {allImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#f4949a] ring-2 ring-[#f4949a]/30 scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#867273]/30'
                  }`}
                  title={idx === 0 ? 'Portada' : `Foto ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#364d2d]/80 text-white text-[8px] font-bold py-0.5 text-center">
                      Portada
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer con info y CTA */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#867273]/15">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#867273]">Precio unitario</span>
            <span className="text-xl font-bold text-[#1b1c1c]">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-bold text-[#867273] hover:text-[#1b1c1c] px-4 py-2.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            {addToCart && (
              <button
                id="gallery-add-to-cart-btn"
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="bg-[#f4949a] hover:bg-[#e3858b] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md flex items-center gap-2 hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
