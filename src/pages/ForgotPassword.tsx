import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setIsSent(true);
      toast.success('Password reset link sent to your email!');
      
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24">
        <InnerPageBanner
          title="Forgot Password"
          subtitle="Reset Your Password"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/account' }, { label: 'Forgot Password' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-8 border border-border/30 rounded-lg"
            >
              {!isSent ? (
                <>
                  <h2 className="text-2xl font-display text-center mb-4">Reset Your Password</h2>
                  <p className="text-muted-foreground text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background"
                      required
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                  
                  <p className="text-center text-muted-foreground text-sm mt-6">
                    <Link to="/account" className="text-primary hover:underline">
                      ← Back to Login
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-display mb-2">Check Your Email</h2>
                    <p className="text-muted-foreground mb-4">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-semibold text-foreground mb-6">{email}</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      The link will expire in 15 minutes. If you don't receive the email, check your spam folder.
                    </p>
                    <Link
                      to="/account"
                      className="inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-all"
                    >
                      Return to Login
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;