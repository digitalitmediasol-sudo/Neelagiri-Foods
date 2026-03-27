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
    <div className={twMerge("group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg", className)}>
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-brand-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Best Seller
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-lg font-bold leading-tight">{product.name}</h3>
          <span className="font-bold text-brand-red ml-2 whitespace-nowrap">₹{productPrice}</span>
        </div>
        <p className="mb-4 min-h-[2.5rem] text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto mb-4 flex shrink-0 rounded-lg border border-gray-100 bg-gray-50 p-1">
          {[250, 500, 1000].map(w => (
            <button 
              key={w}
              onClick={() => setWeight(w as any)}
              className={twMerge("flex-1 rounded-md px-1 py-1.5 text-center text-xs font-bold transition-colors", weight === w ? "border border-gray-100 bg-white text-brand-red shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              {w === 1000 ? '1 kg' : `${w} gms`}
            </button>
          ))}
        </div>

        {cartItem ? (
           <div className="mt-auto flex shrink-0 items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-1.5">
              <button onClick={() => onRemove(cartId)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-brand-red">-</button>
              <span className="font-semibold w-8 text-center">{cartItem.quantity}</span>
              <button onClick={() => onAdd(product.id, weight)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-green-600">+</button>
           </div>
        ) : (
           <button onClick={() => onAdd(product.id, weight)} className="mt-auto w-full shrink-0 rounded-lg bg-brand-red/10 py-2.5 font-semibold text-brand-red transition-colors duration-300 hover:bg-brand-red hover:text-white">
             Add to Cart
           </button>
        )}
      </div>
    </div>
  );
}
