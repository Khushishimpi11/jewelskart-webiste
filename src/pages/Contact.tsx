import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Message sent successfully! We will get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
     <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Contact Us"
          subtitle="Get In Touch"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-bold text-4xl text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name *" value={name} onChange={(e) => setName(e.target.value)} className="bg-card" />
                  <Input type="email" placeholder="Your Email *" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card" />
                </div>
                <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-card" />
                <Textarea placeholder="Your Message *" value={message} onChange={(e) => setMessage(e.target.value)} className="bg-card min-h-[150px]" />
<button
  type="submit"
  className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-md transition-all duration-300 hover:bg-primary/90"
>
  Send Message
</button>              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="font-bold text-4xl text-foreground mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Our Store</h3>
                    <p className="text-muted-foreground">
                      42, MG Road, Connaught Place<br />
                      New Delhi, Delhi 110001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      info@evimeria.com<br />
                      support@evimeria.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Call Us</h3>
                    <p className="text-muted-foreground">
                      +91 98765 43210<br />
                      +91 11 2345 6789
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full Width Google Map */}
        <div className="w-full h-[400px] border-t border-border/30">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.7629442404167!2d77.21659731508!3d28.632751982418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(80%) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Evimeria Store Location"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
