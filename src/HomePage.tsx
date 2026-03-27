import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS, CATEGORIES } from './constants';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import heroBg from './assest/hero_sweets_bowl.png';
import ProductCard from './ProductCard';

interface HomePageProps {
  onNavigateToStore: () => void;
  onNavigateToCategory: (categoryId: string) => void;
  cart: any[];
  onAdd: (id: string, weight: number) => void;
  onRemove: (cartId: string) => void;
}

export default function HomePage({ onNavigateToStore, onNavigateToCategory, cart, onAdd, onRemove }: HomePageProps) {
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative text-white py-28 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-sm flex items-center min-h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10 text-left pl-0 lg:pl-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 max-w-2xl drop-shadow-lg leading-tight"
          >
            Excellence in Every Bite
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-xl mb-10 text-gray-100 font-medium drop-shadow-md"
          >
            Discover the authentic taste of tradition. We bring you the finest sweets, namkeen, and pickles made with pure ingredients and lots of love.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onNavigateToStore}
            className="bg-brand-gold text-brand-dark px-8 py-3.5 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 shadow-xl shadow-black/20 transition-all flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Quotation Section */}
      <div className="bg-brand-cream/50 py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-red/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <span className="text-4xl sm:text-8xl text-brand-gold/20 absolute -top-4 sm:-top-10 md:-left-8 font-serif select-none pointer-events-none">"</span>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-medium text-brand-red leading-relaxed italic z-10 relative px-2 sm:px-4 md:px-12">
              Our passion lies in preserving the authentic taste of tradition. Every bite is an experience crafted with purity, devotion, and a legacy that spans generations.
            </p>
            <span className="text-4xl sm:text-8xl text-brand-gold/20 absolute -bottom-8 sm:-bottom-16 md:-right-8 font-serif select-none pointer-events-none rotate-180">"</span>
            
            <div className="mt-10 flex flex-col items-center">
              <div className="w-12 h-1 bg-brand-gold mb-4 rounded-full"></div>
              <h3 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-widest">Founder, Neelagiri Foods</h3>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Shop by Category</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onNavigateToCategory(category.id)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              {typeof category.image === 'string' ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-brand-red/10 flex items-center justify-center">
                   <ShoppingBag size={48} className="text-brand-red opacity-50" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg flex justify-between items-center">
                  {category.name}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Our Best Sellers</h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">The most loved delicacies by our customers. Handcrafted to perfection.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col h-full"
              >
                <ProductCard 
                  product={product} 
                  cart={cart} 
                  onAdd={onAdd} 
                  onRemove={onRemove} 
                  className="h-full w-full"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
             <button
                onClick={onNavigateToStore}
                className="inline-flex items-center gap-2 text-brand-red font-bold hover:text-red-800 transition-colors"
             >
                View full menu <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Sweets Image */}
          <div className="w-full lg:w-1/2 relative p-4 lg:p-8">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/10 rounded-[3rem] -z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-brand-red/5 rounded-[3rem] -z-10 transform rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="relative z-10 w-full flex justify-center items-center"
            >
              <img src={CATEGORIES[0].image as string} alt="Sweets Tradition" className="w-full max-w-md lg:max-w-lg aspect-square object-cover rounded-full drop-shadow-2xl hover:scale-105 transition-transform duration-700 border-8 border-white" />
            </motion.div>
          </div>

          {/* Right Side: History Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
            >
              <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-3">Our Legacy</h4>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-dark mb-6 leading-tight">
                A Journey of Taste and Tradition
              </h2>
              <div className="w-20 h-1 bg-brand-red mb-8"></div>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                The story of Neelagiri Foods began decades ago with a simple mission: to preserve and share the authentic cultural flavors exactly as they were celebrated by our ancestors. What started as a small, passionate endeavor has grown into a deeply rooted tradition of excellence.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Crafted meticulously using pure, premium ingredients and time-honored family recipes, our journey is built upon uncompromising quality. From grand festive celebrations to those everyday moments of joy, Neelagiri Foods continues to bring sweetness directly to the heart of your home.
              </p>
              
            </motion.div>
          </div>

        </div>
      </div>

      {/* Contact Banner Section */}
      <div id="contact" className="bg-brand-cream/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white p-8 md:p-10 rounded-2xl border border-brand-gold/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-2xl text-brand-dark mb-2">Get in Touch</h3>
              <p className="text-gray-600 text-base md:text-lg">We'd love to hear from you. Contact us directly for bulk orders or any inquiries.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a 
                href="https://wa.me/919014614826?text=Hi%20Neelagiri%20Foods!%20I%20have%20an%20inquiry%20regarding%20bulk%20orders." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex flex-1 sm:flex-none w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:bg-green-600 hover:scale-105 transition-transform whitespace-nowrap"
              >
                WhatsApp Us
              </a>
              <a 
                href="tel:+919014614826" 
                className="inline-flex flex-1 sm:flex-none w-full sm:w-auto items-center justify-center bg-white border-2 border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-bold shadow-sm hover:border-brand-red hover:text-brand-red whitespace-nowrap transition-colors"
              >
                Call: +91 9014614826
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-brand-dark text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t-4 border-brand-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Info (Left) */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-display font-bold text-brand-gold mb-4">Neelagiri Foods</h2>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Bringing you the finest authentic Sweets, Namkeen, Pickles and Masalas made with pure ingredients, traditional recipes, and lots of love. Excellence in every bite.
            </p>
          </div>

          {/* Contact Details (Right) */}
          <div className="order-1 md:order-2 md:text-right flex flex-col md:items-end">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start md:justify-end gap-4 text-gray-300 hover:text-white transition-colors text-right">
                <span className="mt-1 text-brand-gold text-xl shrink-0">📍</span>
                <span>Nalgonda, Telangana, India</span>
              </li>
              <li className="flex items-center md:justify-end gap-4 text-gray-300 hover:text-white transition-colors text-right">
                <span className="text-brand-gold text-xl shrink-0">📞</span>
                <a href="tel:+919014614826" className="font-medium">+91 90146 14826</a>
              </li>
              <li className="flex items-center md:justify-end gap-4 text-gray-300 hover:text-white transition-colors text-right">
                <span className="text-brand-gold text-xl shrink-0">📞</span>
                <a href="tel:+917680976577" className="font-medium">+91 76809 76577</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Neelagiri Foods. All rights reserved.</p>
          <div className="flex gap-4">
             <button className="hover:text-brand-gold transition-colors">Privacy Policy</button>
             <button className="hover:text-brand-gold transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
