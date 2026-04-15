/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
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
  Quote
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2">
          <Droplets className="w-8 h-8 text-aqua" />
          <span className="text-2xl font-bold font-serif text-white">
            Arsh Aqua
          </span>
        </a>

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
          <button className="bg-aqua hover:bg-aqua/90 text-navy px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 uppercase">
            Order Now
          </button>
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
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-navy/80 hover:text-aqua py-2 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-aqua text-white py-4 rounded-xl font-bold mt-2">
              Order Now
            </button>
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
            <button className="bg-aqua hover:bg-aqua/90 text-navy px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-aqua/20">
              Shop Now
            </button>
            <button className="border-2 border-aqua hover:bg-aqua/10 text-aqua px-10 py-4 rounded-full text-lg font-bold transition-all">
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

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Arsh Aqua 500ml",
      desc: "Perfect for on-the-go hydration. Compact and refreshing.",
      price: "$0.99",
      img: "https://placehold.co/400x600/00B4D8/FFFFFF?text=500ml+Bottle"
    },
    {
      id: 2,
      name: "Arsh Aqua 1.5L",
      desc: "Ideal for your daily hydration needs at home or office.",
      price: "$1.99",
      img: "https://placehold.co/400x600/00B4D8/FFFFFF?text=1.5L+Bottle"
    },
    {
      id: 3,
      name: "5-Gallon Dispenser",
      desc: "Premium mineral water for families and large offices.",
      price: "$12.99",
      img: "https://placehold.co/400x600/00B4D8/FFFFFF?text=5-Gallon+Jug"
    },
    {
      id: 4,
      name: "Premium Glass Edition",
      desc: "Elegant 750ml glass bottle for fine dining experiences.",
      price: "$4.99",
      img: "https://placehold.co/400x600/00B4D8/FFFFFF?text=Glass+Edition"
    }
  ];

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
                  <button className="bg-aqua text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg uppercase">Quick View</button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold text-aqua">{product.price}</span>
                <button className="bg-white text-navy hover:bg-aqua hover:text-white p-3 rounded-xl transition-all">
                  <Droplets className="w-5 h-5" />
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

const Counter = ({ value }: { value: number }) => {
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
            <button className="bg-aqua text-navy hover:bg-white px-12 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl uppercase">
              Order Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};const Contact = () => {
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
                  <p className="text-white/50">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-aqua shrink-0 border border-white/10">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Email Us</h4>
                  <p className="text-white/50">hello@arshaqua.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-aqua shrink-0 border border-white/10">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Visit Us</h4>
                  <p className="text-white/50">123 Purity Lane, Spring Valley, CA 90210</p>
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
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider">Your Message</label>
                <textarea 
                  rows={4} 
                  placeholder="How can we help you?" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua outline-none transition-all text-white placeholder:text-white/20 resize-none"
                />
              </div>
              <button className="w-full bg-aqua hover:bg-white text-navy py-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-aqua/20 active:scale-[0.98] uppercase tracking-widest">
                Send Message
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
          <p>© {new Date().getFullYear()} Arsh Aqua. All rights reserved. Designed for Purity.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen selection:bg-aqua selection:text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <About />
      <Products />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  );
}
