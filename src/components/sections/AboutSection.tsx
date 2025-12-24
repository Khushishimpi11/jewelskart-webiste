import { motion } from 'framer-motion';

export const AboutSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-body text-sm tracking-luxury uppercase">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-8">
              About Evimeria
            </h2>
            <div className="section-divider mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              Founded in 1995, Evimeria Jewellery has been at the forefront of luxury craftsmanship
              for nearly three decades. Our journey began with a simple belief: that every piece of
              jewellery should be a masterpiece, telling its own unique story.
            </p>
            <p>
              Each creation in our collection is meticulously handcrafted by master artisans who
              bring generations of expertise to their craft. We source only the finest ethically
              mined gemstones and precious metals, ensuring that our jewellery is as responsible
              as it is radiant.
            </p>
            <p>
              From engagement rings that mark the beginning of forever, to heirloom pieces passed
              down through generations, Evimeria represents more than jewellery—we create lasting
              symbols of life's most precious moments.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/30"
          >
            {[
              { value: '29+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '100+', label: 'Master Artisans' },
              { value: '500+', label: 'Unique Designs' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-display text-4xl text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
