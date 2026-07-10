import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Lock, CreditCard, ShoppingCart, CheckCircle2, Ticket } from 'lucide-react';
import { CartItem, Order, Product } from '../types';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicialización de Mercado Pago (reemplazar por tu clave pública en producción)
initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "TEST-e613b194-e3fb-4632-84bc-21a4030616b7");


interface CheckoutViewProps {
  cartItems: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: (order: Order) => void;
  setActiveScreen: (screen: 'store' | 'admin' | 'checkout' | 'login') => void;
  clearCart: () => void;
}

export default function CheckoutView({
  cartItems,
  updateQuantity,
  removeFromCart,
  placeOrder,
  setActiveScreen,
  clearCart
}: CheckoutViewProps) {
  // Shipping form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Región Metropolitana');
  
  // Mercado Pago & Status State
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Financial calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 4.50 : 0; // Flat $4.50 shipping or free if empty
  const total = subtotal + shippingCost;

  // Handle pay trigger
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!email) errors.push('El correo electrónico es requerido.');
    if (!firstName) errors.push('El nombre es requerido.');
    if (!lastName) errors.push('El apellido es requerido.');
    if (!address) errors.push('La dirección de envío es requerida.');
    if (!city) errors.push('La ciudad es requerida.');

    if (errors.length > 0) {
      setFormErrors(errors);
      // scroll to errors
      document.getElementById('checkout-form-errors')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setFormErrors([]);
    setIsProcessing(true);
    setPreferenceId(null); // Reset previous preference if form updated

    const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:5001/alohaparty-ig/us-central1/createPreference'
      : '/api/createPreference';

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: cartItems,
        email,
        firstName,
        lastName
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al conectar con el servidor de pagos');
      }
      return res.json();
    })
    .then(data => {
      setIsProcessing(false);
      if (data.id) {
        setPreferenceId(data.id);
        
        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: `${firstName} ${lastName}`,
          email,
          address,
          city,
          region,
          items: [...cartItems],
          total: parseFloat(total.toFixed(2)),
          date: new Date().toISOString(),
          status: 'pending'
        };

        // Guardar la orden pendiente localmente
        placeOrder(newOrder);
        setCreatedOrder(newOrder);
      } else {
        setFormErrors(['Ocurrió un error al generar el link de pago de Mercado Pago.']);
      }
    })
    .catch(err => {
      console.error(err);
      setIsProcessing(false);
      setFormErrors(['Error de conexión con el backend. Por favor, asegúrese de tener configuradas sus credenciales.']);
    });
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    clearCart();
    setActiveScreen('store');
  };

  return (
    <div id="checkout-view" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative">
      
      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div id="empty-cart-state" className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-[#867273]/20 shadow-sm text-center max-w-xl mx-auto">
          <ShoppingCart className="w-16 h-16 text-[#f4949a]/30 mb-4 animate-bounce" />
          <h2 className="font-sans font-bold text-xl text-[#1b1c1c]">Tu Carrito está vacío</h2>
          <p className="text-xs text-[#867273] mt-2 leading-relaxed">
            Parece que aún no has agregado productos creativos a tu pedido. Explora nuestro catálogo de guirnaldas, piñatas, toppers y más.
          </p>
          <button
            id="empty-cart-back-btn"
            onClick={() => setActiveScreen('store')}
            className="mt-6 px-6 py-2.5 bg-[#f4949a] text-white text-xs font-bold rounded-full hover:bg-[#e3858b] transition-all duration-200 shadow-sm cursor-pointer"
          >
            Ir a la Tienda
          </button>
        </div>
      ) : (
        /* Multi-column grid for checkout layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items list & Shipping Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Cart List */}
            <section id="checkout-cart-list" className="bg-[#ffffff] rounded-2xl p-6 md:p-8 border border-[#867273]/20 shadow-sm text-left">
              <h2 className="font-sans font-bold text-lg text-[#1b1c1c] mb-6 flex items-center gap-2 border-b border-[#867273]/15 pb-4">
                <ShoppingBag className="w-5 h-5 text-[#f4949a]" />
                Tu Carrito
              </h2>

              <div id="cart-items-divider" className="divide-y divide-[#867273]/10">
                {cartItems.map((item) => (
                  <div 
                    id={`cart-item-${item.product.id}`}
                    key={item.product.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-xl border border-[#867273]/15 shadow-xs bg-[#efeded]"
                    />
                    
                    <div className="flex-grow text-left">
                      <h3 className="font-sans font-bold text-sm text-[#1b1c1c]">{item.product.name}</h3>
                      <p className="text-xs text-[#867273] mt-0.5">
                        Categoría: <span className="font-semibold">{item.product.category}</span>
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        {/* Quantity selector */}
                        <div className="flex items-center bg-[#efeded] rounded-full px-2 py-1">
                          <button
                            id={`quantity-dec-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 hover:text-[#f4949a] rounded-full transition-colors cursor-pointer"
                            title="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-sans font-bold text-xs mx-3 text-[#1b1c1c]">
                            {item.quantity}
                          </span>
                          <button
                            id={`quantity-inc-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 hover:text-[#f4949a] rounded-full transition-colors cursor-pointer"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          id={`cart-remove-${item.product.id}`}
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-[#867273] hover:text-[#f4949a] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0 min-w-[80px]">
                      <span className="font-sans font-bold text-sm text-[#1b1c1c]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Info Form */}
            <section id="shipping-info-section" className="bg-[#ffffff] rounded-2xl p-6 md:p-8 border border-[#867273]/20 shadow-sm text-left">
              <h2 className="font-sans font-bold text-lg text-[#1b1c1c] mb-6 flex items-center gap-2 border-b border-[#867273]/15 pb-4">
                <ShieldCheck className="w-5 h-5 text-[#f4949a]" />
                Información de Envío
              </h2>

              {/* Error messages panel */}
              {formErrors.length > 0 && (
                <div id="checkout-form-errors" className="bg-[#f4949a]/10 border border-[#f4949a]/30 text-[#e3858b] p-4 rounded-xl mb-6 text-xs flex flex-col gap-1">
                  <p className="font-bold mb-1">Por favor corrige los siguientes errores:</p>
                  {formErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Correo Electrónico *</label>
                  <input
                    id="shipping-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all"
                  />
                </div>

                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Nombre *</label>
                  <input
                    id="shipping-first-name"
                    type="text"
                    placeholder="Ej: María"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all"
                  />
                </div>

                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Apellido *</label>
                  <input
                    id="shipping-last-name"
                    type="text"
                    placeholder="Ej: Pérez"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Dirección Completa *</label>
                  <input
                    id="shipping-address"
                    type="text"
                    placeholder="Calle, número, departamento, oficina..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all"
                  />
                </div>

                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Ciudad *</label>
                  <input
                    id="shipping-city"
                    type="text"
                    placeholder="Ej: Santiago"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all"
                  />
                </div>

                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Región *</label>
                  <select
                    id="shipping-region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] rounded-xl px-4 py-2 text-xs text-[#1b1c1c] outline-none transition-all cursor-pointer"
                  >
                    <option value="Región Metropolitana">Región Metropolitana</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Biobío">Biobío</option>
                    <option value="Coquimbo">Coquimbo</option>
                    <option value="Araucanía">Araucanía</option>
                    <option value="Antofagasta">Antofagasta</option>
                  </select>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Summarized Costs & Mercado Pago Button */}
          <div className="lg:col-span-5 sticky top-24">
            <div id="checkout-summary-card" className="bg-[#ffffff] rounded-2xl p-6 md:p-8 border border-[#867273]/20 shadow-sm text-left flex flex-col gap-6">
              <h2 className="font-sans font-bold text-lg text-[#1b1c1c] border-b border-[#867273]/15 pb-4">
                Resumen de Compra
              </h2>
              
              {/* Calculations lists */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-medium text-[#534343]">
                  <span>Subtotal ({cartItems.length} artículos)</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-[#534343]">
                  <span>Costo de Envío</span>
                  <span className="font-bold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#867273]/10 pt-4 flex justify-between items-center font-sans font-bold text-base text-[#1b1c1c]">
                  <span>Total</span>
                  <span className="text-[#f4949a]">${total.toFixed(2)} ARS</span>
                </div>
              </div>

              {/* Secure Checkout Alert banner */}
              <div id="secure-checkout-badge" className="bg-[#f5f3f3] p-4 rounded-xl flex gap-3 items-start border border-[#867273]/10">
                <ShieldCheck className="w-5 h-5 text-[#4d6543] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1b1c1c]">Compra Segura</h4>
                  <p className="text-[10px] text-[#534343] mt-1 leading-relaxed">
                    Tus datos están completamente protegidos. Procesamos todos los pagos de forma segura utilizando la pasarela oficial de **Mercado Pago**.
                  </p>
                </div>
              </div>

              {/* Pay Button / Mercado Pago SDK Widget */}
              {preferenceId ? (
                <div id="mp-wallet-container" className="w-full">
                  <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
                </div>
              ) : (
                <button
                  id="mercado-pago-pay-btn"
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessing}
                  className="w-full bg-[#f4949a] hover:bg-[#e3858b] disabled:bg-[#f4949a]/50 text-white rounded-full py-4 px-6 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm font-sans font-bold text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Preparando pago...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirmar datos de envío</span>
                    </>
                  )}
                </button>
              )}

              <div id="accepted-cards-info" className="flex justify-center gap-2 items-center text-[#867273] text-[11px] font-semibold mt-1">
                <CreditCard className="w-4 h-4" />
                <span>Aceptamos todas las tarjetas de crédito y débito</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mercado Pago Simulated Receipt Modal */}
      {showReceiptModal && createdOrder && (
        <div id="receipt-modal-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div id="receipt-modal-card" className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-[#867273]/20 shadow-2xl relative text-center flex flex-col gap-6 animate-scale-up">
            
            <div className="flex flex-col items-center">
              <span className="w-16 h-16 bg-[#cce8bd] text-[#4d6543] rounded-full flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </span>
              <h3 className="font-sans font-bold text-xl text-[#1b1c1c]">¡Pago Exitoso!</h3>
              <p className="text-xs text-[#4d6543] font-semibold mt-1">Procesado con Mercado Pago</p>
            </div>

            {/* Receipt Info details block */}
            <div id="receipt-details-card" className="bg-[#fbf9f8] border border-[#867273]/15 rounded-2xl p-4 text-left flex flex-col gap-3">
              <div className="flex justify-between text-xs text-[#867273]">
                <span>Transacción ID:</span>
                <span className="font-bold text-[#1b1c1c]">{createdOrder.id}</span>
              </div>
              <div className="flex justify-between text-xs text-[#867273]">
                <span>Cliente:</span>
                <span className="font-bold text-[#1b1c1c]">{createdOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-xs text-[#867273]">
                <span>Destino:</span>
                <span className="font-bold text-[#1b1c1c] truncate max-w-[200px]">{createdOrder.address}, {createdOrder.city}</span>
              </div>
              <div className="border-t border-[#867273]/10 pt-3">
                <p className="text-[10px] font-bold text-[#867273] uppercase tracking-wider mb-2">Artículos adquiridos:</p>
                <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5 pr-1">
                  {createdOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-[#534343] truncate max-w-[220px]">{it.quantity}x {it.product.name}</span>
                      <span className="font-bold text-[#1b1c1c]">${(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#867273]/15 pt-3 flex justify-between items-center text-sm font-sans font-bold text-[#1b1c1c]">
                <span>Total pagado:</span>
                <span className="text-[#f4949a] text-base">${createdOrder.total.toFixed(2)} ARS</span>
              </div>
            </div>

            {/* Custom Thank you note */}
            <div className="text-xs text-[#867273] leading-relaxed px-2 flex gap-2 items-center justify-center">
              <Ticket className="w-5 h-5 text-[#f4949a] shrink-0" />
              <p>Tu orden ha sido guardada en estado **Pendiente** y ya puedes verla en el panel administrativo.</p>
            </div>

            <button
              id="receipt-close-btn"
              onClick={handleCloseReceiptModal}
              className="w-full bg-[#4d6543] hover:bg-[#364d2d] text-white py-3 rounded-full font-sans font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
