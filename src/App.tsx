import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { ActiveScreen, Product, CartItem, Order, User, Category } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from './data';
import { useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import Header from './components/Header';
import Footer from './components/Footer';
import StoreView from './components/StoreView';
import CheckoutView from './components/CheckoutView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import AboutView from './components/AboutView';
import HomeView from './components/HomeView';

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  // Database State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Firestore sync
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)).sort((a, b) => a.name.localeCompare(b.name)));
    });
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });
    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubUsers();
    };
  }, []);

  // Cart State (Starts empty)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Notification toast state
  const [notification, setNotification] = useState<string | null>(null);

  // Trigger non-blocking toast
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Add item to shopping cart
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        triggerNotification(`Aumentada cantidad de: ${product.name}`);
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      triggerNotification(`Agregado al carrito: ${product.name}`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Adjust item quantities from cart view
  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
        }
        return item;
      });
    });
  };

  // Remove item from shopping cart
  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(it => it.product.id === productId);
    if (itemToRemove) {
      triggerNotification(`Removido del carrito: ${itemToRemove.product.name}`);
    }
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Total cart quantities
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Finalize order placement
  const placeOrder = async (newOrder: Order) => {
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      triggerNotification('Orden enviada correctamente a Firebase');
    } catch (e) {
      console.error(e);
      triggerNotification('Error al enviar la orden');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    triggerNotification(`¡Hola de nuevo, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('store');
    triggerNotification('Sesión cerrada con éxito');
  };

  return (
    <div id="aloha-party-app" className="min-h-screen bg-[#fbf9f8] flex flex-col font-sans text-[#1b1c1c] selection:bg-[#cce8bd] selection:text-[#364d2d]">
      
      {/* Non-destructive Global Header (Suppressed ONLY when inside the full Administrative dashboard layout for immersive workspace feel) */}
      {activeScreen !== 'admin' && (
        <Header
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          logout={handleLogout}
        />
      )}

      {/* Primary view router */}
      <div id="main-view-router" className="flex-grow">
        
        {/* Home Screen */}
        {activeScreen === 'home' && (
          <HomeView setActiveScreen={setActiveScreen} />
        )}

        {/* Store Catalog Screen */}
        {activeScreen === 'store' && (
          <StoreView
            products={products}
            categories={categories}
            addToCart={addToCart}
            searchQuery={searchQuery}
          />
        )}

        {/* Cart & Checkout Screen */}
        {activeScreen === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            placeOrder={placeOrder}
            setActiveScreen={setActiveScreen}
            clearCart={() => setCartItems([])}
          />
        )}

        {/* Backoffice Admin Panel */}
        {activeScreen === 'admin' && (
          <AdminView
            products={products}
            setProducts={setProducts}
            categories={categories}
            orders={orders}
            setOrders={setOrders}
            users={users}
            setUsers={setUsers}
            setActiveScreen={setActiveScreen}
          />
        )}

        {/* Authentication Login Screen */}
        {activeScreen === 'login' && (
          <LoginView
            login={handleLogin}
            setActiveScreen={setActiveScreen}
          />
        )}

        {/* About Us Screen */}
        {activeScreen === 'about' && (
          <AboutView
            setActiveScreen={setActiveScreen}
          />
        )}
      </div>

      {/* Global Footer (Suppressed ONLY when inside the full Administrative dashboard layout for immersive workspace feel) */}
      {activeScreen !== 'admin' && <Footer />}

      {/* Responsive Toast Notification System */}
      {notification && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 bg-[#364d2d] text-white text-xs font-bold px-4 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce cursor-pointer"
          onClick={() => setNotification(null)}
        >
          <Check className="w-4 h-4 bg-white/20 p-0.5 rounded-full" />
          <span>{notification}</span>
          <X className="w-3 h-3 text-white/55 ml-1 hover:text-white" />
        </div>
      )}
    </div>
  );
}
