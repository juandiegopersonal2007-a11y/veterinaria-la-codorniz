'use client';

import { ShoppingCart, Star, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string | null;
  rating: number;
};

type CartItem = Product & { quantity: number };

const CATEGORIES = ['Todo', 'Alimentos', 'Cuidado', 'Accesorios', 'Juguetes'];

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '523131163103';

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    apiClient
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  /* ── Cart helpers ── */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ── WhatsApp checkout ── */
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const lines = cart.map(
      (i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
    );
    const message = [
      '¡Hola! Me gustaría encargar los siguientes productos:',
      '',
      ...lines,
      '',
      `*Total: $${totalPrice.toFixed(2)}*`,
      '',
      'Por favor indícame disponibilidad y forma de entrega. ¡Gracias!',
    ].join('\n');
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const filteredProducts =
    selectedCategory === 'Todo'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ffb700]/10 text-[#ffb700] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#ffb700]/20">
            <ShoppingCart size={14} />
            Nuestra Tienda
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#064e3b] mb-6 tracking-tight">
            Todo para tu Mascota
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Productos seleccionados con amor para el bienestar de tu compañero.
          </p>
        </div>

        {/* ── Category filter ── */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#064e3b] text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Products grid ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-8 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-6 bg-slate-100 rounded-full w-2/3" />
                  <div className="h-4 bg-slate-100 rounded-full w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-slate-500 py-20">
            No hay productos en esta categoría por ahora.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => {
              const inCart = cart.find((c) => c.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingCart size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#064e3b]">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={16} className="text-[#ffb700] fill-[#ffb700]" />
                      <span className="text-sm font-bold text-slate-600">{product.rating}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#064e3b] mb-2">{product.name}</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed text-sm">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-[#064e3b]">
                        ${product.price.toFixed(2)}
                      </span>

                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => changeQty(product.id, -1)}
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors font-bold"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-black text-lg text-[#064e3b]">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => changeQty(product.id, 1)}
                            className="w-9 h-9 rounded-xl bg-[#ffb700] hover:bg-[#ffa000] text-[#064e3b] flex items-center justify-center transition-colors font-bold"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#ffb700] hover:bg-[#ffa000] text-[#064e3b] font-black rounded-2xl px-6 py-3 flex items-center gap-2 transition-all hover:scale-105"
                        >
                          <ShoppingCart size={18} />
                          Añadir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Floating cart button ── */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-[#064e3b] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 font-bold hover:bg-[#053d2e] transition-all hover:scale-105"
        >
          <ShoppingCart size={22} />
          <span>Ver carrito</span>
          <span className="bg-[#ffb700] text-[#064e3b] rounded-full w-7 h-7 flex items-center justify-center text-sm font-black">
            {totalItems}
          </span>
        </button>
      )}

      {/* ── Cart drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Panel */}
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-black text-[#064e3b] flex items-center gap-2">
                <ShoppingCart size={24} /> Tu Carrito
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-400 py-12">El carrito está vacío.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#064e3b] truncate">{item.name}</p>
                      <p className="text-sm text-slate-500">${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white border hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-black">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white border hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-lg bg-white border hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">
                    {totalItems} producto{totalItems !== 1 ? 's' : ''}
                  </span>
                  <span className="text-3xl font-black text-[#064e3b]">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black text-lg py-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-200"
                >
                  <MessageCircle size={22} />
                  Encargar por WhatsApp
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Se abrirá WhatsApp con tu pedido listo para enviar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
