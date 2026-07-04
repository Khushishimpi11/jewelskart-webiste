import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

const Contact = () => {
  const [searchParams] = useSearchParams();
  const isPartner = searchParams.get('partner') === 'true';

  // Contact Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Partner Form Fields
  const [brandName, setBrandName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [productType, setProductType] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || '',
          subject: subject || 'General Inquiry',
          message
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Message sent successfully! We will get back to you soon.');
        // Reset form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setPhone('');
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Partner Form Submit
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandName || !ownerName || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/contact/partner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: brandName,
          ownerName,
          email,
          phone,
          businessType: businessType || '',
          city: city || '',
          products: productType || '',
          message: message || ''
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Partnership application submitted! We will review and get back to you soon.');
        // Reset form
        setBrandName('');
        setOwnerName('');
        setEmail('');
        setPhone('');
        setProductType('');
        setBusinessType('');
        setCity('');
        setMessage('');
      } else {
        toast.error(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Partner form error:', error);
      toast.error('Failed to submit application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isPartner) {
      handlePartnerSubmit(e);
    } else {
      handleContactSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title={isPartner ? "Partner With Us" : "Contact Us"}
          subtitle={isPartner ? "Grow Your Brand" : "Get In Touch"}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: isPartner ? 'Partner With Us' : 'Contact Us' },
          ]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-bold text-4xl text-foreground mb-6">
                {isPartner ? 'Partnership Application' : 'Send Us a Message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isPartner ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Brand Name *" 
                        value={brandName} 
                        onChange={(e) => setBrandName(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                      <Input 
                        placeholder="Owner Name *" 
                        value={ownerName} 
                        onChange={(e) => setOwnerName(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input 
                        type="email" 
                        placeholder="Email *" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                      <Input 
                        placeholder="Phone *" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Business Type (e.g., Manufacturer, Wholesaler)" 
                        value={businessType} 
                        onChange={(e) => setBusinessType(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                      <Input 
                        placeholder="City" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                    </div>
                    <Input 
                      placeholder="Product Type (e.g., Rings, Chains, Pendants)" 
                      value={productType} 
                      onChange={(e) => setProductType(e.target.value)} 
                      className="bg-card"
                      disabled={isSubmitting}
                    />
                    <Textarea 
                      placeholder="Tell us about your brand..." 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      className="bg-card min-h-[150px]"
                      disabled={isSubmitting}
                    />
                  </>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Your Name *" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                      <Input 
                        type="email" 
                        placeholder="Your Email *" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-card"
                        disabled={isSubmitting}
                      />
                    </div>
                    <Input 
                      placeholder="Phone (Optional)" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="bg-card"
                      disabled={isSubmitting}
                    />
                    <Input 
                      placeholder="Subject" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      className="bg-card"
                      disabled={isSubmitting}
                    />
                    <Textarea 
                      placeholder="Your Message *" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      className="bg-card min-h-[150px]"
                      disabled={isSubmitting}
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isPartner ? 'Submitting...' : 'Sending...'}
                    </>
                  ) : (
                    <>{isPartner ? 'Submit Application' : 'Send Message'}</>
                  )}
                </button>
              </form>
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
                      info@jewelskart.com<br />
                      support@jewelskartindia.com
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

        {/* Google Map */}
        <div className="w-full h-[400px] border-t border-border/30">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.7629442404167!2d77.21659731508!3d28.632751982418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(80%) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jewelskart Store Location"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;