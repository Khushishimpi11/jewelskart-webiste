  import { motion } from 'framer-motion';
  import { Star } from 'lucide-react';
  import { Header } from '@/components/Header';
  import { Footer } from '@/components/Footer';
  import { InnerPageBanner } from '@/components/InnerPageBanner';
  import avatar1 from '@/assets/testimonial-avatar1.jpg';
  import avatar2 from '@/assets/testimonial-avatar2.jpg';
  import avatar4 from '@/assets/testimonial-avatar4.jpg';

  const allTestimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      title: 'Timeless Elegance',
      text: 'The craftsmanship of Jewelskart is truly exceptional. Every piece I have purchased feels like a work of art. The attention to detail and the quality of materials used is unmatched.',
      avatar: avatar1,
    },
    {
      id: 2,
      name: 'Ananya Patel',
      location: 'Delhi',
      rating: 5,
      title: 'Shine With Elegance',
      text: 'I ordered a custom pendant for my anniversary and it exceeded all expectations. The design team understood exactly what I wanted and delivered perfection.',
      avatar: avatar2,
    },
    {
      id: 3,
      name: 'Meera Krishnan',
      location: 'Bangalore',
      rating: 4,
      title: 'Pure Brilliance',
      text: 'Jewelskart has become my go-to destination for all jewellery needs. From daily wear rings to special occasion necklaces, every piece is beautifully crafted.',
      avatar: avatar4,
    },
    {
      id: 4,
      name: 'Ritu Verma',
      location: 'Jaipur',
      rating: 5,
      title: 'Radiant Beauty',
      text: 'The gold chain I purchased is absolutely stunning. It has a beautiful shine and the clasp is very secure. I wear it every day and it still looks as good as new.',
      avatar: avatar1,
    },
    {
      id: 5,
      name: 'Kavitha Nair',
      location: 'Kochi',
      rating: 5,
      title: 'Exceptional Quality',
      text: 'Bought a pair of diamond earrings for my daughter\'s wedding. The sparkle and quality are outstanding. Jewelskart made the occasion even more special.',
      avatar: avatar2,
    },
    {
      id: 6,
      name: 'Sneha Gupta',
      location: 'Kolkata',
      rating: 4,
      title: 'Beautiful Craftsmanship',
      text: 'Every piece from Jewelskart tells a story. The traditional designs with a modern twist are perfect for today\'s woman. Absolutely love my collection!',
      avatar: avatar4,
    },
  ];

  const TestimonialCard = ({ testimonial, index }: { testimonial: typeof allTestimonials[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#FBF5F6] p-8 border-2 border-primary shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-foreground/80 text-base leading-relaxed mb-6">
        {testimonial.text}
      </p>

      {/* Closing quote */}
      <div className="text-muted-foreground/20 text-5xl font-display text-right mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        ❞
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
          loading="lazy"
        />
        <div>
          <p className="font-display text-lg text-foreground">{testimonial.title}</p>
          <p className="text-muted-foreground text-sm">
            – {testimonial.name} <span className="text-primary">{testimonial.location}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );

  const Testimonials = () => {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <InnerPageBanner
            title="Testimonials"
            subtitle="Customer Voices"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Testimonials' }]}
          />

          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allTestimonials.map((t, i) => (
                  <TestimonialCard key={t.id} testimonial={t} index={i} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  };

  export default Testimonials;