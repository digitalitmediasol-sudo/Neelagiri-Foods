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
const DELIVERY_CHARGE_OTHER = 200;

// Top Announcement
const TopAnnouncement = () => (
  <div className="bg-green-600 text-white py-2 px-4 text-center text-sm font-medium">
    <p>Sri Rama Navami Subhakankshalu! Celebrate with Neelagiri Foods!</p>
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
  const delivery = subtotal > 0 ? (location === 'Nalgonda' ? DELIVERY_CHARGE_NALGONDA : DELIVERY_CHARGE_OTHER) : 0;
  const gst = subtotal > 0 ? Math.round(subtotal * 0.12) : 0; // 12% GST
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
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md mr-1 lg:mr-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button onClick={() => { setCurrentView('home'); setSearchQuery(''); }} className="text-2xl font-display font-bold text-brand-red hidden xl:block whitespace-nowrap">
              Neelagiri Foods
            </button>
            <button onClick={() => { setCurrentView('home'); setSearchQuery(''); }} className="text-xl font-display font-bold text-brand-red xl:hidden whitespace-nowrap">
              Neelagiri Foods
            </button>
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center items-center px-2 w-full">
             <div className="flex items-center justify-around w-full max-w-4xl space-x-2 xl:space-x-4">
               <button onClick={() => { setCurrentView('home'); setSearchQuery(''); }} className={twMerge("text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap", currentView === 'home' && !searchQuery ? "text-brand-red" : "text-gray-600 hover:text-brand-red")}>Home</button>
               {CATEGORIES.map(category => (
                 <button
                   key={category.id}
                   onClick={() => {
                     setActiveCategory(category.id as any);
                     setCurrentView('store');
                     setSearchQuery('');
                   }}
                   className={twMerge("text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap", currentView === 'store' && activeCategory === category.id && !searchQuery ? "text-brand-red" : "text-gray-600 hover:text-brand-red")}
                 >
                   {category.name}
                 </button>
               ))}
               <button onClick={() => { setCurrentView('home'); setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap text-gray-600 hover:text-brand-red">Contact Us</button>
             </div>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <div className="hidden sm:flex relative items-center">
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
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red w-32 md:w-48 xl:w-56 transition-all bg-gray-50 placeholder-gray-400"
              />
              <Search size={16} className="absolute left-3 text-gray-400" />
            </div>
            
            <button 
              className="p-2 relative text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center shrink-0 ml-1"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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
      <main className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-500">
                {searchQuery ? 'Showing products matching your search query.' : 'Discover authentic flavors prepared with love and tradition.'}
              </p>
            </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                      <input required value={userDetails.phone} onChange={e => setUserDetails({...userDetails, phone: e.target.value})} type="tel" placeholder="Phone Number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                      <textarea required value={userDetails.address} onChange={e => setUserDetails({...userDetails, address: e.target.value})} placeholder="Full Delivery Address" rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-brand-red outline-none resize-none"></textarea>
                      <div className="flex gap-2">
                        <input required value={userDetails.city} onChange={e => setUserDetails({...userDetails, city: e.target.value})} type="text" placeholder="City" className="w-2/3 border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                        <input required value={userDetails.pin} onChange={e => setUserDetails({...userDetails, pin: e.target.value})} type="text" placeholder="PIN Code" className="w-1/3 border border-gray-200 rounded-lg px-3 py-2.5 focus:border-brand-red outline-none" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold mt-4 hover:bg-black transition-colors">
                      Continue to Payment
                    </button>
                  </form>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Pay via UPI</h3>
                    <p className="text-gray-500 text-sm mb-6">Scan the QR code using any UPI app to safely complete your payment.</p>
                    <div className="w-64 h-64 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative shadow-inner p-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=9014614826@ybl&pn=Neelagiri Foods&cu=INR&am=${total}`)}`} 
                        alt="UPI QR Code" 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                    </div>
                    <div className="w-full bg-green-50 p-3 rounded-lg text-green-800 text-sm font-semibold mb-6 flex items-center justify-center gap-2">
                       <ShieldCheck size={18} className="text-green-600" />
                       Accepted: GPay, PhonePe, Paytm
                    </div>
                    <button onClick={() => { 
                      let msg = `*New Order - Payment Completed!*\n\n`;
                      msg += `*Customer Details:*\nName: ${userDetails.name}\nPhone: ${userDetails.phone}\nAddress: ${userDetails.address}, ${userDetails.city} - ${userDetails.pin}\n\n`;
                      msg += `*Order Summary:*\n`;
                      cartItems.forEach(item => {
                        msg += `- ${item.product.name} (${item.weightLabel}) x${item.quantity}: ₹${item.calculatedPrice * item.quantity}\n`;
                      });
                      msg += `\n*Subtotal:* ₹${subtotal}\n*Delivery:* ₹${delivery}\n*GST (12%):* ₹${gst}\n*Grand Total Paid via UPI:* ₹${total}\n\n_Please find my payment screenshot attached._`;
                      
                      const waUrl = `https://wa.me/919014614826?text=${encodeURIComponent(msg)}`;
                      window.open(waUrl, '_blank');
                      
                      setIsCartOpen(false); 
                      setTimeout(() => { 
                        setCart([]); 
                        setCheckoutStep('cart'); 
                        setUserDetails({ name: '', phone: '', address: '', city: '', pin: '' });
                        setToastMessage('Order sent to WhatsApp!'); 
                        setTimeout(() => setToastMessage(''), 4000); 
                      }, 500); 
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
                      <div className="flex items-center justify-between text-sm text-gray-600 pb-2 border-b border-gray-100 mb-2">
                        <span className="flex items-center gap-2"><MapPin size={16} /> Delivery Area</span>
                        <select 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value as any)}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-brand-red"
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
