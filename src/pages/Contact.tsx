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

            {/* Contact Info - Updated with Footer Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="font-bold text-4xl text-foreground mb-6">Contact Information</h2>

              <div className="space-y-6">
                {/* Address - Same as Footer */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Our Office</h3>
                    <a
                      href="https://www.google.com/maps/place/Boulevard+Towers+by+BramhaCorp/@18.5266499,73.8737853,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c1f55b86563b:0xe76bf0285653ddd5!8m2!3d18.5266499!4d73.8763602!16s%2Fg%2F11l5j960xy?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Boulevard Towers - JEWELSKART
                      <br />
                      A-1008, 10th Floor, Near Sadhu Vaswani Chowk
                      <br />
                      Opp Vijay Sales, Camp, Pune - 411001
                    </a>
                  </div>
                </div>

                {/* Emails */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Email Us</h3>
                    <div className="space-y-1">
                      <a
                        href="mailto:business@jewelskartindia.com"
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        business@jewelskartindia.com
                      </a>
                      <a
                        href="mailto:info@jewelskartindia.com"
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        info@jewelskartindia.com
                      </a>
                      <a
                        href="mailto:aanchal@jewelskartindia.com"
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        aanchal@jewelskartindia.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers - Same as Footer */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">Call Us</h3>
                    <div className="space-y-1">
                      <a
                        href="tel:+917558572001"
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        +91 75585 72001
                      </a>
                      <a
                        href="tel:+919730253913"
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        +91 97302 53913
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Google Map - Boulevard Towers by BramhaCorp, Pune */}
        <div className="w-full h-[400px] border-t border-border/30">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.888953744531!2d73.8737853!3d18.5266499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1f55b86563b%3A0xe76bf0285653ddd5!2sBoulevard%20Towers%20by%20BramhaCorp!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jewelskart Store Location - Boulevard Towers by BramhaCorp, Pune"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;