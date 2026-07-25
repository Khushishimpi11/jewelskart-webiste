import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  Eye, EyeOff, Key, User, Mail, Phone,
  MapPin, CreditCard, Banknote, Loader2,
  CheckCircle, LogOut, Shield, Wallet,
  X, Laptop, Smartphone, ShieldAlert
} from 'lucide-react';
import { customerFetch } from '@/utils/sessionInterceptor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DeviceSession {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  lastActive: string;
  loginTime: string;
  isCurrentDevice: boolean;
}

const Account = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active Devices State
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);


  // Login/Register states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Password change states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();
  const {
    login,
    register,
    googleLogin,
    updateProfile,
    changePassword,
    isAuthenticated,
    user,
    logout,
    isLoading
  } = useAuthStore();

  // Personal Info states
  const [firstName, setFirstName] = useState(user?.firstName || user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address states
  const [addressLine1, setAddressLine1] = useState(user?.address?.street || '');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [country, setCountry] = useState(user?.address?.country || 'India');

  // Bank Details states
  const [upiId, setUpiId] = useState(user?.bankDetails?.upiId || '');
  const [accountHolder, setAccountHolder] = useState(user?.bankDetails?.accountHolderName || '');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || '');
  const [ifscCode, setIfscCode] = useState(user?.bankDetails?.ifscCode || '');

  // Load user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setAddressLine1(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setPincode(user.address?.pincode || '');
      setCountry(user.address?.country || 'India');
      setUpiId(user.bankDetails?.upiId || '');
      setAccountHolder(user.bankDetails?.accountHolderName || '');
      setAccountNumber(user.bankDetails?.accountNumber || '');
      setBankName(user.bankDetails?.bankName || '');
      setIfscCode(user.bankDetails?.ifscCode || '');
    }
  }, [user]);

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

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setAuthLoading(true);
    const result = await login(loginEmail, loginPassword);
    setAuthLoading(false);

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

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (registerPhone && !/^\d{10}$/.test(registerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setAuthLoading(true);
    const success = await register(registerEmail, registerPassword, registerName, registerPhone);
    setAuthLoading(false);

    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Registration failed. Email may already be registered.');
    }
  };

  // Save Personal Info
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('customer_token');

    if (!token) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone
        })
      });

      const data = await response.json();
      if (response.ok) {
        const storedUser = JSON.parse(localStorage.getItem('customer_user') || '{}');
        const updatedUser = { ...storedUser, firstName, lastName, phone };
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));

        toast.success('Personal information updated successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        updateProfile({ firstName, lastName, phone });
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Save Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('customer_token');

    if (!token) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          street: addressLine1,
          city,
          state,
          pincode,
          country
        })
      });

      const data = await response.json();
      if (response.ok) {
        const storedUser = JSON.parse(localStorage.getItem('customer_user') || '{}');
        const updatedUser = {
          ...storedUser,
          address: { street: addressLine1, city, state, pincode, country }
        };
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));

        toast.success('Address saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        toast.error(data.message || 'Failed to update address');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Save Bank Details
  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('customer_token');

    if (!token) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-bank-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          upiId: upiId,
          accountHolderName: accountHolder,
          accountNumber: accountNumber,
          bankName: bankName,
          ifscCode: ifscCode
        })
      });

      const data = await response.json();
      if (response.ok) {
        const storedUser = JSON.parse(localStorage.getItem('customer_user') || '{}');
        const updatedUser = {
          ...storedUser,
          bankDetails: {
            upiId: upiId,
            accountHolderName: accountHolder,
            accountNumber: accountNumber,
            bankName: bankName,
            ifscCode: ifscCode
          }
        };
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));

        toast.success('UPI & Bank details saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        toast.error(data.message || 'Failed to update bank details');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      const success = await changePassword(currentPassword, newPassword);

      if (success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePassword(false);
      } else {
        toast.error('Failed to change password. Please check your current password.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

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

  const fetchDevices = async () => {
    setLoadingDevices(true);
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error('Error fetching active devices:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'devices') {
      fetchDevices();
    }
  }, [activeTab]);

  const handleRevokeDevice = async (deviceId: string) => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Device logged out successfully');
        fetchDevices();
      } else {
        toast.error(data.message || 'Failed to logout device');
      }
    } catch (err) {
      toast.error('Failed to logout device');
    }
  };

  const handleRevokeAllOtherDevices = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices-all-other`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('All other devices logged out successfully');
        fetchDevices();
      } else {
        toast.error(data.message || 'Failed to logout devices');
      }
    } catch (err) {
      toast.error('Failed to logout devices');
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'bank', label: 'UPI & Bank', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'devices', label: 'Active Devices', icon: Laptop },
  ];


  // If authenticated, show account page
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-24">
          <InnerPageBanner
            title="My Account"
            subtitle="Manage your profile, address, payments & security"
            breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account' }]}
          />

          <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header - Exactly like Profile page top section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                {/* Avatar - Large and Center */}
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-4xl mx-auto mb-4">
                  {getInitial()}
                </div>

                {/* Name - Center */}
                <h2 className="font-display text-2xl text-foreground">
                  {getDisplayName()}
                </h2>

                {/* Email - Center */}
                <p className="text-muted-foreground">{user.email}</p>

                {/* Google Badge - Center */}
                {user.isGoogleUser && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Connected with Google
                  </span>
                )}
              </motion.div>

              {/* Tabs - Center Aligned like Profile page */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-body text-sm tracking-wider transition-all ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border/30 text-foreground hover:border-primary/50'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-card border border-border/30 p-8 space-y-6">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSavePersonal} className="space-y-6">
                    <h3 className="font-display text-xl text-foreground mb-6">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-background"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-background pl-10 opacity-60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-background pl-10"
                          pattern="\d{10}"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Required for order updates and delivery</p>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                    </Button>
                    {saveSuccess && (
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" /> Saved successfully!
                      </div>
                    )}
                  </motion.form>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                  <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveAddress} className="space-y-6">
                    <h3 className="font-display text-xl text-foreground mb-6">Shipping Address</h3>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Address Line 1</label>
                      <Input
                        placeholder="House/Flat No., Building Name"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="bg-background"
                        required
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
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">State</label>
                        <Input
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="bg-background"
                          required
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
                          required
                          pattern="\d{6}"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Country</label>
                        <Input
                          placeholder="Country"
                          value={country}
                          disabled
                          className="bg-background opacity-60"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Address'}
                    </Button>
                    {saveSuccess && (
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" /> Saved successfully!
                      </div>
                    )}
                  </motion.form>
                )}

                {/* UPI & Bank Details Tab */}
                {activeTab === 'bank' && (
                  <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveBankDetails} className="space-y-6">
                    <div className="mb-6">
                      <h3 className="font-display text-xl text-foreground">UPI & Bank Details</h3>
                      <p className="text-muted-foreground text-sm mt-1">For refunds and returns. Your details are securely stored.</p>
                    </div>

                    {/* UPI Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> UPI ID
                      </h4>
                      <Input
                        placeholder="Enter UPI ID (e.g., name@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Used for instant refunds via UPI</p>
                    </div>

                    {/* Bank Section */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Bank Account Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Account Holder Name</label>
                          <Input
                            placeholder="Name as per bank records"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Account Number</label>
                          <Input
                            placeholder="Bank account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-muted-foreground mb-1">Bank Name</label>
                            <Input
                              placeholder="Bank name"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-muted-foreground mb-1">IFSC Code</label>
                            <Input
                              placeholder="IFSC Code"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save UPI & Bank Details'}
                    </Button>
                    {saveSuccess && (
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" /> Saved successfully!
                      </div>
                    )}
                  </motion.form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h3 className="font-display text-xl text-foreground mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Security
                    </h3>

                    {!user.isGoogleUser ? (
                      <>
                        {!showChangePassword ? (
                          <div className="bg-muted/30 rounded-lg p-8 text-center">
                            <Key className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm mb-4">
                              Keep your account secure by updating your password regularly.
                            </p>
                            <button
                              onClick={() => setShowChangePassword(true)}
                              className="bg-primary text-white px-8 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
                            >
                              Change Password
                            </button>
                          </div>
                        ) : (
                          <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                          >
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Current Password *"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-background pr-10"
                                required
                                autoComplete="current-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>

                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password * (min 6 chars)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-background pr-10"
                                required
                                minLength={6}
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>

                            <div className="relative">
                              <Input
                                type={showConfirmNewPassword ? "text" : "password"}
                                placeholder="Confirm New Password *"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="bg-background pr-10"
                                required
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="flex-1 bg-primary text-white py-2.5 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isChangingPassword ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Changing...
                                  </div>
                                ) : (
                                  'Update Password'
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowChangePassword(false);
                                  setCurrentPassword('');
                                  setNewPassword('');
                                  setConfirmNewPassword('');
                                }}
                                className="px-4 border border-border text-muted-foreground rounded-md hover:bg-muted transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>• Password must be at least 6 characters long</p>
                              <p>• Use a mix of letters, numbers, and symbols</p>
                            </div>
                          </motion.form>
                        )}
                      </>
                    ) : (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-blue-700">
                          🔑 You're using Google Sign-In. You don't need to change your password.
                        </p>
                      </div>
                    )}

                    {/* Logout Button */}
                    <div className="border-t border-border/30 pt-6 mt-6">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full border border-red-500 text-red-500 py-3 rounded-md transition-all duration-300 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Active Devices Tab */}
                {activeTab === 'devices' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
                      <div>
                        <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                          <Laptop className="w-5 h-5 text-primary" /> Active Devices & Sessions
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Devices currently logged into your account.
                        </p>
                      </div>
                      {devices.length > 1 && (
                        <Button 
                          variant="outline" 
                          onClick={handleRevokeAllOtherDevices} 
                          className="text-xs border-red-200 hover:bg-red-50 text-red-600 gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout All Other Devices
                        </Button>
                      )}
                    </div>

                    {loadingDevices ? (
                      <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-sm">Loading active sessions...</p>
                      </div>
                    ) : devices.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <ShieldAlert className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-sm font-medium">No active device sessions found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {devices.map((device) => (
                          <div 
                            key={device.deviceId} 
                            className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                              device.isCurrentDevice ? 'border-primary/50 bg-primary/5' : 'border-border/40 bg-background'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                                {device.deviceType === 'Mobile' || device.deviceType === 'Tablet' ? (
                                  <Smartphone className="w-5 h-5" />
                                ) : (
                                  <Laptop className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-medium text-foreground text-sm">{device.deviceName}</h4>
                                  {device.isCurrentDevice && (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                      Current Device
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                                  <p>IP Address: <span className="font-mono">{device.ipAddress}</span></p>
                                  <p>Last active: {new Date(device.lastActive).toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            </div>

                            {!device.isCurrentDevice && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRevokeDevice(device.deviceId)}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 shrink-0 self-end sm:self-center"
                              >
                                <LogOut className="w-3.5 h-3.5" /> Logout
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </main>
        <Footer />
      </div>
    );
  }

  // Login/Register Form for non-authenticated users
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
                  onClick={() => setAuthTab(tab as typeof authTab)}
                  className={`flex-1 py-3 text-center uppercase tracking-wider text-sm transition-colors ${authTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                    }`}
                >
                  {tab === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {authTab === 'login' ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLogin}
                className="space-y-4 bg-card p-6 border border-border/30 rounded-lg"
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
                  disabled={authLoading}
                  className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>

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
                className="space-y-4 bg-card p-6 border border-border/30 rounded-lg"
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
                  disabled={authLoading}
                  className="w-full bg-primary text-white py-3 rounded-md transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Creating Account...' : 'Create Account'}
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