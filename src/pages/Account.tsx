import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';

const Account = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <h1 className="font-display text-3xl text-foreground mb-8 text-center">My Account</h1>
          
          <div className="max-w-md mx-auto">
            <div className="flex mb-6">
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`flex-1 py-3 text-center uppercase tracking-wider text-sm transition-colors ${
                    activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                  }`}
                >
                  {tab === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {activeTab === 'login' ? (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-card p-6 border border-border/30">
                <Input type="email" placeholder="Email" className="bg-background" />
                <Input type="password" placeholder="Password" className="bg-background" />
                <button type="button" className="w-full btn-gold">Sign In</button>
                <p className="text-center text-muted-foreground text-sm">Forgot password?</p>
              </motion.form>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 bg-card p-6 border border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-background" />
                  <Input placeholder="Last Name" className="bg-background" />
                </div>
                <Input type="email" placeholder="Email" className="bg-background" />
                <Input type="password" placeholder="Password" className="bg-background" />
                <Input type="password" placeholder="Confirm Password" className="bg-background" />
                <button type="button" className="w-full btn-gold">Create Account</button>
              </motion.form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
