import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, Banknote, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';

interface ReturnRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  product?: any;
  requestType: 'cancel' | 'return' | 'exchange';
}

const ReturnRequestModal = ({ open, onOpenChange, orderId, product, requestType }: ReturnRequestModalProps) => {
  const { createReturnRequest, cancelOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCondition, setAcceptedCondition] = useState(false);
  
  const [refundMethod, setRefundMethod] = useState<'original' | 'upi' | 'bank' | 'wallet'>('original');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  });
  const [showUpiInput, setShowUpiInput] = useState(false);
  const [showBankInput, setShowBankInput] = useState(false);

  const reasons = {
    cancel: [
      "Changed my mind",
      "Ordered by mistake",
      "Found better price elsewhere",
      "Delivery time too long",
      "Other"
    ],
    return: [
      "Product is damaged",
      "Wrong product received",
      "Product is defective",
      "Size doesn't fit",
      "Not as described",
      "Other"
    ],
    exchange: [
      "Wrong size received",
      "Wrong color received",
      "Defective product",
      "Other"
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    setImages([...images, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setReason('');
    setDescription('');
    setImages([]);
    setImagePreviews([]);
    setAcceptedTerms(false);
    setAcceptedCondition(false);
    setUpiId('');
    setBankDetails({
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    });
    setShowUpiInput(false);
    setShowBankInput(false);
    setRefundMethod('original');
  };

  const getTitle = () => {
    switch(requestType) {
      case 'cancel': return 'Cancel Order';
      case 'return': return 'Return Product';
      case 'exchange': return 'Exchange Product';
      default: return 'Request';
    }
  };

  const getRefundAmount = () => {
    return (product?.price || 0) * (product?.quantity || 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {product && (
            <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                <p className="text-lg font-bold text-primary">₹{getRefundAmount().toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-sm font-semibold">Reason for {requestType} *</Label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 p-2.5 border rounded-lg bg-white"
              required
            >
              <option value="">Select a reason</option>
              {reasons[requestType].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label className="text-sm font-semibold">Additional Details (Optional)</Label>
            <Textarea
              placeholder="Please provide more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1.5"
            />
          </div>
          
          {(requestType === 'return' || requestType === 'exchange') && (
            <div>
              <Label className="text-sm font-semibold flex items-center gap-2">
                Upload Proof Images *
              </Label>
              <div className="mt-1.5 border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-400">Max 5 images (JPG, PNG)</span>
                </label>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="Proof" className="w-16 h-16 object-cover rounded-lg border" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {(requestType === 'return' || requestType === 'cancel') && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Label className="text-sm font-semibold mb-3 block">How would you like to receive your refund?</Label>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="original"
                    checked={refundMethod === 'original'}
                    onChange={() => {
                      setRefundMethod('original');
                      setShowUpiInput(false);
                      setShowBankInput(false);
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Original Payment Method</p>
                    <p className="text-xs text-gray-500">Amount will be credited to your original payment source</p>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </label>
                
                <div>
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="refundMethod"
                      value="upi"
                      checked={refundMethod === 'upi'}
                      onChange={() => {
                        setRefundMethod('upi');
                        setShowUpiInput(true);
                        setShowBankInput(false);
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">UPI ID</p>
                    </div>
                    <Wallet className="w-5 h-5 text-gray-400" />
                  </label>
                  {showUpiInput && (
                    <Input
                      placeholder="Enter UPI ID (e.g., name@upi)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="refundMethod"
                      value="bank"
                      checked={refundMethod === 'bank'}
                      onChange={() => {
                        setRefundMethod('bank');
                        setShowUpiInput(false);
                        setShowBankInput(true);
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Bank Account</p>
                    </div>
                    <Banknote className="w-5 h-5 text-gray-400" />
                  </label>
                  {showBankInput && (
                    <div className="space-y-2 mt-2">
                      <Input
                        placeholder="Account Holder Name"
                        value={bankDetails.accountHolderName}
                        onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                      />
                      <Input
                        placeholder="Account Number"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Bank Name"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                        />
                        <Input
                          placeholder="IFSC Code"
                          value={bankDetails.ifscCode}
                          onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="wallet"
                    checked={refundMethod === 'wallet'}
                    onChange={() => {
                      setRefundMethod('wallet');
                      setShowUpiInput(false);
                      setShowBankInput(false);
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium">JewelsKart Wallet</p>
                    <p className="text-xs text-gray-500">Get instant credit in your wallet for future purchases</p>
                  </div>
                  <Wallet className="w-5 h-5 text-gray-400" />
                </label>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-gray-600">
                I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline">Return & Refund Policy</a>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedCondition}
                onChange={(e) => setAcceptedCondition(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-gray-600">
                I confirm the product is unused and in original condition
              </span>
            </label>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={async () => {
              alert('BUTTON CLICKED!'); // ✅ This will show popup
              console.log('🔴🔴🔴 BUTTON CLICKED DIRECTLY 🔴🔴🔴');
              
              if (!reason) {
                toast.error('Please select a reason');
                return;
              }
              
              if (images.length === 0) {
                toast.error('Please upload proof images');
                return;
              }
              
              if (!acceptedTerms) {
                toast.error('Please accept the terms and conditions');
                return;
              }
              
              if (!acceptedCondition) {
                toast.error('Please confirm product condition');
                return;
              }
              
              setLoading(true);
              
              const imageBase64: string[] = [];
              for (let i = 0; i < images.length; i++) {
                const img = images[i];
                try {
                  const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(img);
                  });
                  imageBase64.push(base64);
                } catch (error) {
                  console.error('Error converting image:', error);
                }
              }
              
              let refundDetails: any = {};
              if (refundMethod === 'original') {
                refundDetails = { method: 'original' };
              } else if (refundMethod === 'upi') {
                if (!upiId) {
                  toast.error('Please enter UPI ID');
                  setLoading(false);
                  return;
                }
                refundDetails = { method: 'upi', upiId: upiId };
              } else if (refundMethod === 'bank') {
                if (!bankDetails.accountNumber || !bankDetails.ifscCode) {
                  toast.error('Please enter complete bank details');
                  setLoading(false);
                  return;
                }
                refundDetails = { 
                  method: 'bank', 
                  bankDetails: {
                    accountHolderName: bankDetails.accountHolderName,
                    accountNumber: bankDetails.accountNumber,
                    bankName: bankDetails.bankName,
                    ifscCode: bankDetails.ifscCode
                  }
                };
              } else if (refundMethod === 'wallet') {
                refundDetails = { method: 'wallet' };
              }
              
              const requestData = {
                orderId: orderId,
                productId: product?.productId || null,
                productName: product?.name || "Product",
                quantity: product?.quantity || 1,
                price: product?.price || 0,
                reason: reason,
                description: description || '',
                requestType: requestType,
                images: imageBase64,
                refundDetails: refundDetails
              };
              
              const result = await createReturnRequest(requestData);
              
              if (result) {
                onOpenChange(false);
                resetForm();
                toast.success(`${requestType === 'return' ? 'Return' : 'Exchange'} request submitted successfully!`);
              }
              
              setLoading(false);
            }} 
            disabled={loading} 
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {requestType === 'cancel' ? 'Confirm Cancellation' : `Submit ${requestType === 'return' ? 'Return' : 'Exchange'} Request`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnRequestModal;