import React, { useState, useMemo } from 'react';
import { ShoppingCart, Star, Sparkles, Filter, ChevronLeft, ChevronRight, SlidersHorizontal, Info } from 'lucide-react';
import { Product } from '../types';

interface StoreViewProps {
  products: Product[];
  addToCart: (product: Product) => void;
  searchQuery: string;
}

export default function StoreView({ products, addToCart, searchQuery }: StoreViewProps) {
  // Sidebar states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Todos']);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'recientes' | 'populares'>('recientes');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Available categories
  const categories = [
    'Todos',
    'Cake Toppers',
    'Piñatas Mini',
    'Tarjetas Personalizadas',
    'Banderines y Guirnaldas',
    'Cajitas Dulceras',
    'Notebooks',
    'Washi Tape',
    'Stickers'
  ];

  // Handle Category selection
  const handleCategoryChange = (category: string) => {
    if (category === 'Todos') {
      setSelectedCategories(['Todos']);
    } else {
      const updated = selectedCategories.filter(c => c !== 'Todos');
      if (updated.includes(category)) {
        const next = updated.filter(c => c !== category);
        setSelectedCategories(next.length === 0 ? ['Todos'] : next);
      } else {
        setSelectedCategories([...updated, category]);
      }
    }
    setCurrentPage(1);
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 2. Category filter
      if (!selectedCategories.includes('Todos')) {
        if (!selectedCategories.includes(product.category)) return false;
      }

      // 3. Price Filter
      if (product.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      // 4. Sorting
      if (sortBy === 'recientes') {
        // Boost isRecent
        if (a.isRecent && !b.isRecent) return -1;
        if (!a.isRecent && b.isRecent) return 1;
      } else {
        // Boost isPopular
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
      }
      return b.price - a.price; // secondary sort
    });
  }, [products, searchQuery, selectedCategories, maxPrice, sortBy]);

  // Pagination config (6 items per page)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div id="store-view" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside id="store-sidebar" className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        
        {/* Categories Panel */}
        <div id="filter-categories-card" className="bg-[#ffffff] rounded-2xl p-6 border border-[#867273]/20 shadow-sm">
          <h3 className="font-sans font-bold text-base text-[#1b1c1c] mb-4 flex items-center gap-2 border-b border-[#867273]/10 pb-2">
            <Filter className="w-4 h-4 text-[#93474d]" />
            Categorías
          </h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <label 
                  key={cat} 
                  className="flex items-center gap-3 text-xs text-[#534343] cursor-pointer hover:text-[#93474d] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4 rounded text-[#4d6543] focus:ring-[#4d6543] border-[#867273]/30 cursor-pointer"
                  />
                  <span className={`${isChecked ? 'font-semibold text-[#93474d]' : ''}`}>
                    {cat}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Panel */}
        <div id="filter-price-card" className="bg-[#ffffff] rounded-2xl p-6 border border-[#867273]/20 shadow-sm">
          <h3 className="font-sans font-bold text-base text-[#1b1c1c] mb-4 flex items-center gap-2 border-b border-[#867273]/10 pb-2">
            <SlidersHorizontal className="w-4 h-4 text-[#93474d]" />
            Precio Máximo
          </h3>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full accent-[#4d6543] h-1.5 bg-[#efeded] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-semibold text-[#867273] mt-2">
              <span>$0</span>
              <span className="text-[#93474d] bg-[#93474d]/10 px-2.5 py-0.5 rounded-full">${maxPrice} USD</span>
              <span>$100+</span>
            </div>
          </div>
        </div>

        {/* Creative Badge / Notice */}
        <div id="sidebar-notice-card" className="bg-[#cce8bd]/30 rounded-2xl p-5 border border-[#4d6543]/20 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#4d6543] shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs font-bold text-[#4d6543]">Papelería Hecha a Mano</p>
            <p className="text-[11px] text-[#516947] mt-1 leading-relaxed">
              Cada topper, piñata y cajita se diseña y ensambla artesanalmente. Los materiales son ecológicos y premium.
            </p>
          </div>
        </div>
      </aside>

      {/* Product Area */}
      <main id="store-catalog-main" className="flex-grow flex flex-col gap-6">
        
        {/* Catalog Header with Sorting Options */}
        <div id="catalog-controls-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-sans font-bold text-2xl text-[#1b1c1c] tracking-tight">Explora Nuestra Tienda</h2>
            <p className="text-xs text-[#867273] mt-1">Detalles creativos y artesanales para momentos inolvidables.</p>
          </div>
          
          {/* Recientes vs Populares tabs */}
          <div id="sort-tabs-container" className="flex gap-2 bg-[#efeded]/80 p-1 rounded-full self-stretch sm:self-auto justify-center">
            <button
              id="sort-recientes-btn"
              onClick={() => { setSortBy('recientes'); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'recientes'
                  ? 'bg-white text-[#93474d] shadow-sm'
                  : 'text-[#867273] hover:text-[#93474d]'
              }`}
            >
              Recientes
            </button>
            <button
              id="sort-populares-btn"
              onClick={() => { setSortBy('populares'); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'populares'
                  ? 'bg-white text-[#93474d] shadow-sm'
                  : 'text-[#867273] hover:text-[#93474d]'
              }`}
            >
              Populares
            </button>
          </div>
        </div>

        {/* Empty State */}
        {paginatedProducts.length === 0 ? (
          <div id="catalog-empty-state" className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-[#867273]/20 shadow-sm text-center">
            <Sparkles className="w-12 h-12 text-[#93474d]/30 mb-4 animate-bounce" />
            <h4 className="text-sm font-bold text-[#1b1c1c]">No encontramos productos</h4>
            <p className="text-xs text-[#867273] max-w-xs mt-1 leading-relaxed">
              Prueba cambiando tus filtros de categoría o aumentando el rango de precio para encontrar más opciones.
            </p>
            <button
              id="reset-filters-btn"
              onClick={() => {
                setSelectedCategories(['Todos']);
                setMaxPrice(100);
              }}
              className="mt-4 px-4 py-1.5 bg-[#93474d] text-white text-xs font-semibold rounded-full hover:bg-[#712d34] transition-all cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => {
              const isHovered = hoveredProductId === product.id;
              const hasLowStock = product.stock <= 15;
              
              // We'll mimic the layout variations from the mockup.
              // Replicating: Mini Piñata Dino Pastel shows the solid text button, others show circular icons by default
              const showTextButton = product.id === '2'; 

              return (
                <div
                  id={`product-card-${product.id}`}
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#867273]/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group h-full relative"
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  {/* Decorative tag for recent or popular */}
                  {product.isRecent && (
                    <span className="absolute top-3 left-3 bg-[#cce8bd] text-[#364d2d] text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Nuevo
                    </span>
                  )}
                  {product.isPopular && !product.isRecent && (
                    <span className="absolute top-3 left-3 bg-[#ffb3b6]/60 text-[#712d34] text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-[#712d34]" />
                      Destacado
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#efeded]">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-xs text-[#867273] text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <div className="text-left flex flex-col gap-1.5">
                      <h3 className="font-sans font-bold text-sm text-[#1b1c1c] leading-tight group-hover:text-[#93474d] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#534343] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & CTA Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-left">
                        <span className="text-base font-bold text-[#1b1c1c]">
                          ${product.price.toFixed(2)}
                        </span>
                        {hasLowStock && (
                          <p className="text-[9px] text-[#ba1a1a] font-bold mt-0.5 animate-pulse">
                            ¡Solo {product.stock} disp.!
                          </p>
                        )}
                      </div>

                      {/* Display the correct button style matching mockup */}
                      {showTextButton ? (
                        <button
                          id={`btn-add-text-${product.id}`}
                          onClick={() => addToCart(product)}
                          className="px-5 py-2 bg-[#93474d] text-white text-[11px] font-bold rounded-full hover:bg-[#712d34] shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 flex items-center gap-1 cursor-pointer border border-[#867273]/20"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Agregar
                        </button>
                      ) : (
                        <button
                          id={`btn-add-circle-${product.id}`}
                          onClick={() => addToCart(product)}
                          className="w-9 h-9 bg-[#93474d] hover:bg-[#712d34] text-white rounded-full flex items-center justify-center shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer border border-[#867273]/10"
                          title="Añadir al Carrito"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div id="catalog-pagination" className="flex justify-center items-center gap-2 mt-8 py-4 border-t border-[#867273]/10">
            <button
              id="pag-prev-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 border border-[#867273]/20 rounded-lg text-[#867273] hover:bg-[#efeded]/50 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                id={`pag-page-btn-${page}`}
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#cce8bd] text-[#364d2d] border-[#4d6543]/40 shadow-xs'
                    : 'border-[#867273]/20 text-[#867273] hover:bg-[#efeded]/50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              id="pag-next-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 border border-[#867273]/20 rounded-lg text-[#867273] hover:bg-[#efeded]/50 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
