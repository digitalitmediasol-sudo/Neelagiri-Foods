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
      <div className="relative flex min-h-[440px] items-center overflow-hidden px-4 py-20 text-white shadow-sm sm:min-h-[500px] sm:px-6 sm:py-24 md:py-32 lg:px-8 lg:py-36">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="relative z-10 mx-auto w-full max-w-7xl text-left lg:pl-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-5 max-w-xl text-3xl leading-tight font-display font-bold drop-shadow-lg sm:max-w-2xl sm:text-4xl md:text-5xl lg:text-7xl"
          >
            Excellence in Every Bite
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 max-w-lg text-base font-medium text-gray-100 drop-shadow-md sm:text-lg md:mb-10 md:text-xl"
          >
            Discover the authentic taste of tradition. We bring you the finest sweets, namkeen, and pickles made with pure ingredients and lots of love.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onNavigateToStore}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-base font-bold text-brand-dark shadow-xl shadow-black/20 transition-all hover:scale-105 hover:bg-yellow-400 sm:px-8 sm:py-3.5 sm:text-lg"
          >
            <ShoppingBag size={20} />
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Quotation Section */}
      <div className="border-b border-brand-red/5 bg-brand-cream/50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
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
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 text-2xl font-display font-bold text-brand-dark sm:text-3xl">Shop by Category</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 sm:gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onNavigateToCategory(category.id)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl"
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
                <h3 className="flex items-center justify-between text-base font-bold text-white sm:text-lg">
                  {category.name}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-gray-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="mb-4 text-2xl font-display font-bold text-brand-dark sm:text-3xl">Our Best Sellers</h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">The most loved delicacies by our customers. Handcrafted to perfection.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="border-t border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-20">
          
          {/* Left Side: Sweets Image */}
          <div className="relative flex w-full justify-center p-2 sm:p-4 lg:w-1/2 lg:justify-start lg:p-8">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/10 rounded-[3rem] -z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-brand-red/5 rounded-[3rem] -z-10 transform rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="relative z-10 w-full flex justify-center items-center"
            >
              <img src={CATEGORIES[0].image as string} alt="Sweets Tradition" className="aspect-square w-full max-w-[18rem] rounded-full border-8 border-white object-cover drop-shadow-2xl transition-transform duration-700 hover:scale-105 sm:max-w-md lg:max-w-lg" />
            </motion.div>
          </div>

          {/* Right Side: History Text */}
          <div className="flex w-full flex-col justify-center text-center lg:w-1/2 lg:text-left">
            <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
            >
              <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-3">Our Legacy</h4>
              <h2 className="mb-6 text-3xl leading-tight font-display font-bold text-brand-dark md:text-4xl lg:text-5xl">
                A Journey of Taste and Tradition
              </h2>
              <div className="mb-8 h-1 w-20 bg-brand-red lg:mx-0 mx-auto"></div>
              
              <p className="mb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
                The story of Neelagiri Foods began decades ago with a simple mission: to preserve and share the authentic cultural flavors exactly as they were celebrated by our ancestors. What started as a small, passionate endeavor has grown into a deeply rooted tradition of excellence.
              </p>
              <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
                Crafted meticulously using pure, premium ingredients and time-honored family recipes, our journey is built upon uncompromising quality. From grand festive celebrations to those everyday moments of joy, Neelagiri Foods continues to bring sweetness directly to the heart of your home.
              </p>
              
            </motion.div>
          </div>

        </div>
      </div>

      {/* Contact Banner Section */}
      <div id="contact" className="bg-brand-cream/30 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex flex-col items-stretch justify-between gap-6 rounded-2xl border border-brand-gold/20 bg-white p-6 shadow-lg sm:p-8 md:flex-row md:items-center md:gap-8 md:p-10"
          >
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-2xl text-brand-dark mb-2">Get in Touch</h3>
              <p className="text-gray-600 text-base md:text-lg">We'd love to hear from you. Contact us directly for bulk orders or any inquiries.</p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
              <a 
                href="https://wa.me/919014614826?text=Hi%20Neelagiri%20Foods!%20I%20have%20an%20inquiry%20regarding%20bulk%20orders." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-green-600 sm:w-auto sm:flex-1 md:flex-none"
              >
                WhatsApp Us
              </a>
              <a 
                href="tel:+919014614826" 
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-700 shadow-sm transition-colors hover:border-brand-red hover:text-brand-red sm:w-auto sm:flex-1 md:flex-none"
              >
                Call: +91 9014614826
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="border-t-4 border-brand-gold bg-brand-dark px-4 pt-14 pb-8 text-white sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
          {/* Brand Info (Left) */}
          <div className="order-2 text-center md:order-1 md:text-left">
            <h2 className="text-3xl font-display font-bold text-brand-gold mb-4">Neelagiri Foods</h2>
            <p className="mx-auto max-w-md leading-relaxed text-gray-400 md:mx-0">
              Bringing you the finest authentic Sweets, Namkeen, Pickles and Masalas made with pure ingredients, traditional recipes, and lots of love. Excellence in every bite.
            </p>
          </div>

          {/* Contact Details (Right) */}
          <div className="order-1 flex flex-col items-center text-center md:order-2 md:items-end md:text-right">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center gap-4 text-center text-gray-300 transition-colors hover:text-white md:justify-end md:text-right">
                <span className="mt-1 text-brand-gold text-xl shrink-0">📍</span>
                <span>Nalgonda & Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center justify-center gap-4 text-center text-gray-300 transition-colors hover:text-white md:justify-end md:text-right">
                <span className="text-brand-gold text-xl shrink-0">📞</span>
                <a href="tel:+919014614826" className="font-medium">+91 90146 14826</a>
              </li>
              <li className="flex items-center justify-center gap-4 text-center text-gray-300 transition-colors hover:text-white md:justify-end md:text-right">
                <span className="text-brand-gold text-xl shrink-0">📞</span>
                <a href="tel:+917680976577" className="font-medium">+91 76809 76577</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 border-t border-gray-800/50 pt-8 text-center text-sm text-gray-500 md:flex-row md:text-left">
          <p>&copy; {new Date().getFullYear()} Neelagiri Foods. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
             <button className="hover:text-brand-gold transition-colors">Privacy Policy</button>
             <button className="hover:text-brand-gold transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
