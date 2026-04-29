/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  CheckCircle2, 
  Award, 
  Truck, 
  Star, 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Quote,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';

// --- Types ---

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  size: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Timestamp | null;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Timestamp | null;
}

// --- Components ---

const Navbar = ({ cartCount, onCartClick, isAdminView, onToggleView }: { 
  cartCount: number, 
  onCartClick: () => void,
  isAdminView: boolean,
  onToggleView: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAdminView ? [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Orders', href: '#orders' },
    { name: 'Messages', href: '#messages' },
  ] : [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isAdminView ? 'glass py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-aqua" />
            <span className="text-2xl font-bold font-serif text-white">
              Arsh Aqua
            </span>
          </a>
          {isAdminView && (
            <span className="bg-aqua/20 text-aqua px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-aqua/30">
              Admin Portal
            </span>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-aqua text-white/80 uppercase tracking-wider"
            >
              {link.name}
            </a>
          ))}
          
          {!isAdminView ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={onCartClick}
                className="relative p-2 text-white hover:text-aqua transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-aqua text-navy text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={onToggleView}
                className="text-white/20 hover:text-white transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  if (cartCount > 0) {
                    onCartClick();
                  } else {
                    const el = document.getElementById('products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-aqua hover:bg-aqua/90 text-navy px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 uppercase"
              >
                Order Now
              </button>
            </div>
          ) : (
            <button 
              onClick={onToggleView}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Exit Admin</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-navy"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-navy' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-navy' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 w-full shadow-xl py-6 px-6 md:hidden flex flex-col gap-4 ${isAdminView ? 'glass' : 'bg-white'}`}
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium py-2 border-b transition-colors ${
                  isAdminView ? 'text-white border-white/10 hover:text-aqua' : 'text-navy/80 hover:text-aqua border-gray-100'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {!isAdminView ? (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (cartCount > 0) {
                    onCartClick();
                  } else {
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-aqua text-white py-4 rounded-xl font-bold mt-2 uppercase"
              >
                Order Now
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleView();
                }}
                className="bg-red-500/20 text-red-500 py-4 rounded-xl font-bold mt-2 uppercase border border-red-500/30"
              >
                Exit Admin
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-navy">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-aqua/20" />
        <img 
          src="https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=2000" 
          alt="Water Texture" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Drink Pure. <br />
            <span className="text-aqua">Live Better.</span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
            Arsh Aqua delivers nature's finest mineral water — untouched, uncompromised, unforgettable. Experience the essence of purity in every drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-aqua hover:bg-aqua/90 text-navy px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-aqua/20"
            >
              Shop Now
            </button>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-aqua hover:bg-aqua/10 text-aqua px-10 py-4 rounded-full text-lg font-bold transition-all"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md">
            {/* Floating Water Drop Animation / Mockup */}
            <div className="animate-float relative z-10">
              <img 
                src="https://placehold.co/400x800/00B4D8/FFFFFF?text=Arsh+Aqua+Bottle" 
                alt="Arsh Aqua Bottle" 
                className="w-full max-w-[280px] mx-auto drop-shadow-[0_35px_35px_rgba(0,180,216,0.3)]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-aqua/10 rounded-full blur-3xl -z-10" />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-aqua/20 rounded-full blur-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TrustBar = () => {
  const signals = [
    { icon: <CheckCircle2 className="w-5 h-5 text-aqua" />, text: "100% Natural Minerals" },
    { icon: <Droplets className="w-5 h-5 text-aqua" />, text: "BPA-Free Bottles" },
    { icon: <Award className="w-5 h-5 text-aqua" />, text: "ISO Certified" },
    { icon: <Truck className="w-5 h-5 text-aqua" />, text: "Fast Delivery" },
    { icon: <Star className="w-5 h-5 text-aqua" />, text: "10,000+ Happy Customers" },
  ];

  return (
    <div className="trust-bar-bg py-6 border-y border-white/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
          {signals.map((signal, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 whitespace-nowrap opacity-70"
            >
              {signal.icon}
              <span className="text-xs font-semibold text-white uppercase tracking-wider">{signal.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-navy/50">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000" 
              alt="Mountain Spring" 
              className="w-full h-[600px] object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 glass p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
            <h4 className="text-white font-serif text-xl mb-2">Our Mission</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              To provide the purest hydration experience while preserving our natural sources and promoting sustainable living for generations to come.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Born from the Mountains, <br />
            <span className="text-aqua">Made for You</span>
          </h2>
          <div className="space-y-6 text-white/70 text-lg leading-relaxed">
            <p>
              Arsh Aqua began with a simple discovery: a pristine underground spring tucked away in the heart of the majestic mountain ranges. Untouched by human activity, this water was naturally enriched with essential minerals.
            </p>
            <p>
              We believe that water is the foundation of life. That's why we've dedicated ourselves to bringing this pure, mountain-born hydration directly to your doorstep without compromising its natural integrity.
            </p>
            <p>
              Our multi-stage filtration process ensures zero contaminants while carefully balancing the mineral content to provide a crisp, refreshing taste that fuels your body and mind.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-aqua/20 flex items-center justify-center">
              <ShieldCheck className="text-aqua w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white">Quality Guaranteed</h5>
              <p className="text-sm text-white/60">Every bottle undergoes 50+ rigorous tests.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Products = ({ products, onAddToCart }: { products: Product[], onAddToCart: (product: Product) => void }) => {
  return (
    <section id="products" className="py-24 bg-navy/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Purity in Every Size</h2>
          <p className="text-white/60 text-lg">Choose the perfect Arsh Aqua companion for your lifestyle.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass rounded-3xl p-6 shadow-xl group"
            >
              <div className="bg-white/5 rounded-2xl overflow-hidden mb-6 aspect-[3/4] flex items-center justify-center relative">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="bg-aqua text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg uppercase"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold text-aqua">Rs. {product.price}</span>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="bg-white text-navy hover:bg-aqua hover:text-white p-3 rounded-xl transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const features = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Natural Source Minerals",
      desc: "Naturally enriched with magnesium, calcium, and potassium from deep mountain springs."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Zero Contaminants",
      desc: "Our advanced multi-stage purification removes 99.9% of impurities while keeping minerals."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly Packaging",
      desc: "100% recyclable bottles and sustainable sourcing practices to protect our planet."
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: "Rigorous Quality Testing",
      desc: "Tested hourly in our state-of-the-art labs to ensure consistent purity and taste."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Affordable Pricing",
      desc: "Premium quality shouldn't break the bank. We offer the best value for your health."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Doorstep Delivery",
      desc: "Convenient subscription and one-time delivery options straight to your home or office."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-navy text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-aqua/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-aqua/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">The Arsh Advantage</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Arsh Aqua?</h2>
          <p className="text-white/60 text-lg">We go beyond simple filtration to provide a superior hydration experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-dark p-8 rounded-3xl hover:border-aqua/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-aqua/20 rounded-2xl flex items-center justify-center mb-6 text-aqua group-hover:bg-aqua group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Source",
      desc: "Extracted from natural underground springs deep within the mountains.",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      num: "02",
      title: "Purify",
      desc: "Multi-stage filtration & mineral balancing for perfect taste and health.",
      icon: <FlaskConical className="w-6 h-6" />
    },
    {
      num: "03",
      title: "Deliver",
      desc: "Bottled in BPA-free containers and delivered straight to your door.",
      icon: <Truck className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-24 bg-navy/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">Our Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">From Spring to Your Table</h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 glass border-2 border-aqua/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg relative">
                  <div className="absolute -top-2 -right-2 bg-aqua text-navy text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {step.num}
                  </div>
                  <div className="text-aqua">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-white/60 max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      city: "New York",
      text: "The taste is incredibly crisp and clean. I've tried many premium brands, but Arsh Aqua is consistently the best. Their delivery service is also top-notch!",
      rating: 5
    },
    {
      name: "Michael Chen",
      city: "San Francisco",
      text: "As an athlete, hydration is key. Arsh Aqua's mineral balance makes a noticeable difference in how I feel during workouts. Highly recommended for health-conscious folks.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      city: "Miami",
      text: "We use the 5-gallon dispenser for our office, and everyone loves it. The water tastes natural and fresh. Plus, the glass bottles are beautiful for client meetings.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-navy/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[2rem] relative shadow-2xl"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-aqua/10" />
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-aqua text-aqua" />
                ))}
              </div>
              <p className="text-white/90 italic text-lg mb-8 leading-relaxed">"{review.text}"</p>
              <div>
                <h4 className="font-bold text-white">{review.name}</h4>
                <p className="text-sm text-white/50">{review.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { value: 10000, suffix: "+", label: "Customers" },
    { value: 5, suffix: "", label: "Cities Served" },
    { value: 99.9, suffix: "%", label: "Purity Rate" },
    { value: 3, suffix: "+", label: "Years Excellence" }
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="stat-box-bg p-8 rounded-2xl text-center border border-white/5"
            >
              <div className="text-3xl md:text-5xl font-bold text-aqua mb-2">
                <Counter value={stat.value} />{stat.suffix}
              </div>
              <p className="text-white/40 font-semibold uppercase tracking-widest text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}: { 
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-navy border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-2xl font-bold font-serif text-white">Your Basket</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-10 h-10 text-white/20" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Basket is empty</h4>
                  <p className="text-white/40 mb-8">Start adding some pure hydration to your basket.</p>
                  <button 
                    onClick={onClose}
                    className="bg-aqua text-navy px-8 py-3 rounded-full font-bold uppercase transition-transform hover:scale-105"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 glass rounded-2xl relative group">
                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0">
                      <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{item.product.name}</h4>
                      <p className="text-aqua font-bold text-sm mb-3">Rs. {item.product.price}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:text-aqua transition-colors text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:text-aqua transition-colors text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60 font-medium">Subtotal</span>
                  <span className="text-3xl font-bold text-white">Rs. {total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-aqua hover:bg-white text-navy py-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-aqua/20 active:scale-[0.98] uppercase tracking-widest"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start * 10) / 10);
            }
          }, 16);
          
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{count}</span>;
};

interface CheckoutData {
  name: string;
  phone: string;
  address: string;
}

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  total, 
  onSubmit, 
  isSubmitting 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  total: number;
  onSubmit: (data: CheckoutData) => void;
  isSubmitting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-navy border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-white">Checkout</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="mb-6 p-4 bg-white/5 rounded-2xl flex justify-between items-center">
          <span className="text-white/60">Order Total:</span>
          <span className="text-2xl font-bold text-aqua">Rs. {total}</span>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(Object.fromEntries(formData) as unknown as CheckoutData);
        }} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" required className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-aqua transition-all" />
          <input name="phone" type="tel" placeholder="Phone Number" required className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-aqua transition-all" />
          <textarea name="address" placeholder="Delivery Address" required className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-aqua transition-all h-24 resize-none" />
          <p className="text-xs text-white/40 italic">* You will be redirected to WhatsApp to confirm your order details.</p>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-aqua text-navy py-5 rounded-2xl font-bold text-lg transition-all hover:bg-white active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Order via WhatsApp'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const CTABanner = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-navy via-navy/90 to-aqua/40 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-aqua/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-aqua/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Make the Switch to Pure?</h2>
            <p className="text-xl text-white/70 mb-10">Free delivery on your first order. Join thousands of health-conscious families today.</p>
            <button 
              onClick={() => {
                const el = document.getElementById('products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-aqua text-navy hover:bg-white px-12 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl uppercase"
            >
              Order Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface ContactData {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

const Contact = ({ onSendMessage }: { onSendMessage: (data: ContactData) => Promise<void> }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as unknown as ContactData;
    try {
      await onSendMessage(data);
      setIsSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSent(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-aqua font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Have Questions? <br /> We're Here to Help.</h2>
            <p className="text-white/60 text-lg mb-12">Whether you need a one-time delivery or a custom subscription for your office, our team is ready to assist you.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-aqua shrink-0 border border-white/10">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Call Us</h4>
                  <p className="text-white/50">+92 (321)-9084365</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-aqua shrink-0 border border-white/10">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Email Us</h4>
                  <p className="text-white/50">irfankhan2026@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-aqua shrink-0 border border-white/10">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Visit Us</h4>
                  <p className="text-white/50">Arsh Aqua Water Plant, Faqir Kaly, Peshawar.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="John Doe" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Phone Number</label>
                <input 
                  name="phone"
                  type="tel" 
                  required
                  placeholder="+92 (321)-9084365" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Your Message</label>
                <textarea 
                  name="message"
                  rows={4} 
                  required
                  placeholder="How can we help you?" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20 resize-none"
                />
              </div>
              <p className="text-xs text-white/40 italic">* We'll redirect you to WhatsApp for a faster response.</p>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-aqua hover:bg-white text-navy py-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-aqua/20 active:scale-[0.98] uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : isSent ? 'Message Sent!' : 'Send Message via WhatsApp'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <Droplets className="w-8 h-8 text-aqua" />
              <span className="text-2xl font-bold font-serif">Arsh Aqua</span>
            </a>
            <p className="text-white/50 leading-relaxed mb-8">
              Pure from the Source. Perfect for Life. Delivering nature's finest mineral water to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aqua transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aqua transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-aqua transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-white/50 hover:text-aqua transition-colors">Home</a></li>
              <li><a href="#about" className="text-white/50 hover:text-aqua transition-colors">About Us</a></li>
              <li><a href="#products" className="text-white/50 hover:text-aqua transition-colors">Products</a></li>
              <li><a href="#why-us" className="text-white/50 hover:text-aqua transition-colors">Why Choose Us</a></li>
              <li><a href="#contact" className="text-white/50 hover:text-aqua transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-aqua transition-colors">FAQs</a></li>
              <li><a href="#" className="text-white/50 hover:text-aqua transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-aqua transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-aqua transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Newsletter</h4>
            <p className="text-white/50 mb-6">Subscribe to get special offers and health tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-aqua transition-all w-full"
              />
              <button className="bg-aqua p-3 rounded-xl hover:bg-aqua/90 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 text-center text-white/30 text-sm">
          <p>© {new Date().getFullYear()} Arsh Aqua. | +92 (321)-9084365 | irfankhan2026@gmail.com</p>
          <p className="mt-2">Arsh Aqua Water Plant, Faqir Kaly, Peshawar.</p>
        </div>
      </div>
    </footer>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'messages'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Real-time Orders Listener
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setIsLoading(false);
    }, (err) => {
      console.error("Orders listener error:", err);
      setIsLoading(false);
    });

    // Real-time Messages Listener
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (err) => {
      console.error("Messages listener error:", err);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeMessages();
    };
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-navy/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-serif tracking-tight">Admin Console</h1>
            <p className="text-white/50">Real-time business overview and customer management.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-aqua text-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'orders' ? 'bg-aqua text-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'messages' ? 'bg-aqua text-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Messages
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-aqua/20 border-t-aqua rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab}
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass p-8 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-aqua/20 rounded-2xl flex items-center justify-center text-aqua mb-6">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h4 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-1">Total Revenue</h4>
                  <p className="text-3xl font-bold text-white">Rs. {totalRevenue.toLocaleString()}</p>
                </div>
                
                <div className="glass p-8 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-500 mb-6">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h4 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-1">Total Orders</h4>
                  <p className="text-3xl font-bold text-white">{orders.length}</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-1">New Messages</h4>
                  <p className="text-3xl font-bold text-white">{messages.length}</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-1">Conversion Rate</h4>
                  <p className="text-3xl font-bold text-white">
                    {orders.length > 0 ? ((orders.length / (orders.length + messages.length + 10)) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Order History</h3>
                  <button className="text-aqua text-sm font-bold hover:underline">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-8 py-5 text-white/50 font-bold uppercase text-xs tracking-widest">Customer</th>
                        <th className="px-8 py-5 text-white/50 font-bold uppercase text-xs tracking-widest">Items</th>
                        <th className="px-8 py-5 text-white/50 font-bold uppercase text-xs tracking-widest">Total</th>
                        <th className="px-8 py-5 text-white/50 font-bold uppercase text-xs tracking-widest">Date</th>
                        <th className="px-8 py-5 text-white/50 font-bold uppercase text-xs tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-white">{order.customerName}</div>
                            <div className="text-white/40 text-xs">{order.customerPhone}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-white/70 text-sm">
                              {order.items?.length || 0} Products
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-bold text-aqua">Rs. {order.total}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-white/50 text-sm">
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                              {order.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-white/30 italic">No orders found yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="grid gap-6">
                {messages.map(msg => (
                  <div key={msg.id} className="glass p-8 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-aqua/20 rounded-full flex items-center justify-center text-aqua">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{msg.name}</h4>
                          <p className="text-white/40 text-sm">{msg.phone} • {msg.email}</p>
                        </div>
                      </div>
                      <span className="text-white/20 text-xs uppercase tracking-widest font-bold">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-white/70 leading-relaxed italic">
                      "{msg.message}"
                    </div>
                    <div className="mt-6 flex justify-end">
                      <a 
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        className="flex items-center gap-2 text-aqua hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply via WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="glass p-20 rounded-3xl text-center text-white/30 italic">No messages received yet.</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('price', 'asc'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (productsData.length === 0) {
          // Seed initial data if empty
          const initialProducts = [
            { name: "Arsh Aqua 500ml", desc: "Perfect for on-the-go hydration. Compact and refreshing.", price: 50, img: "https://images.unsplash.com/photo-1551613204-206e84d43636?q=80&w=600", size: "500ml" },
            { name: "Arsh Aqua 1.5L", desc: "Ideal for your daily hydration needs at home or office.", price: 100, img: "https://images.unsplash.com/photo-1616118132283-360706790513?q=80&w=600", size: "1.5L" },
            { name: "5-Gallon Dispenser", desc: "Premium mineral water for families and large offices.", price: 400, img: "https://images.unsplash.com/photo-1559839914-17aae19cea9e?q=80&w=600", size: "19L" },
            { name: "Premium Glass Edition", desc: "Elegant 750ml glass bottle for fine dining experiences.", price: 350, img: "https://images.unsplash.com/photo-1548919973-5da5ad0dc946?q=80&w=600", size: "750ml" }
          ];
          
          try {
            for (const prod of initialProducts) {
              await addDoc(collection(db, 'products'), prod);
            }
            // After seeding, fetch again
            const qAfter = query(collection(db, 'products'), orderBy('price', 'asc'));
            const snapAfter = await getDocs(qAfter);
            setProducts(snapAfter.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
          } catch (seedErr) {
            handleFirestoreError(seedErr, OperationType.WRITE, 'products');
          }
        } else {
          setProducts(productsData);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = async (formData: CheckoutData) => {
    setIsSubmittingOrder(true);
    try {
      const orderTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
      // Construct WhatsApp message
      const itemsList = cart.map(item => `- ${item.product.name} x${item.quantity} (Rs. ${item.product.price * item.quantity})`).join('%0A');
      const message = `*New Order from Arsh Aqua*%0A%0A` +
        `*Customer Details:*%0A` +
        `Name: ${formData.name}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Address: ${formData.address}%0A%0A` +
        `*Order Items:*%0A${itemsList}%0A%0A` +
        `*Total Amount: Rs. ${orderTotal}*%0A%0A` +
        `Please confirm my order. Thank you!`;
      
      const whatsappUrl = `https://wa.me/923219084365?text=${message}`;

      // Save to Firebase (Record for owner)
      await addDoc(collection(db, 'orders'), {
        customerName: formData.name,
        customerPhone: formData.phone,
        address: formData.address,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: orderTotal,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Clear cart and close modals
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      alert('Thank you! Your order has been placed. Redirecting to WhatsApp for confirmation...');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSendMessage = async (data: ContactData) => {
    try {
      // Construct WhatsApp message
      const message = `*New Inquiry from Arsh Aqua*%0A%0A` +
        `*Customer Details:*%0A` +
        `Name: ${data.name}%0A` +
        `Phone: ${data.phone}%0A` +
        `Email: ${data.email || 'N/A'}%0A%0A` +
        `*Message:*%0A${data.message}`;
      
      const whatsappUrl = `https://wa.me/923219084365?text=${message}`;

      // Save to Firebase for records
      await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: serverTimestamp()
      });

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'messages');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const toggleAdminView = () => {
    if (!isAdminView) {
      const password = prompt("Enter Admin Password:");
      if (password === "fizzfaizan") { // Simple protection
        setIsAdminView(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Access Denied");
      }
    } else {
      setIsAdminView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-aqua selection:text-white">
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        isAdminView={isAdminView}
        onToggleView={toggleAdminView}
      />
      
      {!isAdminView ? (
        <>
          <Hero />
          <TrustBar />
          <About />
          <Products products={products} onAddToCart={addToCart} />
          <WhyUs />
          <HowItWorks />
          <Testimonials />
          <Stats />
          <CTABanner />
          <Contact onSendMessage={handleSendMessage} />
          <Footer />
        </>
      ) : (
        <AdminPanel />
      )}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        total={cartTotal}
        isSubmitting={isSubmittingOrder}
        onSubmit={handleCheckout}
      />
    </div>
  );
}
