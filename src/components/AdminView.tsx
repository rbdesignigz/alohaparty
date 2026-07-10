import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  TrendingUp, 
  Users, 
  ClipboardList, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  AlertTriangle, 
  X, 
  FolderPlus,
  PackageCheck,
  DollarSign,
  Ship,
  Sparkles,
  ArrowRightLeft,
  UploadCloud
} from 'lucide-react';
import { Product, Order, User, Category } from '../types';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '../data';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setActiveScreen: (screen: 'store' | 'admin' | 'checkout' | 'login') => void;
}

type AdminTab = 'dashboard' | 'categories' | 'products' | 'users' | 'orders' | 'settings';

export default function AdminView({
  products,
  setProducts,
  categories,
  orders,
  setOrders,
  users,
  setUsers,
  setActiveScreen
}: AdminViewProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  
  // Search & Pagination in products list
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD product states
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for adding/editing
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Cake Toppers');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormImage(downloadURL);
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert('Error al subir la imagen. Comprueba las reglas de Storage o tu conexión.');
    } finally {
      setIsUploading(false);
    }
  };

  // Stats calculation
  const totalProductsCount = products.length;
  
  const totalSalesAmount = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== 'delivered').length;
  }, [orders]);

  // Form states for Category adding/editing
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'add' | 'edit'>('add');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formCategoryName, setFormCategoryName] = useState('');

  // Filtered Products for the table
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Delete product action
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Se quitará de la tienda.')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        if (currentPage > 1 && paginatedProducts.length === 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (e) {
        console.error(e);
        alert('Error eliminando el producto.');
      }
    }
  };

  // Open Edit modal
  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormDescription(product.description);
    setFormImage(product.image);
    setShowProductModal(true);
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories.length > 0 ? categories[0].name : '');
    setFormPrice('');
    setFormStock('');
    setFormDescription('');
    
    // Choose a default nice illustration from our assets or Unsplash randomly
    const defaults = [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80'
    ];
    setFormImage(defaults[Math.floor(Math.random() * defaults.length)]);
    setShowProductModal(true);
  };

  // Submit product creation/editing
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formStock) {
      alert('Por favor rellena todos los campos requeridos.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Ingresa un precio válido mayor a 0.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('Ingresa una cantidad de stock válida.');
      return;
    }

    if (modalMode === 'edit' && editingProduct) {
      // Edit mode
      try {
        await setDoc(doc(db, 'products', editingProduct.id), {
          ...editingProduct,
          name: formName,
          category: formCategory,
          price: priceNum,
          stock: stockNum,
          description: formDescription,
          image: formImage
        });
      } catch (e) {
        console.error(e);
        alert('Error editando el producto');
      }
    } else {
      // Add mode
      const newId = `NEW-${Math.floor(100 + Math.random() * 900)}`;
      const newProd: Product = {
        id: newId,
        name: formName,
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        description: formDescription || 'Sin descripción.',
        image: formImage,
        isRecent: true,
        isPopular: false
      };
      try {
        await setDoc(doc(db, 'products', newId), newProd);
      } catch (e) {
        console.error(e);
        alert('Error creando el producto');
      }
    }

    setShowProductModal(false);
  };

  // Orders table filters and status updates
  const handleOrderStatusChange = async (orderId: string, newStatus: 'pending' | 'shipped' | 'delivered') => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (e) {
      console.error(e);
      alert('Error cambiando estado de la orden');
    }
  };

  // User role change
  const handleUserRoleChange = async (userId: string, currentEmail: string, newRole: 'admin' | 'customer') => {
    if (currentEmail.toLowerCase() === 'pablo.da.ber@gmail.com') {
      alert('No puedes cambiar el rol del Administrador Principal.');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (e) {
      console.error(e);
      alert('Error cambiando el rol del usuario');
    }
  };
  // Category handlers
  const handleOpenAddCategoryModal = () => {
    setCategoryModalMode('add');
    setEditingCategory(null);
    setFormCategoryName('');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategoryModal = (cat: Category) => {
    setCategoryModalMode('edit');
    setEditingCategory(cat);
    setFormCategoryName(cat.name);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoryName.trim()) return;

    if (categoryModalMode === 'edit' && editingCategory) {
      try {
        const oldName = editingCategory.name;
        const newName = formCategoryName.trim();
        await updateDoc(doc(db, 'categories', editingCategory.id), { name: newName });
        
        if (oldName !== newName) {
           const productsToUpdate = products.filter(p => p.category === oldName);
           for (const p of productsToUpdate) {
             await updateDoc(doc(db, 'products', p.id), { category: newName });
           }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const newId = `cat_${Date.now()}`;
        await setDoc(doc(db, 'categories', newId), { name: formCategoryName.trim() });
      } catch (e) {
        console.error(e);
      }
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = async (cat: Category) => {
    const isUsed = products.some(p => p.category === cat.name);
    if (isUsed) {
      alert(`No puedes eliminar la categoría "${cat.name}" porque hay productos que la usan. Por favor, reasigna esos productos primero.`);
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${cat.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'categories', cat.id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div id="admin-backoffice" className="min-h-screen bg-[#fbf9f8] flex flex-col md:flex-row relative">
      
      {/* SideNavBar Component */}
      <nav id="admin-sidebar" className="w-full md:w-64 bg-[#f5f3f3] md:fixed md:h-screen p-6 flex flex-col gap-6 border-r border-[#867273]/20 z-15 shrink-0 text-left">
        
        {/* Branding header */}
        <div id="sidebar-branding" className="px-2 pt-2 cursor-pointer" onClick={() => setActiveScreen('store')}>
          <h1 className="text-xl font-sans font-extrabold text-[#f4949a] tracking-tight">Aloha Party</h1>
          <p className="text-[10px] text-[#867273] uppercase tracking-widest font-bold mt-0.5">Papelería Creativa</p>
        </div>

        {/* User Card */}
        <div id="sidebar-user-card" className="flex items-center gap-3 bg-[#f4949a]/10 rounded-2xl p-4 border border-[#f4949a]/20">
          <div className="w-10 h-10 rounded-full bg-[#f4949a] text-white flex items-center justify-center font-bold text-sm">
            AA
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#1b1c1c]">Aloha Admin</p>
            <p className="text-[9px] text-[#534343] uppercase tracking-wider font-semibold">Backoffice Manager</p>
          </div>
        </div>

        {/* Navigation list */}
        <ul id="sidebar-menu-list" className="flex flex-col gap-1.5 flex-grow">
          {/* Dashboard */}
          <li>
            <button
              id="sidebar-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#f4949a] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </li>

          {/* Categories */}
          <li>
            <button
              id="sidebar-tab-categories"
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#cce8bd] text-[#364d2d] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Categorías</span>
            </button>
          </li>

          {/* Products (Active list) */}
          <li>
            <button
              id="sidebar-tab-products"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#cce8bd] text-[#364d2d] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </button>
          </li>

          {/* Users */}
          <li>
            <button
              id="sidebar-tab-users"
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-[#f4949a] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>
          </li>

          {/* Orders */}
          <li>
            <button
              id="sidebar-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#f4949a] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Orders</span>
              {activeOrdersCount > 0 && (
                <span className="ml-auto bg-[#ba1a1a] text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </li>

          {/* Settings */}
          <li>
            <button
              id="sidebar-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-[#f4949a] shadow-xs translate-x-1'
                  : 'text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a]'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </li>
        </ul>

        {/* Core Quick Action: New Product */}
        <button
          id="sidebar-new-product-btn"
          onClick={handleOpenAddModal}
          className="w-full bg-[#f4949a] hover:bg-[#e3858b] text-white text-xs font-bold py-3.5 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-150 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#867273]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>

        {/* Back to store trigger */}
        <button
          id="sidebar-back-store-btn"
          onClick={() => setActiveScreen('store')}
          className="mt-auto w-full border border-[#867273]/30 text-[#867273] hover:text-[#f4949a] hover:border-[#f4949a] text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer text-center"
        >
          Volver a la Tienda
        </button>
      </nav>

      {/* Main Backoffice Content Container */}
      <main id="admin-main-content" className="flex-grow md:ml-64 p-6 md:p-12 max-w-7xl w-full mx-auto">
        
        {/* TAB 0: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div id="tab-content-categories" className="flex flex-col gap-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">Product Categories</h2>
                <p className="text-xs text-[#867273] mt-1">Manage dynamic categories for your creative stationery catalog.</p>
              </div>
              <button
                onClick={handleOpenAddCategoryModal}
                className="bg-[#f4949a] hover:bg-[#e3858b] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-2xl border border-[#867273]/20 shadow-xs overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#867273]/15 bg-[#fbf9f8] text-[10px] font-bold text-[#867273] uppercase tracking-wider hidden sm:grid">
                <div className="col-span-8">Category Name</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
              
              {categories.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#867273]">No hay categorías registradas.</div>
              ) : (
                <div className="divide-y divide-[#867273]/10">
                  {categories.map((cat) => (
                    <div key={cat.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-[#fbf9f8]/50 transition-colors">
                      <div className="col-span-8 font-bold text-sm text-[#1b1c1c]">{cat.name}</div>
                      <div className="col-span-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditCategoryModal(cat)}
                          className="p-1.5 text-[#867273] hover:text-[#4d6543] hover:bg-[#4d6543]/10 rounded-lg transition-colors cursor-pointer"
                          title="Editar Categoría"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-[#867273] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: PRODUCT LISTING & CRUD (Active by default) */}
        {activeTab === 'products' && (
          <div id="tab-content-products" className="flex flex-col gap-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">Product Inventory</h2>
                <p className="text-xs text-[#867273] mt-1">Manage and edit your creative stationery catalog.</p>
              </div>
              
              {/* Search input bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867273]" />
                <input
                  id="admin-product-search"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-[#867273]/30 text-xs text-[#1b1c1c] rounded-xl outline-none focus:border-[#4d6543] focus:ring-1 focus:ring-[#4d6543] transition-all"
                />
              </div>
            </div>

            {/* Bento statistics grid */}
            <div id="bento-stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Total Products */}
              <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                <span className="w-12 h-12 bg-[#f4949a]/10 text-[#f4949a] rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#867273] uppercase tracking-wider">TOTAL PRODUCTS</p>
                  <p className="text-xl font-sans font-extrabold text-[#1b1c1c] mt-0.5">{totalProductsCount}</p>
                </div>
              </div>

              {/* Card 2: Monthly Sales */}
              <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                <span className="w-12 h-12 bg-[#cce8bd]/50 text-[#4d6543] rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#867273] uppercase tracking-wider">MONTHLY SALES</p>
                  <p className="text-xl font-sans font-extrabold text-[#1b1c1c] mt-0.5">${totalSalesAmount.toFixed(2)} ARS</p>
                </div>
              </div>

              {/* Card 3: Active Orders */}
              <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                <span className="w-12 h-12 bg-[#efeded] text-[#5d5f5f] rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#867273] uppercase tracking-wider">ACTIVE ORDERS</p>
                  <p className="text-xl font-sans font-extrabold text-[#1b1c1c] mt-0.5">{activeOrdersCount}</p>
                </div>
              </div>
            </div>

            {/* Inventory table */}
            <div id="admin-inventory-table-container" className="bg-white rounded-2xl border border-[#867273]/20 shadow-xs overflow-hidden flex flex-col">
              
              {/* Desktop Headers */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#867273]/15 bg-[#fbf9f8] text-[10px] font-bold text-[#867273] uppercase tracking-wider hidden sm:grid text-left">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#867273]/10">
                {paginatedProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#867273]">
                    No se encontraron productos en el inventario.
                  </div>
                ) : (
                  paginatedProducts.map((product) => {
                    const isLowStock = product.stock <= 15;
                    return (
                      <div 
                        id={`inventory-row-${product.id}`}
                        key={product.id} 
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-[#fbf9f8]/50 transition-colors text-left"
                      >
                        {/* Image & Title Column */}
                        <div className="col-span-1 sm:col-span-5 flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-[#efeded] border border-[#867273]/15 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1b1c1c] truncate">{product.name}</p>
                            <p className="text-[10px] text-[#867273] sm:hidden mt-0.5">
                              {product.category} • ${product.price.toFixed(2)} • {product.stock} units
                            </p>
                          </div>
                        </div>

                        {/* Category Column */}
                        <div className="col-span-2 hidden sm:block">
                          <span className="px-3 py-1 bg-[#4d6543]/10 text-[#4d6543] text-[10px] font-bold rounded-full inline-block truncate max-w-[140px]">
                            {product.category}
                          </span>
                        </div>

                        {/* Price Column */}
                        <div className="col-span-2 hidden sm:block text-xs font-bold text-[#1b1c1c]">
                          ${product.price.toFixed(2)}
                        </div>

                        {/* Stock Column */}
                        <div className="col-span-2 hidden sm:block text-xs font-bold">
                          {isLowStock ? (
                            <span className="text-[#ba1a1a] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{product.stock} (Bajo)</span>
                            </span>
                          ) : (
                            <span className="text-[#4d6543]">{product.stock}</span>
                          )}
                        </div>

                        {/* Actions Column */}
                        <div className="col-span-1 sm:col-span-1 flex justify-end gap-1.5">
                          <button
                            id={`inventory-edit-${product.id}`}
                            onClick={() => handleOpenEditModal(product)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#867273] hover:bg-[#efeded] hover:text-[#f4949a] transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`inventory-delete-${product.id}`}
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#867273] hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Table pagination control footer */}
              <div id="inventory-pagination-footer" className="p-4 border-t border-[#867273]/15 flex items-center justify-between bg-[#fbf9f8] text-xs">
                <p className="text-[#867273] font-medium">
                  Mostrando <span className="font-bold">{paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de <span className="font-bold">{filteredProducts.length}</span> entradas
                </p>
                <div className="flex gap-2">
                  <button
                    id="admin-pag-prev"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 border border-[#867273]/20 rounded-lg text-xs font-semibold text-[#867273] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    id="admin-pag-indicator"
                    className="px-3 py-1 border border-[#867273]/20 rounded-lg text-xs font-bold text-[#1b1c1c] bg-white shadow-xs"
                  >
                    {currentPage} / {totalPages}
                  </button>
                  <button
                    id="admin-pag-next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 border border-[#867273]/20 rounded-lg text-xs font-semibold text-[#867273] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE ORDERS LIST */}
        {activeTab === 'orders' && (
          <div id="tab-content-orders" className="flex flex-col gap-6 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">Active Orders</h2>
              <p className="text-xs text-[#867273] mt-1">Supervise product shipments and change delivery statuses.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#867273]/20 shadow-xs overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#867273]/15 bg-[#fbf9f8] text-[10px] font-bold text-[#867273] uppercase tracking-wider hidden md:grid">
                <div className="col-span-2">ID Orden</div>
                <div className="col-span-3">Cliente</div>
                <div className="col-span-3">Artículos</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-1">Fecha</div>
                <div className="col-span-2 text-right">Estado</div>
              </div>

              <div className="divide-y divide-[#867273]/10">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#867273]">
                    No hay órdenes cargadas en el sistema.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      id={`order-row-${order.id}`}
                      key={order.id} 
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-[#fbf9f8]/50 transition-colors"
                    >
                      <div className="col-span-2 text-xs font-bold text-[#f4949a]">
                        {order.id}
                      </div>
                      <div className="col-span-3 text-left">
                        <p className="text-xs font-bold text-[#1b1c1c]">{order.customerName}</p>
                        <p className="text-[10px] text-[#867273] truncate">{order.address}, {order.city}</p>
                      </div>
                      <div className="col-span-3 text-xs text-left max-h-16 overflow-y-auto">
                        {order.items.map((it, i) => (
                          <li key={i} className="truncate list-none">
                            <span className="font-semibold">{it.quantity}x</span> {it.product.name}
                          </li>
                        ))}
                      </div>
                      <div className="col-span-1 text-xs font-bold text-[#1b1c1c]">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-xs text-[#867273]">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <select
                          id={`order-status-select-${order.id}`}
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                            order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-green-50 text-green-700 border-green-300'
                          }`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USERS LIST */}
        {activeTab === 'users' && (
          <div id="tab-content-users" className="flex flex-col gap-6 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">Users Database</h2>
              <p className="text-xs text-[#867273] mt-1">Directory of registered store managers and active clients.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#867273]/20 shadow-xs overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#867273]/15 bg-[#fbf9f8] text-[10px] font-bold text-[#867273] uppercase tracking-wider hidden sm:grid">
                <div className="col-span-3">ID Usuario</div>
                <div className="col-span-4">Nombre Completo</div>
                <div className="col-span-3">Correo Electrónico</div>
                <div className="col-span-2 text-right">Rol</div>
              </div>

              <div className="divide-y divide-[#867273]/10">
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-3 text-xs text-[#867273] font-mono">
                      {user.id}
                    </div>
                    <div className="col-span-4 text-xs font-bold text-[#1b1c1c]">
                      {user.name}
                    </div>
                    <div className="col-span-3 text-xs text-[#534343]">
                      {user.email}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      {user.email.toLowerCase() === 'pablo.da.ber@gmail.com' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Admin Principal
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user.id, user.email, e.target.value as 'admin' | 'customer')}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                            user.role === 'admin'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="admin">Administrador</option>
                          <option value="customer">Cliente</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DASHBOARD PERFORMANCE SUMMARIES */}
        {activeTab === 'dashboard' && (
          <div id="tab-content-dashboard" className="flex flex-col gap-6 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">Performance Summary</h2>
              <p className="text-xs text-[#867273] mt-1">Overview of your online boutique sales metrics.</p>
            </div>

            {/* Simulated Charts and Graphics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Sales Performance Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1b1c1c]">Ventas por Categoría</h3>
                  <TrendingUp className="w-4 h-4 text-[#4d6543]" />
                </div>
                
                {/* Simulated SVG Bar chart */}
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-[#f4949a]/80 hover:bg-[#f4949a] rounded-t-lg transition-all h-28" title="Cake Toppers: $1,250"></div>
                    <span className="text-[9px] text-[#867273] font-semibold truncate max-w-[50px]">Toppers</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-[#4d6543]/80 hover:bg-[#4d6543] rounded-t-lg transition-all h-16" title="Piñatas: $650"></div>
                    <span className="text-[9px] text-[#867273] font-semibold truncate max-w-[50px]">Piñatas</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-[#cce8bd] hover:bg-[#cce8bd]/90 rounded-t-lg transition-all h-36" title="Tarjetas: $1,800"></div>
                    <span className="text-[9px] text-[#867273] font-semibold truncate max-w-[50px]">Tarjetas</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-[#ffdada] hover:bg-[#ffb3b6] rounded-t-lg transition-all h-20" title="Banderines: $950"></div>
                    <span className="text-[9px] text-[#867273] font-semibold truncate max-w-[50px]">Guirnaldas</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-[#f4949a]/45 hover:bg-[#f4949a]/60 rounded-t-lg transition-all h-24" title="Cajitas: $1,100"></div>
                    <span className="text-[9px] text-[#867273] font-semibold truncate max-w-[50px]">Cajitas</span>
                  </div>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-[#867273]/15 shadow-xs flex flex-col gap-4">
                <h3 className="text-sm font-bold text-[#1b1c1c]">Estatus de Envíos</h3>
                
                <div className="flex-grow flex flex-col justify-center gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Pendientes de Enviar ({orders.filter(o => o.status === 'pending').length})</span>
                      <span className="text-amber-700">Pendiente</span>
                    </div>
                    <div className="w-full bg-[#efeded] h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>En Tránsito/Despachadas ({orders.filter(o => o.status === 'shipped').length})</span>
                      <span className="text-blue-700">Enviado</span>
                    </div>
                    <div className="w-full bg-[#efeded] h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Entregadas con Éxito ({orders.filter(o => o.status === 'delivered').length})</span>
                      <span className="text-green-700">Entregado</span>
                    </div>
                    <div className="w-full bg-[#efeded] h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div id="tab-content-settings" className="flex flex-col gap-6 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-sans font-bold text-[#1b1c1c] tracking-tight">System Settings</h2>
              <p className="text-xs text-[#867273] mt-1">Configure parameters of the Aloha Party online store.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#867273]/20 shadow-xs max-w-xl flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#534343]">Nombre de la Tienda</label>
                <input
                  type="text"
                  defaultValue="Aloha Party - Papelería Creativa"
                  className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#534343]">Email de Contacto</label>
                <input
                  type="email"
                  defaultValue="hola@alohaparty.com.ar"
                  className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Envío Base (ARS)</label>
                  <input
                    type="number"
                    defaultValue="4.50"
                    step="0.10"
                    className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Moneda</label>
                  <select className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none cursor-pointer">
                    <option value="ARS">Pesos Argentinos (ARS)</option>
                    <option value="USD">Dólares (USD)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => alert('¡Configuraciones guardadas con éxito!')}
                  className="bg-[#4d6543] hover:bg-[#364d2d] text-white font-bold text-xs py-2.5 px-6 rounded-full cursor-pointer"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm('¿Migrar datos iniciales a Firebase? Esto sobreescribirá datos con el mismo ID.')) return;
                    try {
                      for (const p of INITIAL_PRODUCTS) await setDoc(doc(db, 'products', p.id), p);
                      for (const o of INITIAL_ORDERS) await setDoc(doc(db, 'orders', o.id), o);
                      for (const u of INITIAL_USERS) await setDoc(doc(db, 'users', u.id), u);
                      alert('Datos iniciales migrados con éxito a Firestore. Ya puedes recargar.');
                    } catch (e) {
                      console.error(e);
                      alert('Ocurrió un error al migrar los datos.');
                    }
                  }}
                  className="bg-[#ba1a1a] hover:bg-[#930000] text-white font-bold text-xs py-2.5 px-6 rounded-full cursor-pointer"
                >
                  Migrar Datos a Firebase
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CRUD Add/Edit Product Modal */}
      {showProductModal && (
        <div id="product-modal-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div id="product-modal-card" className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-[#867273]/20 shadow-2xl relative flex flex-col gap-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#867273]/15 pb-4">
              <h3 className="font-sans font-bold text-base text-[#1b1c1c] flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#f4949a]" />
                <span>{modalMode === 'add' ? 'Crear Nuevo Producto' : 'Editar Producto'}</span>
              </h3>
              <button
                id="close-product-modal"
                onClick={() => setShowProductModal(false)}
                className="text-[#867273] hover:text-[#f4949a] rounded-full p-1 hover:bg-[#efeded] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#534343]">Nombre del Producto *</label>
                <input
                  id="modal-product-name"
                  type="text"
                  placeholder="Ej: Topper Sirena Mágica"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Categoría *</label>
                  <select
                    id="modal-product-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none cursor-pointer"
                  >
                    {categories.length === 0 && <option value="">Sin categorías</option>}
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Precio (ARS) *</label>
                  <input
                    id="modal-product-price"
                    type="number"
                    step="0.01"
                    placeholder="15.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Stock *</label>
                  <input
                    id="modal-product-stock"
                    type="number"
                    placeholder="45"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    required
                    className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#534343]">Imagen del Producto *</label>
                <div className="relative border-2 border-dashed border-[#867273]/30 rounded-xl p-6 text-center hover:bg-[#fbf9f8] transition-colors group cursor-pointer overflow-hidden bg-white">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 h-full py-4">
                      <div className="w-6 h-6 border-2 border-[#4d6543] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-[#4d6543]">Subiendo imagen...</span>
                    </div>
                  ) : formImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={formImage} alt="Preview" className="h-32 object-contain rounded-lg border border-[#867273]/20" />
                      <span className="text-[10px] font-bold text-[#867273] underline group-hover:text-[#f4949a] relative z-0">
                        Haz clic o arrastra para cambiar la imagen
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#fbf9f8] flex items-center justify-center text-[#867273] group-hover:text-[#f4949a] group-hover:bg-[#ffdada]/30 transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1b1c1c]">Sube o arrastra una imagen</p>
                        <p className="text-[10px] text-[#867273]">PNG, JPG o WEBP</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#534343]">Descripción del Producto</label>
                <textarea
                  id="modal-product-desc"
                  rows={3}
                  placeholder="Escribe los detalles del producto..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none resize-none"
                ></textarea>
              </div>

              <button
                id="modal-product-submit"
                type="submit"
                className="bg-[#f4949a] hover:bg-[#e3858b] text-white py-3 rounded-full font-sans font-bold text-xs shadow-sm transition-all duration-200 mt-4 cursor-pointer text-center"
              >
                {modalMode === 'add' ? 'Crear Producto' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div id="category-crud-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-[#867273]/15 bg-[#fbf9f8]">
              <h3 className="font-sans font-bold text-lg text-[#1b1c1c]">
                {categoryModalMode === 'add' ? 'Nueva Categoría' : 'Editar Categoría'}
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-full hover:bg-[#e4dfde] text-[#867273] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              <form id="category-form" onSubmit={handleCategorySubmit} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#534343]">Nombre de la Categoría *</label>
                  <input
                    type="text"
                    placeholder="Ej. Cake Toppers"
                    value={formCategoryName}
                    onChange={(e) => setFormCategoryName(e.target.value)}
                    required
                    className="bg-[#fbf9f8] border border-[#867273]/30 focus:border-[#4d6543] rounded-xl px-4 py-2 text-xs outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#867273]/15 bg-[#fbf9f8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#534343] hover:bg-[#e4dfde] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="category-form"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#4d6543] hover:bg-[#364d2d] text-white shadow-sm transition-colors cursor-pointer"
              >
                {categoryModalMode === 'add' ? 'Guardar Categoría' : 'Actualizar Categoría'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
