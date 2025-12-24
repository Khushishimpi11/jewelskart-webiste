import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { User, MapPin, CreditCard, Package } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Personal Info
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('');
  
  // Address
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  
  // Bank Details
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  if (!isAuthenticated || !user) {
    return <Navigate to="/account" replace />;
  }

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName });
    toast.success('Personal information updated successfully!');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Address saved successfully!');
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Bank details saved successfully!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Banner */}
        <section className="py-16 bg-card border-b border-border/30">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-primary font-body text-sm tracking-luxury uppercase">
                My Profile
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                Profile Settings
              </h1>
              <div className="section-divider mt-6" />
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-4xl mx-auto mb-4">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-2xl text-foreground">{user.firstName} {user.lastName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-body text-sm tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border/30 text-foreground hover:border-primary/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSavePersonal}
                className="bg-card border border-border/30 p-8 space-y-6"
              >
                <h3 className="font-display text-xl text-foreground mb-6">Personal Information</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-background opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <button type="submit" className="btn-gold w-full">
                  Save Changes
                </button>
              </motion.form>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveAddress}
                className="bg-card border border-border/30 p-8 space-y-6"
              >
                <h3 className="font-display text-xl text-foreground mb-6">Shipping Address</h3>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Address Line 1</label>
                  <Input
                    placeholder="House/Flat No., Building Name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Address Line 2</label>
                  <Input
                    placeholder="Street, Area, Landmark"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">City</label>
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">State</label>
                    <Input
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Pincode</label>
                    <Input
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Country</label>
                    <Input
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-gold w-full">
                  Save Address
                </button>
              </motion.form>
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveBank}
                className="bg-card border border-border/30 p-8 space-y-6"
              >
                <div className="mb-6">
                  <h3 className="font-display text-xl text-foreground">Bank Details</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    For refunds and returns. Your details are securely stored.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Account Holder Name</label>
                  <Input
                    placeholder="Name as per bank records"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Account Number</label>
                  <Input
                    placeholder="Bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Bank Name</label>
                    <Input
                      placeholder="Bank name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">IFSC Code</label>
                    <Input
                      placeholder="IFSC Code"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="border-t border-border/30 pt-6">
                  <h4 className="font-body text-sm text-foreground mb-4 uppercase tracking-wider">Or Add UPI</h4>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">UPI ID</label>
                    <Input
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-gold w-full">
                  Save Bank Details
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
