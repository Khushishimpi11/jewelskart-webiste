import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Account = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { 
    login, 
    register, 
    googleLogin,
    updateProfile,
    isAuthenticated, 
    user, 
    logout,
    isLoading 
  } = useAuthStore();

  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Success:", tokenResponse);
      const success = await googleLogin(tokenResponse.access_token);
      if (success) {
        toast.success('Successfully signed in with Google!');
        navigate('/');
      } else {
        toast.error('Google sign in failed. Please try again.');
      }
    },
    onError: (error) => {
      console.log("Google error:", error);
      toast.error('Google sign in failed');
    },
  });

  const handleGoogleButtonClick = () => {
    console.log("🔵 Google Sign-In button clicked!");
    handleGoogleLogin();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const result = await login(loginEmail, loginPassword);
    
    if (result === true) {
      toast.success('Welcome back!');
      navigate('/');
    } else if (result === 'user_not_found') {
      toast.error('No account found with this email address');
    } else if (result === 'invalid_password') {
      toast.error('Incorrect password. Please try again.');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerEmail || !registerPassword || !registerName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone number validation (if provided)
    if (registerPhone && !/^\d{10}$/.test(registerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    console.log('📝 Registering with:', {
      name: registerName,
      email: registerEmail,
      phone: registerPhone,
      passwordLength: registerPassword.length
    });
    
    const success = await register(registerEmail, registerPassword, registerName, registerPhone);
    
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Registration failed. Email may already be registered.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const form = e.target as HTMLFormElement;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement)?.value || '';
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement)?.value || '';
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value || '';
    
    // Validate phone number if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      setIsUpdating(false);
      return;
    }
    
    const success = await updateProfile({
      firstName,
      lastName,
      phone,
    });
    
    if (success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
    setIsUpdating(false);
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Helper function to get initial for avatar
  const getInitial = () => {
    if (!user) return 'U';
    
    if (user.firstName && user.firstName[0]) {
      return user.firstName[0].toUpperCase();
    }
    if (user.name && user.name[0]) {
      return user.name[0].toUpperCase();
    }
    if (user.email && user.email[0]) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <InnerPageBanner
            title="Account Settings"
            subtitle="My Account"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account' }]}
          />
          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="max-w-md mx-auto bg-card p-8 border border-border/30">
              <div className="text-center mb-8">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={getDisplayName()}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-3xl mx-auto mb-4">
                    {getInitial()}
                  </div>
                )}
                <h2 className="font-display text-xl text-foreground">
                  {getDisplayName()}
                </h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                {user.isGoogleUser && (
                  <p className="text-xs text-green-600 mt-1">Connected with Google</p>
                )}
                {user.customerId && (
                  <p className="text-xs text-muted-foreground mt-1">Customer ID: {user.customerId}</p>
                )}
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input 
                  name="firstName"
                  placeholder="First Name" 
                  defaultValue={user.firstName || ''} 
                  className="bg-background" 
                  required
                />
                <Input 
                  name="lastName"
                  placeholder="Last Name" 
                  defaultValue={user.lastName || ''} 
                  className="bg-background" 
                />
                <Input 
                  name="phone"
                  type="tel"
                  placeholder="Phone Number (10 digits)" 
                  defaultValue={user.phone || ''} 
                  className="bg-background" 
                  pattern="\d{10}"
                  maxLength={10}
                />
                <Input 
                  type="email" 
                  placeholder="Email" 
                  defaultValue={user.email} 
                  className="bg-background" 
                  disabled 
                />
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={logout} 
                  className="w-full border border-primary text-primary py-3 rounded-md transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  Logout
                </button>
              </form>
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
      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title="My Account"
          subtitle="Welcome"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account' }]}
        />

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
                  required
                  autoComplete="email"
                />
                
                {/* Password field with eye icon */}
                <div className="relative">
                  <Input 
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    className="bg-background pr-10" 
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                
                {/* Google Sign In Button */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleButtonClick}
                  className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-md border border-gray-300 transition-all duration-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>

                <p className="text-center text-muted-foreground text-sm">
                  <a href="/forgot-password" className="hover:text-primary transition-colors">
                    Forgot password?
                  </a>
                </p>
              </motion.form>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                onSubmit={handleRegister} 
                className="space-y-4 bg-card p-6 border border-border/30"
              >
                <Input 
                  placeholder="Full Name *" 
                  value={registerName} 
                  onChange={(e) => setRegisterName(e.target.value)} 
                  className="bg-background" 
                  required
                  autoComplete="name"
                />
                <Input 
                  type="email" 
                  placeholder="Email *" 
                  value={registerEmail} 
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  className="bg-background" 
                  required
                  autoComplete="email"
                />
                <Input 
                  type="tel" 
                  placeholder="Phone Number (Optional)" 
                  value={registerPhone} 
                  onChange={(e) => setRegisterPhone(e.target.value)} 
                  className="bg-background" 
                  pattern="\d{10}"
                  maxLength={10}
                />
                
                {/* Password field with eye icon for registration */}
                <div className="relative">
                  <Input 
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Password * (min 6 characters)" 
                    value={registerPassword} 
                    onChange={(e) => setRegisterPassword(e.target.value)} 
                    className="bg-background pr-10" 
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Confirm Password field with eye icon */}
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password *" 
                    value={registerConfirmPassword} 
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)} 
                    className="bg-background pr-10" 
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default Account;