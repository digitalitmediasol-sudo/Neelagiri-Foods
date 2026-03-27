import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isBestSeller?: boolean;
  category: string;
}

interface ProductCardProps {
  product: Product;
  cart: any[];
  onAdd: (id: string, weight: number) => void;
  onRemove: (cartId: string) => void;
  className?: string;
}

export default function ProductCard({ product, cart, onAdd, onRemove, className = "" }: ProductCardProps) {
  const [weight, setWeight] = useState<250 | 500 | 1000>(250);
  const weightLabel = weight === 1000 ? '1 kg' : `${weight} gms`;
  const multiplier = weight === 250 ? 1 : weight === 500 ? 2 : 4;
  const productPrice = product.price * multiplier;
  const cartId = `${product.id}-${weight}`;
  const cartItem = cart.find(c => c.cartId === cartId);

  return (
    <div className={twMerge("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col", className)}>
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-brand-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Best Seller
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight flex-1">{product.name}</h3>
          <span className="font-bold text-brand-red ml-2 whitespace-nowrap">₹{productPrice}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex bg-gray-50 rounded-lg p-1 mb-4 mt-auto border border-gray-100 shrink-0">
          {[250, 500, 1000].map(w => (
            <button 
              key={w}
              onClick={() => setWeight(w as any)}
              className={twMerge("flex-1 py-1.5 text-xs font-bold rounded-md transition-colors", weight === w ? "bg-white text-brand-red shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700")}
            >
              {w === 1000 ? '1 kg' : `${w} gms`}
            </button>
          ))}
        </div>

        {cartItem ? (
           <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5 border border-gray-100 mt-auto shrink-0">
              <button onClick={() => onRemove(cartId)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-brand-red">-</button>
              <span className="font-semibold w-8 text-center">{cartItem.quantity}</span>
              <button onClick={() => onAdd(product.id, weight)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-green-600">+</button>
           </div>
        ) : (
           <button onClick={() => onAdd(product.id, weight)} className="w-full py-2.5 bg-brand-red/10 text-brand-red font-semibold rounded-lg hover:bg-brand-red hover:text-white transition-colors duration-300 mt-auto shrink-0">
             Add to Cart
           </button>
        )}
      </div>
    </div>
  );
}
