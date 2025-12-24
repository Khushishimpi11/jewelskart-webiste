import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const Account = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const { login, register, isAuthenticated, user, logout } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Account not found. Please register first.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !firstName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const success = register(registerEmail, registerPassword, firstName, lastName);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('This email is already registered');
    }
  };

  if (isAuthenticated && user) {
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
                  My Account
                </span>
                <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                  Account Settings
                </h1>
                <div className="section-divider mt-6" />
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="max-w-md mx-auto bg-card p-8 border border-border/30">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-3xl mx-auto mb-4">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-display text-xl text-foreground">{user.firstName} {user.lastName}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="First Name"
                  defaultValue={user.firstName}
                  className="bg-background"
                />
                <Input
                  placeholder="Last Name"
                  defaultValue={user.lastName}
                  className="bg-background"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  defaultValue={user.email}
                  className="bg-background"
                  disabled
                />
                <button className="w-full btn-gold">Save Changes</button>
                <button onClick={logout} className="w-full btn-gold-outline">Logout</button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                Welcome
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4">
                My Account
              </h1>
              <div className="section-divider mt-6" />
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-16">
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
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLogin}
                className="space-y-4 bg-card p-6 border border-border/30"
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-background"
                />
                <button type="submit" className="w-full btn-gold">Sign In</button>
                <p className="text-center text-muted-foreground text-sm">Forgot password?</p>
              </motion.form>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleRegister}
                className="space-y-4 bg-card p-6 border border-border/30"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-background"
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email *"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="password"
                  placeholder="Password *"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-background"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password *"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="bg-background"
                />
                <button type="submit" className="w-full btn-gold">Create Account</button>
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
