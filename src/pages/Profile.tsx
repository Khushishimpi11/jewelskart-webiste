import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { User, MapPin, CreditCard, Loader2, Banknote, Plus, Trash2, CheckCircle, Laptop, Smartphone, LogOut, ShieldAlert } from 'lucide-react';
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

const Profile = () => {
  const { user, isAuthenticated, token, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active Devices State
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Personal Info
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address
  const [addressLine1, setAddressLine1] = useState(user?.address?.street || '');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [country, setCountry] = useState(user?.address?.country || 'India');

  // ✅ UPI Details
  const [upiId, setUpiId] = useState(user?.bankDetails?.upiId || '');

  // ✅ Bank Details
  const [accountHolder, setAccountHolder] = useState(user?.bankDetails?.accountHolderName || '');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || '');
  const [ifscCode, setIfscCode] = useState(user?.bankDetails?.ifscCode || '');


  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFirstName(userData.firstName || userData.name?.split(' ')[0] || '');
      setLastName(userData.lastName || userData.name?.split(' ')[1] || '');
      setPhone(userData.phone || '');
      setAddressLine1(userData.address?.street || '');
      setCity(userData.address?.city || '');
      setState(userData.address?.state || '');
      setPincode(userData.address?.pincode || '');
      setCountry(userData.address?.country || 'India');
      // Load UPI and Bank details
      setUpiId(userData.bankDetails?.upiId || '');
      setAccountHolder(userData.bankDetails?.accountHolderName || '');
      setAccountNumber(userData.bankDetails?.accountNumber || '');
      setBankName(userData.bankDetails?.bankName || '');
      setIfscCode(userData.bankDetails?.ifscCode || '');
    }
  }, []);

  if (!isAuthenticated || !user) {
    return <Navigate to="/account" replace />;
  }

  // Save Personal Info
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const authToken = token || localStorage.getItem('customer_token');

    if (!authToken) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone
        })
      });

      const data = await response.json();
      if (response.ok) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, firstName, lastName, phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Personal information updated successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        updateProfile({ firstName, lastName, phone });
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
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

    const authToken = token || localStorage.getItem('customer_token');

    if (!authToken) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...storedUser,
          address: { street: addressLine1, city, state, pincode, country }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Address saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(data.message || 'Failed to update address');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save UPI + Bank Details together
  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const authToken = token || localStorage.getItem('customer_token');

    if (!authToken) {
      toast.error('Please login again');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-bank-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
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
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('UPI & Bank details saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
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

  const fetchDevices = async () => {
    setLoadingDevices(true);
    const authToken = token || localStorage.getItem('customer_token');
    if (!authToken) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
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
    const authToken = token || localStorage.getItem('customer_token');
    if (!authToken) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Device session logged out');
        fetchDevices();
      } else {
        toast.error(data.message || 'Failed to logout device');
      }
    } catch (err) {
      toast.error('Failed to logout device');
    }
  };

  const handleRevokeAllOtherDevices = async () => {
    const authToken = token || localStorage.getItem('customer_token');
    if (!authToken) return;

    try {
      const res = await customerFetch(`${API_BASE_URL}/auth/active-devices-all-other`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('All other devices logged out');
        fetchDevices();
      } else {
        toast.error(data.message || 'Failed to logout devices');
      }
    } catch (err) {
      toast.error('Failed to logout devices');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'bank', label: 'UPI & Bank Details', icon: CreditCard },
    { id: 'devices', label: 'Active Devices', icon: Laptop },
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Profile Settings"
          subtitle="My Profile"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Profile' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-4xl mx-auto mb-4">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-2xl text-foreground">{firstName} {lastName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </motion.div>

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

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSavePersonal} className="bg-card border border-border/30 p-8 space-y-6">
                <h3 className="font-display text-xl text-foreground mb-6">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                  <Input type="email" value={user.email} disabled className="bg-background opacity-60" />
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
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveAddress} className="bg-card border border-border/30 p-8 space-y-6">
                <h3 className="font-display text-xl text-foreground mb-6">Shipping Address</h3>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Address Line 1</label>
                  <Input placeholder="House/Flat No., Building Name" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="bg-background" required />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Address Line 2</label>
                  <Input placeholder="Street, Area, Landmark" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="bg-background" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">City</label>
                    <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">State</label>
                    <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="bg-background" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Pincode</label>
                    <Input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Country</label>
                    <Input placeholder="Country" value={country} disabled className="bg-background opacity-60" />
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

            {/* ✅ UPI & Bank Details Tab */}
            {activeTab === 'bank' && (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveBankDetails} className="bg-card border border-border/30 p-8 space-y-6">
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

            {/* Active Devices Tab */}
            {activeTab === 'devices' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/30 p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
                  <div>
                    <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-primary" /> Active Devices & Sessions
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Devices currently logged into your JewelsKart account.
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
                        className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${device.isCurrentDevice ? 'border-primary/50 bg-primary/5' : 'border-border/40 bg-background'
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
      </main>
      <Footer />
    </div>
  );
};

export default Profile;