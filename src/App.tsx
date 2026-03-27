import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Candy, Cookie, Cylinder, Wind, Menu, X, Phone, MapPin, Truck, Search, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PRODUCTS } from './constants';
import HomePage from './HomePage';
import ProductCard from './ProductCard';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Delivery Config
const DELIVERY_CHARGE_NALGONDA = 100;
const DELIVERY_CHARGE_OTHER = 100;
const DELIVERY_CHARGE_PER_KG_OTHER = 30;

// Top Announcement
const TopAnnouncement = () => (
  <div className="overflow-hidden bg-green-600 py-2 text-white">
    <div className="announcement-track whitespace-nowrap px-3 text-xs font-medium sm:px-4 sm:text-sm">
      <span>Sri Rama Navami Subhakankshalu! Celebrate with Neelagiri Foods!</span>
    </div>
  </div>
);

// Navigation icons map
const IconMap: Record<string, React.ReactNode> = {
  Candy: <Candy size={24} />,
  Cookie: <Cookie size={24} />,
  Cylinder: <Cylinder size={24} />,
  Wind: <Wind size={24} />,
  ShoppingBag: <ShoppingBag size={24} />
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'store'>('home');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state 
  const [cart, setCart] = useState<{id: string, cartId: string, weight: number, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [location, setLocation] = useState<'Nalgonda' | 'Other'>('Nalgonda');
  const [toastMessage, setToastMessage] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', address: '', city: '', pin: '' });
  
  const addToCart = (id: string, weight: number = 250) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      setToastMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
    setCart(prev => {
      const cartId = `${id}-${weight}`;
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, cartId, weight, quantity: 1 }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item).filter(item => item.quantity > 0));
  };
  
  const cartItems = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return null;
    const multiplier = item.weight === 250 ? 1 : item.weight === 500 ? 2 : 4;
    return {
      ...item,
      product,
      calculatedPrice: product.price * multiplier,
      weightLabel: item.weight === 1000 ? '1 kg' : `${item.weight} gms`
    };
  }).filter(Boolean) as any[];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.calculatedPrice * item.quantity), 0);
  const totalWeightKg = cartItems.reduce((sum, item) => sum + ((item.weight * item.quantity) / 1000), 0);
  const chargeableWeightKg = totalWeightKg > 0 ? Math.ceil(totalWeightKg) : 0;
  const baseDelivery = location === 'Nalgonda' ? DELIVERY_CHARGE_NALGONDA : DELIVERY_CHARGE_OTHER;
  const perKgDeliveryCharge = location === 'Nalgonda' ? 0 : DELIVERY_CHARGE_PER_KG_OTHER;
  const weightDeliveryCharge = subtotal > 0 ? chargeableWeightKg * perKgDeliveryCharge : 0;
  const delivery = subtotal > 0 ? baseDelivery + weightDeliveryCharge : 0;
  const gst = subtotal > 0 ? Math.round((subtotal + delivery) * 0.12) : 0; // 12% GST on items + delivery
  const total = subtotal + delivery + gst;

  // Multi-panel layout logic
  const activeProducts = PRODUCTS.filter(p => {
    if (searchQuery) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return p.category === activeCategory;
  });

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToProduct = (id: string) => {
    productRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-cream text-brand-dark">
      <div className="sticky top-0 z-50 flex flex-col w-full">
        <TopAnnouncement />
        
        {/* Header */}
        <header className="border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center lg:flex-none lg:min-w-[15rem]">
            <button 
              className="mr-1 rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button onClick={() => { setCurrentView('home'); setSearchQuery(''); }} className="group flex min-w-0 items-center space-x-2 text-left">
              <span className="truncate text-lg font-display font-bold tracking-tight text-brand-red sm:text-2xl">Neelagiri <span className="text-brand-dark transition-colors group-hover:text-brand-red">Foods</span></span>
            </button>
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-4">
             <div className="flex w-full max-w-5xl items-center justify-center gap-1 xl:gap-4">
               <button onClick={() => { setCurrentView('home'); setSearchQuery(''); }} className={twMerge("text-[13px] xl:text-sm font-bold transition-all px-3 py-2 rounded-full whitespace-nowrap", currentView === 'home' && !searchQuery ? "text-brand-red bg-brand-red/5" : "text-gray-600 hover:text-brand-red hover:bg-gray-50")}>Home</button>
               {CATEGORIES.map(category => (
                 <button
                   key={category.id}
                   onClick={() => {
                     setActiveCategory(category.id as any);
                     setCurrentView('store');
                     setSearchQuery('');
                   }}
                   className={twMerge("text-[13px] xl:text-sm font-bold transition-all px-3 py-2 rounded-full whitespace-nowrap", currentView === 'store' && activeCategory === category.id && !searchQuery ? "text-brand-red bg-brand-red/5" : "text-gray-600 hover:text-brand-red hover:bg-gray-50")}
                 >
                   {category.name}
                 </button>
               ))}
               <button onClick={() => { setCurrentView('home'); setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="text-[13px] xl:text-sm font-bold transition-all px-3 py-2 rounded-full whitespace-nowrap text-gray-600 hover:text-brand-red hover:bg-gray-50">Contact Us</button>
             </div>
          </div>
          
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2 lg:min-w-[15rem] lg:flex-none">
            <div className="group relative flex items-center">
              <Search size={18} className="absolute left-3 text-gray-400 group-focus-within:text-brand-red transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setCurrentView('store');
                  }
                }}
                className="w-[100px] rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all placeholder:text-xs placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 xs:w-32 sm:w-48 sm:placeholder:text-sm lg:w-56"
              />
            </div>
            
            <button 
              className="relative ml-1 flex shrink-0 items-center justify-center rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 active:scale-95"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={22} className={cart.length > 0 ? "text-brand-red" : ""} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      </div>

      {/* Main Content Layout */}
      {currentView === 'home' ? (
        <HomePage 
          onNavigateToStore={() => setCurrentView('store')}
          onNavigateToCategory={(categoryId: string) => {
            setActiveCategory(categoryId as any);
            setCurrentView('store');
          }}
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
        />
      ) : (
      <main className="flex-1">
        {/* Content Area */}
        <div className="h-full px-4 pt-6 pb-20 scroll-smooth sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
            <div className="px-1 sm:px-2">
              <h2 className="text-2xl font-display font-bold text-brand-dark sm:text-3xl">
                {searchQuery ? `Search Results for "${searchQuery}"` : CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 sm:mt-2 sm:text-base">
                {searchQuery ? 'Showing products matching your search query.' : 'Discover authentic flavors prepared with love and tradition.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {activeProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={product.id}
                    ref={(el) => productRefs.current[product.id] = el}
                    className="h-full flex"
                  >
                    <ProductCard 
                      product={product} 
                      cart={cart} 
                      onAdd={addToCart} 
                      onRemove={removeFromCart} 
                      className="h-full w-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col pt-safe-top"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-brand-red">Neelagiri Foods</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setIsMobileMenuOpen(false);
                        }}
                        className={twMerge("w-full text-left px-4 py-3 rounded-xl transition-all font-medium", currentView === 'home' ? "bg-brand-red/10 text-brand-red" : "text-gray-700 active:bg-gray-50")}
                      >
                        Home
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('store');
                          setSearchQuery('');
                          setIsMobileMenuOpen(false);
                        }}
                        className={twMerge("w-full text-left px-4 py-3 rounded-xl transition-all font-medium", currentView === 'store' ? "bg-brand-red/10 text-brand-red" : "text-gray-700 active:bg-gray-50")}
                      >
                        Shop
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setIsMobileMenuOpen(false);
                          setTimeout(() => {
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-gray-700 active:bg-gray-50"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
                    <div className="space-y-1">
                      {CATEGORIES.map(category => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setActiveCategory(category.id as any);
                            setCurrentView('store');
                            setSearchQuery('');
                            setIsMobileMenuOpen(false);
                          }}
                          className={twMerge(
                            "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                            activeCategory === category.id ? "bg-brand-red/10 text-brand-red" : "text-gray-700 active:bg-gray-50"
                          )}
                        >
                          <span>{IconMap[category.icon] || <ShoppingBag size={20} />}</span>
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Products in {CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </h3>
                    <div className="space-y-1">
                      {activeProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => scrollToProduct(product.id)}
                          className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 active:text-brand-red transition-colors"
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-50 shadow-2xl flex flex-col pt-safe-top"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {checkoutStep !== 'cart' && (
                    <button onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'checkout' : 'cart')} className="mr-2 text-gray-500 hover:text-brand-red">←</button>
                  )}
                  <ShoppingBag size={24} className="text-brand-red" />
                  {checkoutStep === 'cart' ? 'Your Order' : checkoutStep === 'checkout' ? 'Delivery Details' : 'Secure Payment'}
                </h2>
                <button onClick={() => { setIsCartOpen(false); setTimeout(() => setCheckoutStep('cart'), 500); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
                {checkoutStep === 'cart' ? (
                  cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                      <ShoppingBag size={64} className="opacity-20" />
                      <p className="text-lg">Your basket is empty</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-brand-red font-medium hover:underline"
                      >
                        Start adding items
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.cartId} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                          <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-semibold text-sm line-clamp-1">{item.product.name} <span className="text-xs text-gray-500">({item.weightLabel})</span></h4>
                              <p className="text-brand-red font-bold text-sm">₹{item.calculatedPrice}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                <button onClick={() => removeFromCart(item.cartId)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-brand-red">-</button>
                                <span className="font-semibold w-8 text-center text-sm">{item.quantity}</span>
                                <button onClick={() => addToCart(item.id, item.weight)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-green-600">+</button>
                              </div>
                              <span className="font-semibold text-sm">₹{item.calculatedPrice * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : checkoutStep === 'checkout' ? (
                  <form className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm" onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }}>
                    <h3 className="font-bold text-gray-800 border-b pb-2">Where should we deliver?</h3>
                    <div className="space-y-3">
                      <input required value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})} type="text" placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                      <input
                        required
                        value={userDetails.phone}
                        onChange={e => setUserDetails({...userDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder="10-digit Phone Number"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none"
                      />
                      <textarea required value={userDetails.address} onChange={e => setUserDetails({...userDetails, address: e.target.value})} placeholder="Full Delivery Address" rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-brand-red outline-none resize-none"></textarea>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr] sm:gap-2">
                        <input required value={userDetails.city} onChange={e => setUserDetails({...userDetails, city: e.target.value})} type="text" placeholder="City" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                        <input required value={userDetails.pin} onChange={e => setUserDetails({...userDetails, pin: e.target.value})} type="text" placeholder="PIN Code" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold mt-4 hover:bg-black transition-colors">
                      Continue to Payment
                    </button>
                  </form>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Secure UPI Payment</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      Scan the QR code below using <span className="font-bold text-brand-dark">GPay, PhonePe, or Paytm</span>. 
                      The amount <span className="text-brand-red font-bold">₹{total}</span> will be pre-filled automatically.
                    </p>
                    
                    <div className="aspect-square w-full max-w-[16rem] bg-white border-4 border-brand-gold/20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden relative shadow-md p-3 sm:max-w-[18rem]">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=9014614826@ybl&pn=Neelagiri Foods&cu=INR&am=${total}&tn=Order from Neelagiri Foods`)}`} 
                        alt="UPI QR Code" 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                          <span className="text-[10px] font-bold text-blue-600">GPay</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm">
                          <span className="text-[10px] font-bold text-purple-600">PhonePe</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center border border-cyan-100 shadow-sm">
                          <span className="text-[10px] font-bold text-cyan-600">Paytm</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-green-50 p-3 rounded-lg text-green-800 text-xs font-semibold mb-6 flex items-center justify-center gap-2 border border-green-100">
                       <ShieldCheck size={16} className="text-green-600" />
                       Amount Pre-filled & Encrypted
                    </div>
                    <button onClick={() => { 
                      const numbers = ['919014614826', '917680976577'];
                      setToastMessage(`Notifying ${numbers.length} admins...`);
                      
                      let msg = `*New Order - Payment Completed!*\n\n`;
                      msg += `*Customer Details:*\nName: ${userDetails.name}\nPhone: ${userDetails.phone}\nAddress: ${userDetails.address}, ${userDetails.city} - ${userDetails.pin}\n\n`;
                      msg += `*Order Summary:*\n`;
                      cartItems.forEach(item => {
                        msg += `- ${item.product.name} (${item.weightLabel}) x${item.quantity}: ₹${item.calculatedPrice * item.quantity}\n`;
                      });
                      msg += `\n*Subtotal:* ₹${subtotal}\n*Delivery:* ₹${delivery}\n*GST (12%):* ₹${gst}\n*Grand Total Paid via UPI:* ₹${total}`;
                      
                      const fireWhatsApp = (num: string, delay: number) => {
                        setTimeout(() => {
                           const url = `https://api.whatsapp.com/send/?phone=${num}&text=${encodeURIComponent(msg)}`;
                           window.open(url, '_blank');
                        }, delay);
                      };

                      // Open first WhatsApp
                      fireWhatsApp(numbers[0], 100);
                      // Open second WhatsApp after a small gap to minimize popup blocking
                      fireWhatsApp(numbers[1], 1000);

                      setTimeout(() => { 
                        setIsCartOpen(false); 
                        setCart([]); 
                        setCheckoutStep('cart'); 
                        setUserDetails({ name: '', phone: '', address: '', city: '', pin: '' });
                        setTimeout(() => setToastMessage(''), 4000); 
                      }, 2500); 
                    }} className="w-full bg-brand-red text-white py-3 rounded-lg font-bold hover:bg-red-800 transition-colors shadow-md hover:shadow-lg">
                      I have completed the payment
                    </button>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-100 bg-white p-5 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                  <div className="space-y-2">
                    {checkoutStep === 'cart' && (
                      <div className="mb-2 flex items-center justify-between gap-3 border-b border-gray-100 pb-2 text-sm text-gray-600">
                        <span className="flex items-center gap-2"><MapPin size={16} /> Delivery Area</span>
                        <select 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value as any)}
                          className="w-[9rem] rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-right outline-none focus:border-brand-red"
                        >
                          <option value="Nalgonda">Nalgonda Dist</option>
                          <option value="Other">Other locations</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-2"><Truck size={14} /> Delivery Charge</span>
                      <span>₹{delivery}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Delivery rate</span>
                      <span>₹{baseDelivery} + ₹{perKgDeliveryCharge} x {chargeableWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total weight</span>
                      <span>{totalWeightKg.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-2">Tax (GST 12%)</span>
                      <span>₹{gst}</span>
                    </div>
                    <div className="pt-3 pb-1 border-t border-gray-200 flex justify-between font-bold text-xl mt-2">
                      <span>Grand Total</span>
                      <span className="text-brand-red">₹{total}</span>
                    </div>
                  </div>
                  {checkoutStep === 'cart' && (
                    <button onClick={() => setCheckoutStep('checkout')} className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-[0_4px_14px_rgba(139,0,0,0.3)] hover:scale-[1.02] hover:bg-red-800 transition-all duration-300">
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-[60] font-medium flex items-center gap-3 whitespace-nowrap"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm border border-green-400">✓</div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Icon */}
      <AnimatePresence>
        {!isCartOpen && (
          <motion.a 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            href="https://wa.me/919014614826?text=Hi%20Neelagiri%20Foods!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all z-40 flex items-center justify-center cursor-pointer"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon size={28} />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
