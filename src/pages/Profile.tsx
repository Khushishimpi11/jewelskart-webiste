import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isAuthenticated || !user) {
    return <Navigate to="/account" replace />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName });
    toast.success('Profile updated successfully!');
  };

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
          <div className="max-w-2xl mx-auto">
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

            {/* Profile Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSave}
              className="bg-card border border-border/30 p-8 space-y-6"
            >
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

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Address</label>
                <Input
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-background"
                />
              </div>

              <button type="submit" className="btn-gold w-full">
                Save Changes
              </button>
            </motion.form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
