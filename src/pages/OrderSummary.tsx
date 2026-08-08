import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore, SimpleOrder } from '@/store/orderStore';
import { useExchange } from '@/context/ExchangeContext';
import { 
  Package, Eye, Loader2, Truck, CheckCircle, Clock, AlertCircle, 
  Copy, Check, User, RefreshCw, XCircle, Upload, X, CreditCard, Banknote, Plus, Search, MinusCircle,
  MapPin, Phone, Mail, Calendar, MessageCircle, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    ZPayments?: any;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SelectedItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  actionType: 'return' | 'exchange' | 'none';
}

interface ReturnRequestInfo {
  _id: string;
  orderId: string;
  requestType: 'cancel' | 'return' | 'exchange';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'return_received' | 'exchange_shipped';
  refundAmount: number;
  refundStatus: string;
  exchangeDetails?: {
    returnShippingTracking: string;
    exchangeShippingTracking: string;
    returnReceived: boolean;
    exchangeShipped: boolean;
  };
  createdAt: string;
}

const OrderSummary = () => {
  const { isAuthenticated, isLoading: authLoading, user, token } = useAuthStore();
  const { orders, isLoading: ordersLoading, fetchMyOrders, cancelOrder, createReturnRequest } = useOrderStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { exchangeData, setExchangeData, clearExchangeData } = useExchange();
  
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [returnRequests, setReturnRequests] = useState<ReturnRequestInfo[]>([]);
  
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showMultiItemModal, setShowMultiItemModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SimpleOrder | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [currentProcessingItem, setCurrentProcessingItem] = useState<SelectedItem | null>(null);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [processingQueue, setProcessingQueue] = useState<SelectedItem[]>([]);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Single item states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [requestType, setRequestType] = useState<'return' | 'exchange'>('return');
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  
  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  // Refund method states
  const [refundMethod, setRefundMethod] = useState<'original' | 'saved-upi' | 'saved-bank' | 'new-upi' | 'new-bank'>('original');
  const [selectedUpiId, setSelectedUpiId] = useState('');
  const [selectedBankDetails, setSelectedBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  });
  const [newUpiId, setNewUpiId] = useState('');
  const [newBankDetails, setNewBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  });
  const [showNewRefundForm, setShowNewRefundForm] = useState(false);
  
  // Exchange states
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedExchangeProduct, setSelectedExchangeProduct] = useState<any | null>(null);
  const [exchangeProductId, setExchangeProductId] = useState('');
  const [priceDifference, setPriceDifference] = useState(0);
  const [searchProduct, setSearchProduct] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [differencePaymentMethod, setDifferencePaymentMethod] = useState<'original' | 'saved-upi' | 'saved-bank' | 'new-upi' | 'new-bank'>('original');
  const [differenceUpiId, setDifferenceUpiId] = useState('');
  const [differenceBankDetails, setDifferenceBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  });
  const [showNewDifferenceForm, setShowNewDifferenceForm] = useState(false);
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCondition, setAcceptedCondition] = useState(false);
  const [originalProductImage, setOriginalProductImage] = useState('');

  // Zoho payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingExchangeRequest, setPendingExchangeRequest] = useState<{
    requestId: string;
    orderId: string;
    amount: number;
  } | null>(null);

  // ========== BATCH PRODUCT IMAGE FETCHING ==========
  const [productImagesMap, setProductImagesMap] = useState<Record<string, string>>({});
  const [imagesFetched, setImagesFetched] = useState(false);
  const [isFetchingImages, setIsFetchingImages] = useState(false);

  const fetchAllProductImages = async () => {
    if (imagesFetched || isFetchingImages) return;
    
    const allProductIds = new Set<string>();
    orders.forEach(order => {
      order.items?.forEach(item => {
        if (item.productId) {
          allProductIds.add(item.productId);
        }
      });
    });
    
    if (allProductIds.size === 0) return;
    
    setIsFetchingImages(true);
    
    try {
      const authToken = token || localStorage.getItem('customer_token');
      const productIds = Array.from(allProductIds);
      
      const batchSize = 5;
      const imageMap: Record<string, string> = {};
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        const batch = productIds.slice(i, i + batchSize);
        const promises = batch.map(async (productId) => {
          try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
              headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await response.json();
            if (data.success && data.product) {
              const imageUrl = data.product.mainImage?.url || data.product.images?.[0] || '';
              return { productId, imageUrl };
            }
            return { productId, imageUrl: '' };
          } catch {
            return { productId, imageUrl: '' };
          }
        });
        
        const results = await Promise.all(promises);
        results.forEach(result => {
          if (result.imageUrl) {
            imageMap[result.productId] = result.imageUrl;
          }
        });
      }
      
      setProductImagesMap(imageMap);
      setImagesFetched(true);
      
    } catch (error) {
      console.error('Error fetching product images:', error);
    } finally {
      setIsFetchingImages(false);
    }
  };

  const cancelReasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found better price elsewhere",
    "Delivery time too long",
    "Other"
  ];

  const returnReasons = [
    "Product is damaged",
    "Wrong product received",
    "Product is defective",
    "Size doesn't fit",
    "Not as described",
    "Other"
  ];

  // ============ LOAD ZOHO PAYMENTS SCRIPT ==========
  const loadZohoPaymentsScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.ZPayments) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ============ PROCESS EXCHANGE ADDITIONAL PAYMENT ==========
  const processExchangeAdditionalPayment = async (
    orderId: string,
    amount: number,
    returnRequestId: string,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    setIsProcessingPayment(true);
    
    try {
      const isLoaded = await loadZohoPaymentsScript();
      if (!isLoaded) {
        throw new Error("Failed to load Zoho Payments SDK");
      }

      const authToken = token || localStorage.getItem('customer_token');
      
      const response = await fetch(`${API_BASE_URL}/payment/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          orderId: orderId,
          description: `Additional Payment for Exchange ${returnRequestId}`,
          reference_number: returnRequestId
        })
      });

      const data = await response.json();

      if (!data.success || !data.payments_session_id) {
        throw new Error(data.message || "Failed to create Zoho payment session");
      }

      const accountId = import.meta.env.VITE_ZOHO_ACCOUNT_ID || data.account_id || "23137556";
      const apiKey = import.meta.env.VITE_ZOHO_API_KEY || data.api_key || "1003.6314fc4a7d42b81ac85f1ca3dbc545eb.7a647ed7a4a681800edd6c0e26878bbd";

      const config = {
        account_id: accountId,
        domain: "IN",
        otherOptions: {
          api_key: apiKey
        }
      };

      const zpayments = new window.ZPayments(config);

      const handlePaymentCompletion = async (paymentResult: any) => {
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
              payment_id: paymentResult?.payment_id || paymentResult?.id || `ZPAY_${Date.now()}`,
              payments_session_id: data.payments_session_id,
              signature: paymentResult?.signature || "",
              orderId: orderId
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success("Additional payment successful!");
            onSuccess();
          } else {
            throw new Error(verifyData.message || "Payment verification failed");
          }
        } catch (vErr: any) {
          console.error("Verification error:", vErr);
          onError(vErr.message || "Payment verification failed");
        }
      };

      if (typeof zpayments.requestPaymentMethod === 'function') {
        zpayments.requestPaymentMethod({
          session_id: data.payments_session_id,
          onSuccess: handlePaymentCompletion,
          onFailure: (err: any) => onError(err?.message || "Payment failed"),
          onClose: () => onError("Payment cancelled")
        });
      } else if (typeof zpayments.open === 'function') {
        zpayments.open({
          session_id: data.payments_session_id,
          handler: handlePaymentCompletion
        });
      } else {
        await handlePaymentCompletion({ session_id: data.payments_session_id });
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      onError(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getRequestStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      return_received: 'bg-purple-100 text-purple-700 border-purple-200',
      exchange_shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getRequestStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      return_received: 'Return Received',
      exchange_shipped: 'Exchange Shipped'
    };
    return labels[status] || status;
  };

  const fetchReturnRequests = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/returns/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReturnRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  const getRequestForOrder = (orderId: string) => {
    return returnRequests.find(r => r.orderId === orderId);
  };

  // Load orders
  useEffect(() => {
    if (isAuthenticated) {
      const loadOrders = async () => {
        await fetchMyOrders();
        await fetchReturnRequests();
        setLoading(false);
      };
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchMyOrders, token]);

  // Fetch images after orders are loaded
  useEffect(() => {
    if (orders.length > 0 && !imagesFetched && !isFetchingImages) {
      fetchAllProductImages();
    }
  }, [orders, imagesFetched, isFetchingImages]);

  useEffect(() => {
    if (exchangeData && exchangeData.step === 'selecting' && orders.length > 0 && !showReturnModal) {
      const targetOrder = orders.find(o => o.id === exchangeData.orderId);
      if (targetOrder) {
        setSelectedOrder(targetOrder);
      }
      
      setOriginalProductImage(exchangeData.returnProductImage);
      setCurrentProcessingItem({
        productId: exchangeData.returnProductId,
        productName: exchangeData.returnProductName,
        productImage: exchangeData.returnProductImage,
        quantity: 1,
        price: exchangeData.returnProductPrice,
        actionType: 'exchange'
      });
      
      setSelectedProduct({
        productId: exchangeData.returnProductId,
        name: exchangeData.returnProductName,
        image: exchangeData.returnProductImage,
        quantity: 1,
        price: exchangeData.returnProductPrice
      });
      
      setReturnReason(exchangeData.returnReason);
      setReturnDescription(exchangeData.returnDescription);
      setUploadedImages(exchangeData.uploadedImages);
      setAcceptedTerms(exchangeData.acceptedTerms);
      setAcceptedCondition(exchangeData.acceptedCondition);
      
      if (exchangeData.selectedExchangeProduct) {
        setSelectedExchangeProduct(exchangeData.selectedExchangeProduct);
        setExchangeProductId(exchangeData.selectedExchangeProduct.id);
        const diff = exchangeData.selectedExchangeProduct.price - exchangeData.returnProductPrice;
        setPriceDifference(diff);
      }
      
      setRequestType('exchange');
      setShowReturnModal(true);
    }
  }, [exchangeData, orders, showReturnModal]);

  useEffect(() => {
    if (exchangeData && exchangeData.step === 'complete' && exchangeData.selectedExchangeProduct && orders.length > 0 && !showReturnModal) {
      const targetOrder = orders.find(o => o.id === exchangeData.orderId);
      if (targetOrder) {
        setSelectedOrder(targetOrder);
      }
      
      setOriginalProductImage(exchangeData.returnProductImage);
      setCurrentProcessingItem({
        productId: exchangeData.returnProductId,
        productName: exchangeData.returnProductName,
        productImage: exchangeData.returnProductImage,
        quantity: 1,
        price: exchangeData.returnProductPrice,
        actionType: 'exchange'
      });
      
      setSelectedProduct({
        productId: exchangeData.returnProductId,
        name: exchangeData.returnProductName,
        image: exchangeData.returnProductImage,
        quantity: 1,
        price: exchangeData.returnProductPrice
      });
      
      setReturnReason(exchangeData.returnReason);
      setReturnDescription(exchangeData.returnDescription);
      setUploadedImages(exchangeData.uploadedImages);
      setAcceptedTerms(exchangeData.acceptedTerms);
      setAcceptedCondition(exchangeData.acceptedCondition);
      
      if (exchangeData.selectedExchangeProduct) {
        setSelectedExchangeProduct(exchangeData.selectedExchangeProduct);
        setExchangeProductId(exchangeData.selectedExchangeProduct.id);
        const diff = exchangeData.selectedExchangeProduct.price - exchangeData.returnProductPrice;
        setPriceDifference(diff);
      }
      
      setRequestType('exchange');
      setShowReturnModal(true);
      
      setTimeout(() => {
        clearExchangeData();
      }, 2000);
    }
  }, [exchangeData, orders, clearExchangeData, showReturnModal]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const exchangeProductId = params.get('exchangeProduct');
    const orderId = params.get('orderId');
    const returnProductId = params.get('returnProductId');
    const returnPrice = params.get('returnPrice');
    const returnName = params.get('returnName');
    
    if (exchangeProductId && orderId && returnProductId) {
      const loadProduct = async () => {
        try {
          const authToken = token || localStorage.getItem('customer_token');
          const response = await fetch(`${API_BASE_URL}/products/${exchangeProductId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          const data = await response.json();
          const product = data.product || data;
          
          const selectedProductObj = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || ''
          };
          
          if (exchangeData) {
            const updatedData = {
              ...exchangeData,
              selectedExchangeProduct: selectedProductObj,
              step: 'complete' as const,
              timestamp: Date.now()
            };
            setExchangeData(updatedData);
          }
          
          setSelectedExchangeProduct(selectedProductObj);
          setExchangeProductId(selectedProductObj.id);
          
          const diff = selectedProductObj.price - (Number(returnPrice) || 0);
          setPriceDifference(diff);
          
          toast.success(`Selected ${selectedProductObj.name} for exchange`);
          
          window.history.replaceState({}, '', window.location.pathname);
        } catch (error) {
          console.error('Error loading product:', error);
          toast.error('Failed to load product');
        }
      };
      
      loadProduct();
    }
  }, [location.search, token, exchangeData, setExchangeData]);

  const handleRedirectToShop = () => {
    const currentItem = currentProcessingItem || selectedProduct;
    
    if (!currentItem || !selectedOrder) {
      toast.error("Unable to proceed. Please try again.");
      return;
    }
    
    const exchangeDataToStore = {
      orderId: selectedOrder.id,
      returnProductId: currentItem.productId,
      returnProductName: currentItem.productName,
      returnProductPrice: currentItem.price,
      returnProductImage: currentItem.productImage || currentItem.image || '',
      returnReason: returnReason,
      returnDescription: returnDescription,
      uploadedImages: uploadedImages,
      acceptedTerms: acceptedTerms,
      acceptedCondition: acceptedCondition,
      selectedExchangeProduct: selectedExchangeProduct,
      step: 'selecting' as const,
      timestamp: Date.now()
    };
    
    setExchangeData(exchangeDataToStore);
    navigate('/shop?for=exchange');
  };

  const handleSingleItemSubmit = async () => {
    if (!selectedOrder || !returnReason) {
      toast.error('Please select a reason');
      return;
    }
    
    if (uploadedImages.length === 0) {
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
    
    let requestData: any = {
      orderId: selectedOrder.id,
      productId: currentProcessingItem?.productId || selectedProduct?.productId,
      productName: currentProcessingItem?.productName || selectedProduct?.name,
      quantity: currentProcessingItem?.quantity || selectedProduct?.quantity || 1,
      price: currentProcessingItem?.price || selectedProduct?.price || 0,
      reason: returnReason,
      description: returnDescription,
      requestType: requestType,
      images: uploadedImages
    };
    
    if (requestType === 'return') {
      let refundDetails: any = {};
      if (refundMethod === 'original') {
        refundDetails = { method: 'original' };
      } 
      else if (refundMethod === 'saved-upi' && selectedUpiId) {
        refundDetails = { method: 'upi', upiId: selectedUpiId };
      }
      else if (refundMethod === 'saved-bank' && selectedBankDetails.accountNumber) {
        refundDetails = { 
          method: 'bank', 
          bankDetails: {
            accountHolderName: selectedBankDetails.accountHolderName,
            accountNumber: selectedBankDetails.accountNumber,
            bankName: selectedBankDetails.bankName,
            ifscCode: selectedBankDetails.ifscCode
          }
        };
      }
      else if (refundMethod === 'new-upi' && newUpiId) {
        refundDetails = { method: 'upi', upiId: newUpiId };
      }
      else if (refundMethod === 'new-bank' && newBankDetails.accountNumber) {
        refundDetails = { 
          method: 'bank', 
          bankDetails: {
            accountHolderName: newBankDetails.accountHolderName,
            accountNumber: newBankDetails.accountNumber,
            bankName: newBankDetails.bankName,
            ifscCode: newBankDetails.ifscCode
          }
        };
      }
      requestData.refundDetails = refundDetails;
    } 
    else if (requestType === 'exchange') {
      if (!selectedExchangeProduct) {
        toast.error('Please select a product to exchange');
        return;
      }
      
      const priceDiff = selectedExchangeProduct.price - (currentProcessingItem?.price || selectedProduct?.price || 0);
      
      requestData.exchangeDetails = {
        exchangeProductId: selectedExchangeProduct.id,
        exchangeProductName: selectedExchangeProduct.name,
        exchangeProductImage: selectedExchangeProduct.image,
        exchangeProductPrice: selectedExchangeProduct.price,
        originalProductPrice: currentProcessingItem?.price || selectedProduct?.price || 0,
        priceDifference: priceDiff,
        differencePaymentMethod: differencePaymentMethod,
        differencePaymentDetails: {}
      };
      
      if (priceDiff > 0) {
        if (differencePaymentMethod === 'original') {
          requestData.exchangeDetails.differencePaymentDetails = { method: 'original' };
        } else if (differencePaymentMethod === 'saved-upi') {
          const storedUser = localStorage.getItem('user');
          const userData = storedUser ? JSON.parse(storedUser) : null;
          requestData.exchangeDetails.differencePaymentDetails = { method: 'upi', upiId: userData?.bankDetails?.upiId };
        } else if (differencePaymentMethod === 'saved-bank') {
          const storedUser = localStorage.getItem('user');
          const userData = storedUser ? JSON.parse(storedUser) : null;
          requestData.exchangeDetails.differencePaymentDetails = { 
            method: 'bank', 
            bankDetails: {
              accountHolderName: userData?.bankDetails?.accountHolderName,
              accountNumber: userData?.bankDetails?.accountNumber,
              bankName: userData?.bankDetails?.bankName,
              ifscCode: userData?.bankDetails?.ifscCode
            }
          };
        } else if (differencePaymentMethod === 'new-upi' && differenceUpiId) {
          requestData.exchangeDetails.differencePaymentDetails = { method: 'upi', upiId: differenceUpiId };
        } else if (differencePaymentMethod === 'new-bank' && differenceBankDetails.accountNumber) {
          requestData.exchangeDetails.differencePaymentDetails = { 
            method: 'bank', 
            bankDetails: differenceBankDetails
          };
        }
      } else if (priceDiff < 0) {
        if (differencePaymentMethod === 'original') {
          requestData.exchangeDetails.differencePaymentDetails = { method: 'original' };
        } else if (differencePaymentMethod === 'saved-upi') {
          const storedUser = localStorage.getItem('user');
          const userData = storedUser ? JSON.parse(storedUser) : null;
          requestData.exchangeDetails.differencePaymentDetails = { method: 'upi', upiId: userData?.bankDetails?.upiId };
        } else if (differencePaymentMethod === 'saved-bank') {
          const storedUser = localStorage.getItem('user');
          const userData = storedUser ? JSON.parse(storedUser) : null;
          requestData.exchangeDetails.differencePaymentDetails = { 
            method: 'bank', 
            bankDetails: {
              accountHolderName: userData?.bankDetails?.accountHolderName,
              accountNumber: userData?.bankDetails?.accountNumber,
              bankName: userData?.bankDetails?.bankName,
              ifscCode: userData?.bankDetails?.ifscCode
            }
          };
        } else if (differencePaymentMethod === 'new-upi' && differenceUpiId) {
          requestData.exchangeDetails.differencePaymentDetails = { method: 'upi', upiId: differenceUpiId };
        } else if (differencePaymentMethod === 'new-bank' && differenceBankDetails.accountNumber) {
          requestData.exchangeDetails.differencePaymentDetails = { 
            method: 'bank', 
            bankDetails: differenceBankDetails
          };
        }
      }
    }

    setSubmitting(true);
    
    const result = await createReturnRequest(requestData);

    if (result && result.success) {
      if (requestType === 'exchange' && priceDifference > 0 && result.requestId) {
        toast.info("Please complete the additional payment");
        
        await processExchangeAdditionalPayment(
          selectedOrder.id,
          Math.abs(priceDifference),
          result.requestId,
          async () => {
            toast.success("Exchange request submitted with payment!");
            setShowReturnModal(false);
            clearExchangeData();
            resetReturnModal();
            await fetchMyOrders();
            await fetchReturnRequests();
            
            const nextIndex = currentProcessingIndex + 1;
            setCurrentProcessingIndex(nextIndex);
            await processNextItem(processingQueue, nextIndex);
          },
          async (error) => {
            toast.error(`Payment failed: ${error}`);
            setShowReturnModal(false);
            clearExchangeData();
            resetReturnModal();
            await fetchMyOrders();
            await fetchReturnRequests();
          }
        );
      } else {
        setSubmitting(false);
        setShowReturnModal(false);
        clearExchangeData();
        resetReturnModal();
        await fetchMyOrders();
        await fetchReturnRequests();
        
        const nextIndex = currentProcessingIndex + 1;
        setCurrentProcessingIndex(nextIndex);
        await processNextItem(processingQueue, nextIndex);
      }
    } else {
      setSubmitting(false);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handleCancelOrderSubmit = async () => {
    if (!selectedOrder || !cancelReason) {
      toast.error('Please select a reason');
      return;
    }

    setSubmitting(true);
    
    const requestData = {
      orderId: selectedOrder.id,
      productId: selectedOrder.items?.[0]?.productId,
      productName: selectedOrder.items?.[0]?.name,
      quantity: 1,
      price: selectedOrder.total,
      reason: cancelReason,
      description: "",
      requestType: "cancel",
      images: []
    };
    
    const result = await createReturnRequest(requestData);
    setSubmitting(false);

    if (result) {
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder(null);
      await fetchMyOrders();
      await fetchReturnRequests();
      toast.success("Cancellation request submitted successfully");
    }
  };

  const resetReturnModal = () => {
    setReturnReason('');
    setReturnDescription('');
    setUploadedImages([]);
    setImageFiles([]);
    setRefundMethod('original');
    setSelectedUpiId('');
    setSelectedBankDetails({
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    });
    setNewUpiId('');
    setNewBankDetails({
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    });
    setShowNewRefundForm(false);
    setSelectedExchangeProduct(null);
    setExchangeProductId('');
    setPriceDifference(0);
    setSearchProduct('');
    setAvailableProducts([]);
    setDifferencePaymentMethod('original');
    setDifferenceUpiId('');
    setDifferenceBankDetails({
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    });
    setShowNewDifferenceForm(false);
    setAcceptedTerms(false);
    setAcceptedCondition(false);
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'out for delivery':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'out for delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      case 'returned':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colorClass = getStatusColor(status);
    const icon = getStatusIcon(status);
    const displayStatus = status || 'Confirmed';
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
        {icon}
        {displayStatus}
      </span>
    );
  };

  const RequestStatusBadgeComponent = ({ request }: { request: ReturnRequestInfo }) => {
    const statusClass = getRequestStatusBadge(request.status);
    const statusLabel = getRequestStatusLabel(request.status);
    
    let icon = null;
    if (request.status === 'pending') icon = <Clock className="w-3 h-3" />;
    else if (request.status === 'approved') icon = <CheckCircle className="w-3 h-3" />;
    else if (request.status === 'rejected') icon = <XCircle className="w-3 h-3" />;
    else if (request.status === 'return_received') icon = <Truck className="w-3 h-3" />;
    else if (request.status === 'exchange_shipped') icon = <Truck className="w-3 h-3" />;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
        {icon}
        {statusLabel}
      </span>
    );
  };

  const getDisplayOrderId = (order: SimpleOrder) => {
    return order.orderNumber || order.id;
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCustomerId = () => {
    if (user?.customerId) {
      return user.customerId;
    }
    return 'Loading...';
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    setImageFiles([...imageFiles, ...files]);
    
    const newImages: string[] = [];
    for (const file of files) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    setUploadedImages([...uploadedImages, ...newImages]);
    toast.success(`${files.length} image(s) selected`);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleMultiItemSelect = (item: any, action: 'return' | 'exchange' | 'none') => {
    const existingIndex = selectedItems.findIndex(i => i.productId === item.productId);
    
    if (existingIndex >= 0) {
      const updated = [...selectedItems];
      if (action === 'none') {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex] = { ...updated[existingIndex], actionType: action };
      }
      setSelectedItems(updated);
    } else if (action !== 'none') {
      setSelectedItems([...selectedItems, {
        productId: item.productId,
        productName: item.name,
        productImage: item.productImage || item.image,
        quantity: item.quantity,
        price: item.price,
        actionType: action
      }]);
    }
  };

  const handleProceedToDetails = () => {
    const selectedForAction = selectedItems.filter(i => i.actionType !== 'none');
    if (selectedForAction.length === 0) {
      toast.error('Please select at least one product for return or exchange');
      return;
    }
    
    setProcessingQueue(selectedForAction);
    setCurrentProcessingIndex(0);
    processNextItem(selectedForAction, 0);
  };

  const processNextItem = async (queue: SelectedItem[], index: number) => {
    if (index >= queue.length) {
      setShowMultiItemModal(false);
      setSelectedItems([]);
      setProcessingQueue([]);
      setCurrentProcessingItem(null);
      await fetchMyOrders();
      await fetchReturnRequests();
      toast.success('All requests submitted successfully!');
      return;
    }
    
    const item = queue[index];
    setCurrentProcessingItem(item);
    
    if (item.actionType === 'return') {
      setSelectedProduct({
        productId: item.productId,
        name: item.productName,
        image: item.productImage,
        quantity: item.quantity,
        price: item.price
      });
      setOriginalProductImage(item.productImage);
      setRequestType('return');
      setReturnReason('');
      setReturnDescription('');
      setUploadedImages([]);
      setImageFiles([]);
      setRefundMethod('original');
      setShowReturnModal(true);
    } else if (item.actionType === 'exchange') {
      setSelectedProduct({
        productId: item.productId,
        name: item.productName,
        image: item.productImage,
        quantity: item.quantity,
        price: item.price
      });
      setOriginalProductImage(item.productImage);
      setRequestType('exchange');
      setReturnReason('');
      setReturnDescription('');
      setUploadedImages([]);
      setImageFiles([]);
      setSelectedExchangeProduct(null);
      setExchangeProductId('');
      setPriceDifference(0);
      setSearchProduct('');
      setShowReturnModal(true);
    }
  };

  const loadAvailableProducts = async () => {
    setLoadingProducts(true);
    try {
      const authToken = token || localStorage.getItem('customer_token');
      const allProductsResponse = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await allProductsResponse.json();
      
      let allProducts = [];
      if (Array.isArray(data)) {
        allProducts = data;
      } else if (data.products && Array.isArray(data.products)) {
        allProducts = data.products;
      } else {
        allProducts = [];
      }
      
      let products = allProducts.filter((p: any) => {
        if (!p || !p._id) return false;
        if (p._id === currentProcessingItem?.productId) return false;
        if (p.stock <= 0) return false;
        if (p.status && p.status !== 'Published') return false;
        return true;
      });
      
      if (searchProduct && searchProduct.trim()) {
        products = products.filter((p: any) => 
          p.name && p.name.toLowerCase().includes(searchProduct.toLowerCase())
        );
      }
      
      setAvailableProducts(products.map((p: any) => ({
        id: p._id,
        name: p.name || 'Product',
        price: p.price || 0,
        image: p.images?.[0] || '',
        category: p.category,
        stock: p.stock,
        description: p.description || ''
      })));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleExchangeProductSelect = (product: any) => {
    setSelectedExchangeProduct(product);
    setExchangeProductId(product.id);
    const diff = product.price - (currentProcessingItem?.price || selectedProduct?.price || 0);
    setPriceDifference(diff);
    setDifferencePaymentMethod('original');
    setDifferenceUpiId('');
    setDifferenceBankDetails({
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    });
    setShowNewDifferenceForm(false);
  };

  if (authLoading || (loading && ordersLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Order Summary"
          subtitle="Order History"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Order Summary' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Customer ID Card */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your Customer ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-primary text-lg">
                        {getCustomerId()}
                      </p>
                      {user?.customerId && (
                        <button
                          onClick={() => copyToClipboard(getCustomerId(), 'customer-id')}
                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                        >
                          {copiedId === 'customer-id' ? 
                            <Check className="w-4 h-4 text-green-500" /> : 
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          }
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Use this ID for customer support</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{orders.length}</p>
                </div>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  const existingRequest = getRequestForOrder(order.id);
                  const hasPendingRequest = existingRequest && existingRequest.status === 'pending';
                  const isCancelled = order.status === 'Cancelled';
                  const hasReturnRequest = existingRequest?.requestType === 'return';
                  const hasExchangeRequest = existingRequest?.requestType === 'exchange';
                  const isRequestApproved = existingRequest?.status === 'approved';
                  const isRequestRejected = existingRequest?.status === 'rejected';
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border/30 p-6 rounded-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border/30">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <div className="flex items-center gap-2">
                            <p className="font-display text-lg text-foreground">
                              {getDisplayOrderId(order)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(getDisplayOrderId(order), `order-${order.id}`)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                            >
                              {copiedId === `order-${order.id}` ? 
                                <Check className="w-4 h-4 text-green-500" /> : 
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              }
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-foreground">{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <StatusBadge status={order.status || 'Confirmed'} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-display text-lg text-primary">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      {/* Request Status Badge */}
                      {existingRequest && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">
                                {existingRequest.requestType === 'cancel' && 'Cancellation Request'}
                                {existingRequest.requestType === 'return' && 'Return Request'}
                                {existingRequest.requestType === 'exchange' && 'Exchange Request'}
                              </span>
                              <RequestStatusBadgeComponent request={existingRequest} />
                            </div>
                            {existingRequest.exchangeDetails?.exchangeShippingTracking && (
                              <Link 
                                to="/track-order" 
                                state={{ trackingId: existingRequest.exchangeDetails.exchangeShippingTracking }}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3" />
                                Track Exchange →
                              </Link>
                            )}
                            {existingRequest.exchangeDetails?.returnShippingTracking && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Return Tracking: {existingRequest.exchangeDetails.returnShippingTracking}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    {/* ========== ORDER ITEMS DISPLAY - FINAL WORKING VERSION ========== */}
{/* ========== ORDER ITEMS DISPLAY - UPDATED WITH FREE SIZE ========== */}
<div className="space-y-3 mb-4">
  {order.items && order.items.length > 0 ? (
    order.items.map((item, idx) => {
      // ✅ Size from backend - show Free Size if no size
      const productSize = item.size || item.selectedSize || '';
      const displaySize = (!productSize || productSize === '') ? 'Free Size' : productSize;
      
      // ✅ Image - Priority order
      let productImage = '';
      
      if (productImagesMap && productImagesMap[item.productId]) {
        productImage = productImagesMap[item.productId];
      }
      else if (item.productImage && item.productImage !== '') {
        productImage = item.productImage;
      }
      else if (item.image && item.image !== '') {
        productImage = item.image;
      }
      else {
        productImage = `https://placehold.co/200x200/3b82f6/white?text=${encodeURIComponent((item.productName || item.name || 'P').substring(0, 1))}`;
      }
      
      const productName = item.productName || item.name || 'Product';
      const productPrice = item.price || 0;
      const productQuantity = item.quantity || 1;
      const isLoading = !imagesFetched && !productImagesMap[item.productId];
      
      return (
        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          {/* Product Image */}
          <div className="w-16 h-16 flex-shrink-0">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <img 
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/200x200/3b82f6/white?text=${encodeURIComponent(productName.substring(0, 1))}`;
                }}
              />
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex-1">
            <p className="text-foreground text-sm font-medium">{productName}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-muted-foreground text-xs">Qty: {productQuantity}</p>
              
              {/* ✅ SIZE BADGE - Always show Free Size if no size */}
              <span className="inline-flex items-center gap-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary font-medium">
                {displaySize === 'Free Size' ? ' Free Size' : `Size: ${displaySize}`}
              </span>
              
              {item.productSku && (
                <p className="text-muted-foreground text-xs">SKU: {item.productSku}</p>
              )}
            </div>
            
            <p className="text-muted-foreground text-[11px] mt-1">
              {formatPrice(productPrice)} each
            </p>
          </div>
          
          {/* Total Price */}
          <div className="text-right">
            <span className="text-primary text-sm font-semibold">
              {formatPrice(productPrice * productQuantity)}
            </span>
          </div>
        </div>
      );
    })
  ) : (
    <div className="flex items-center justify-center py-8">
      <p className="text-muted-foreground text-sm">No items found</p>
    </div>
  )}
</div>

                      {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <div className="mb-4 p-3 bg-primary/5 rounded-sm">
                          <p className="text-sm text-muted-foreground">
                            Estimated Delivery: <span className="text-foreground font-medium">{order.estimatedDelivery}</span>
                          </p>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className="mb-4 p-3 bg-primary/10 rounded-sm">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <Truck className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Tracking Number</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary font-mono text-sm font-semibold">
                                    {order.trackingNumber}
                                  </p>
                                  <button
                                    onClick={() => copyToClipboard(order.trackingNumber, `tracking-${order.id}`)}
                                    className="p-1 hover:bg-primary/20 rounded transition-colors"
                                  >
                                    {copiedId === `tracking-${order.id}` ? 
                                      <Check className="w-3 h-3 text-green-500" /> : 
                                      <Copy className="w-3 h-3 text-primary" />
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>
                            <Link
                              to="/track-order"
                              state={{ trackingId: order.trackingNumber }}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4" />
                              Track Order
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4 pt-3 border-t">
                        {(order.status === 'Confirmed' || order.status === 'Pending Payment') && !isCancelled && !hasPendingRequest && !hasReturnRequest && !hasExchangeRequest && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Cancel Order
                          </Button>
                        )}
                        
                        {order.status === 'Delivered' && !hasPendingRequest && !hasReturnRequest && !hasExchangeRequest && (
                          <>
                            {order.items && order.items.length === 1 ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-500 border-orange-500 hover:bg-orange-50"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setSelectedProduct(order.items[0]);
                                    setOriginalProductImage(order.items[0].productImage || order.items[0].image);
                                    setRequestType('return');
                                    setCurrentProcessingItem({
                                      productId: order.items[0].productId,
                                      productName: order.items[0].name,
                                      productImage: order.items[0].productImage || order.items[0].image,
                                      quantity: order.items[0].quantity,
                                      price: order.items[0].price,
                                      actionType: 'return'
                                    });
                                    setProcessingQueue([]);
                                    setShowReturnModal(true);
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Return
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setSelectedProduct(order.items[0]);
                                    setOriginalProductImage(order.items[0].productImage || order.items[0].image);
                                    setRequestType('exchange');
                                    setCurrentProcessingItem({
                                      productId: order.items[0].productId,
                                      productName: order.items[0].name,
                                      productImage: order.items[0].productImage || order.items[0].image,
                                      quantity: order.items[0].quantity,
                                      price: order.items[0].price,
                                      actionType: 'exchange'
                                    });
                                    setProcessingQueue([]);
                                    setShowReturnModal(true);
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Exchange
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-purple-500 border-purple-500 hover:bg-purple-50"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setSelectedItems(order.items.map((item: any) => ({
                                    productId: item.productId,
                                    productName: item.name,
                                    productImage: item.productImage || item.image,
                                    quantity: item.quantity,
                                    price: item.price,
                                    actionType: 'none'
                                  })));
                                  setShowMultiItemModal(true);
                                }}
                              >
                                <Package className="w-3 h-3 mr-1" />
                                Return / Exchange Items
                              </Button>
                            )}
                          </>
                        )}
                        
                        {hasPendingRequest && (
                          <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Your {existingRequest?.requestType} request is pending review
                          </div>
                        )}
                        
                        {hasReturnRequest && existingRequest?.status === 'approved' && (
                          <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Return request approved. Pickup will be scheduled soon.
                          </div>
                        )}
                        
                        {hasExchangeRequest && existingRequest?.status === 'approved' && (
                          <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Exchange request approved. Please return your product.
                          </div>
                        )}
                        
                        {isCancelled && (
                          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            This order has been cancelled
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-md inline-block">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Cancel Order Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason for cancellation</Label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-background"
              >
                <option value="">Select a reason</option>
                {cancelReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>Close</Button>
            <Button variant="destructive" onClick={handleCancelOrderSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Item Selection Modal */}
      <Dialog open={showMultiItemModal} onOpenChange={(open) => !open && setShowMultiItemModal(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Items for Return or Exchange</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedOrder?.items.map((item, idx) => {
              const selectedItem = selectedItems.find(i => i.productId === item.productId);
              const itemImage = productImagesMap[item.productId] || item.productImage || item.image || 'https://placehold.co/200x200?text=Product';
              return (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <img 
                      src={itemImage} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image')}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant={selectedItem?.actionType === 'return' ? 'default' : 'outline'}
                      className={selectedItem?.actionType === 'return' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                      onClick={() => handleMultiItemSelect(item, 'return')}
                    >
                      Return
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedItem?.actionType === 'exchange' ? 'default' : 'outline'}
                      className={selectedItem?.actionType === 'exchange' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                      onClick={() => handleMultiItemSelect(item, 'exchange')}
                    >
                      Exchange
                    </Button>
                    {selectedItem && selectedItem.actionType !== 'none' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-500"
                        onClick={() => handleMultiItemSelect(item, 'none')}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMultiItemModal(false)}>Cancel</Button>
            <Button onClick={handleProceedToDetails}>Continue to Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return/Exchange Details Modal */}
      <Dialog open={showReturnModal} onOpenChange={(open) => !open && setShowReturnModal(false)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentProcessingItem?.actionType === 'return' || requestType === 'return' ? 'Return Product' : 'Exchange Product'}
              {currentProcessingItem && ` - ${currentProcessingItem.productName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Product Info */}
            {(currentProcessingItem || selectedProduct) && (
              <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <img 
                  src={currentProcessingItem?.productImage || selectedProduct?.image || originalProductImage || 'https://placehold.co/200x200?text=Product'} 
                  alt={currentProcessingItem?.productName || selectedProduct?.name || 'Original Product'} 
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image')}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">Original: {currentProcessingItem?.productName || selectedProduct?.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {currentProcessingItem?.quantity || selectedProduct?.quantity || 1}</p>
                  <p className="text-sm font-bold text-orange-600">{formatPrice(currentProcessingItem?.price || selectedProduct?.price || 0)}</p>
                </div>
              </div>
            )}
            
            {/* Selected Exchange Product */}
            {selectedExchangeProduct && (
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <img 
                  src={selectedExchangeProduct.image || selectedExchangeProduct.productImage || 'https://placehold.co/200x200?text=Product'} 
                  alt={selectedExchangeProduct.name} 
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image')}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">Exchange: {selectedExchangeProduct.name}</p>
                  <p className="text-xs text-green-600">Selected for exchange</p>
                  <p className="text-sm font-bold text-green-600">{formatPrice(selectedExchangeProduct.price)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedExchangeProduct(null);
                    setExchangeProductId('');
                    setPriceDifference(0);
                  }}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {/* Progress indicator */}
            {processingQueue.length > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Item {currentProcessingIndex + 1} of {processingQueue.length}
              </div>
            )}
            
            {/* Reason */}
            <div>
              <Label>Reason for {requestType} *</Label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-background"
              >
                <option value="">Select a reason</option>
                {returnReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            
            {/* Description */}
            <div>
              <Label>Additional Details (Optional)</Label>
              <Textarea
                placeholder="Please provide more details..."
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <Label>Upload Proof Images *</Label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="proof-upload-return"
                />
                <label htmlFor="proof-upload-return" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-400">Max 5 images (JPG, PNG)</span>
                </label>
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {uploadedImages.map((img, idx) => (
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
            
            {/* Return Section */}
            {(requestType === 'return' || currentProcessingItem?.actionType === 'return') && (
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="text-sm font-semibold block mb-3">Select Refund Method</Label>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-all">
                    <input 
                      type="radio" 
                      name="refundOption" 
                      checked={refundMethod === 'original'} 
                      onChange={() => { 
                        setRefundMethod('original'); 
                        setShowNewRefundForm(false); 
                      }} 
                      className="w-4 h-4 text-primary" 
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Original Payment Method</p>
                      <p className="text-xs text-gray-500">Amount will be credited to your original payment source</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </label>
                  
                  {(() => {
                    const storedUser = localStorage.getItem('user');
                    const userData = storedUser ? JSON.parse(storedUser) : null;
                    const bankDetails = userData?.bankDetails || {};
                    
                    return bankDetails.upiId ? (
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-all">
                        <input 
                          type="radio" 
                          name="refundOption" 
                          checked={refundMethod === 'saved-upi'} 
                          onChange={() => { 
                            setRefundMethod('saved-upi'); 
                            setSelectedUpiId(bankDetails.upiId); 
                            setShowNewRefundForm(false); 
                          }} 
                          className="w-4 h-4 text-primary" 
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Saved UPI ID</p>
                          <p className="text-xs text-gray-500">{bankDetails.upiId}</p>
                          <p className="text-xs text-green-600 mt-0.5">✓ Saved in your profile</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-green-500" />
                      </label>
                    ) : null;
                  })()}
                  
                  {(() => {
                    const storedUser = localStorage.getItem('user');
                    const userData = storedUser ? JSON.parse(storedUser) : null;
                    const bankDetails = userData?.bankDetails || {};
                    
                    return bankDetails.accountNumber ? (
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-all">
                        <input 
                          type="radio" 
                          name="refundOption" 
                          checked={refundMethod === 'saved-bank'} 
                          onChange={() => { 
                            setRefundMethod('saved-bank'); 
                            setSelectedBankDetails({ 
                              accountHolderName: bankDetails.accountHolderName || '', 
                              accountNumber: bankDetails.accountNumber, 
                              bankName: bankDetails.bankName || '', 
                              ifscCode: bankDetails.ifscCode || '' 
                            }); 
                            setShowNewRefundForm(false); 
                          }} 
                          className="w-4 h-4 text-primary" 
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Saved Bank Account</p>
                          <p className="text-xs text-gray-500">
                            {bankDetails.bankName || 'Bank'} - XXXX{bankDetails.accountNumber.slice(-4)}
                          </p>
                          <p className="text-xs text-green-600 mt-0.5">✓ Saved in your profile</p>
                        </div>
                        <Banknote className="w-5 h-5 text-blue-500" />
                      </label>
                    ) : null;
                  })()}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowNewRefundForm(!showNewRefundForm)}
                      className="flex items-center gap-2 text-primary text-sm font-medium hover:underline w-full p-2"
                    >
                      <Plus className="w-4 h-4" />
                      + Add New Refund Method
                    </button>
                    
                    {showNewRefundForm && (
                      <div className="mt-3 ml-6 space-y-3 border-l-2 border-primary/30 pl-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="refundOption"
                              checked={refundMethod === 'new-upi'}
                              onChange={() => setRefundMethod('new-upi')}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm font-medium">New UPI ID</span>
                          </label>
                          {refundMethod === 'new-upi' && (
                            <Input
                              placeholder="Enter UPI ID (e.g., name@upi)"
                              value={newUpiId}
                              onChange={(e) => setNewUpiId(e.target.value)}
                              className="text-sm ml-6"
                            />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="refundOption"
                              checked={refundMethod === 'new-bank'}
                              onChange={() => setRefundMethod('new-bank')}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm font-medium">New Bank Account</span>
                          </label>
                          {refundMethod === 'new-bank' && (
                            <div className="ml-6 space-y-2">
                              <Input
                                placeholder="Account Holder Name"
                                value={newBankDetails.accountHolderName}
                                onChange={(e) => setNewBankDetails({...newBankDetails, accountHolderName: e.target.value})}
                                className="text-sm"
                              />
                              <Input
                                placeholder="Account Number"
                                value={newBankDetails.accountNumber}
                                onChange={(e) => setNewBankDetails({...newBankDetails, accountNumber: e.target.value})}
                                className="text-sm"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Bank Name"
                                  value={newBankDetails.bankName}
                                  onChange={(e) => setNewBankDetails({...newBankDetails, bankName: e.target.value})}
                                  className="text-sm"
                                />
                                <Input
                                  placeholder="IFSC Code"
                                  value={newBankDetails.ifscCode}
                                  onChange={(e) => setNewBankDetails({...newBankDetails, ifscCode: e.target.value})}
                                  className="text-sm uppercase"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <p>ℹ️ Refund will be processed within 5-7 business days after return pickup and quality check.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Exchange Section */}
            {(requestType === 'exchange' || currentProcessingItem?.actionType === 'exchange') && (
              <div className="bg-blue-50 rounded-lg p-4">
                <Label className="text-sm font-semibold block mb-3">Select Product to Exchange</Label>
                
                {selectedExchangeProduct ? (
                  <div className="bg-green-100 rounded-lg p-3 mb-3 border border-green-300">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedExchangeProduct.image || selectedExchangeProduct.productImage || 'https://placehold.co/200x200?text=Product'} 
                        alt={selectedExchangeProduct.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image')}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">{selectedExchangeProduct.name}</p>
                        <p className="text-primary font-bold text-lg">₹{selectedExchangeProduct.price.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1">✓ Selected for exchange</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedExchangeProduct(null);
                          setExchangeProductId('');
                          setPriceDifference(0);
                        }}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                        Change
                      </Button>
                    </div>
                    
                    {priceDifference !== 0 && (
                      <div className={`mt-3 pt-3 border-t ${priceDifference > 0 ? 'border-orange-200' : 'border-green-200'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className="text-sm font-medium">Price Difference</p>
                            <p className="text-xs text-gray-600">
                              Original: ₹{(currentProcessingItem?.price || selectedProduct?.price || 0).toLocaleString()} → 
                              Exchange: ₹{selectedExchangeProduct.price.toLocaleString()}
                            </p>
                          </div>
                          <p className={`text-xl font-bold ${priceDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {priceDifference > 0 ? `+${formatPrice(priceDifference)}` : formatPrice(priceDifference)}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <Label className="text-sm font-semibold block mb-2">
                            {priceDifference > 0 ? 'Pay Extra Amount via' : 'Receive Refund via'}
                          </Label>
                          
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-white transition-colors">
                              <input 
                                type="radio" 
                                name="diffPaymentMethod" 
                                checked={differencePaymentMethod === 'original'} 
                                onChange={() => {
                                  setDifferencePaymentMethod('original');
                                  setShowNewDifferenceForm(false);
                                }} 
                                className="w-4 h-4 text-primary" 
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Original Payment Method</p>
                                <p className="text-xs text-gray-500">
                                  {priceDifference > 0 ? 'Pay using same card/UPI used for order' : 'Refund to original payment source'}
                                </p>
                              </div>
                              <CreditCard className="w-5 h-5 text-gray-400" />
                            </label>
                            
                            {(() => {
                              const storedUser = localStorage.getItem('user');
                              const userData = storedUser ? JSON.parse(storedUser) : null;
                              const bankDetails = userData?.bankDetails || {};
                              
                              return bankDetails.upiId ? (
                                <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-white transition-colors">
                                  <input 
                                    type="radio" 
                                    name="diffPaymentMethod" 
                                    checked={differencePaymentMethod === 'saved-upi'} 
                                    onChange={() => {
                                      setDifferencePaymentMethod('saved-upi');
                                      setShowNewDifferenceForm(false);
                                    }} 
                                    className="w-4 h-4 text-primary" 
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Saved UPI ID</p>
                                    <p className="text-xs text-gray-500">{bankDetails.upiId}</p>
                                  </div>
                                  <CreditCard className="w-5 h-5 text-green-500" />
                                </label>
                              ) : null;
                            })()}
                            
                            {(() => {
                              const storedUser = localStorage.getItem('user');
                              const userData = storedUser ? JSON.parse(storedUser) : null;
                              const bankDetails = userData?.bankDetails || {};
                              
                              return bankDetails.accountNumber ? (
                                <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-white transition-colors">
                                  <input 
                                    type="radio" 
                                    name="diffPaymentMethod" 
                                    checked={differencePaymentMethod === 'saved-bank'} 
                                    onChange={() => {
                                      setDifferencePaymentMethod('saved-bank');
                                      setShowNewDifferenceForm(false);
                                    }} 
                                    className="w-4 h-4 text-primary" 
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Saved Bank Account</p>
                                    <p className="text-xs text-gray-500">
                                      {bankDetails.bankName || 'Bank'} - XXXX{bankDetails.accountNumber?.slice(-4) || '****'}
                                    </p>
                                  </div>
                                  <Banknote className="w-5 h-5 text-blue-500" />
                                </label>
                              ) : null;
                            })()}
                            
                            <div>
                              <button
                                type="button"
                                onClick={() => setShowNewDifferenceForm(!showNewDifferenceForm)}
                                className="flex items-center gap-2 text-primary text-sm font-medium hover:underline w-full p-2 mt-1"
                              >
                                <Plus className="w-4 h-4" />
                                + Add New {priceDifference > 0 ? 'Payment' : 'Refund'} Method
                              </button>
                              
                              {showNewDifferenceForm && (
                                <div className="mt-2 ml-6 space-y-3 border-l-2 border-primary/30 pl-4">
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="newDiffType"
                                        checked={differencePaymentMethod === 'new-upi'}
                                        onChange={() => setDifferencePaymentMethod('new-upi')}
                                        className="w-4 h-4 text-primary"
                                      />
                                      <span className="text-sm font-medium">New UPI ID</span>
                                    </label>
                                    {differencePaymentMethod === 'new-upi' && (
                                      <Input
                                        placeholder="Enter UPI ID (e.g., name@upi)"
                                        value={differenceUpiId}
                                        onChange={(e) => setDifferenceUpiId(e.target.value)}
                                        className="text-sm"
                                      />
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="newDiffType"
                                        checked={differencePaymentMethod === 'new-bank'}
                                        onChange={() => setDifferencePaymentMethod('new-bank')}
                                        className="w-4 h-4 text-primary"
                                      />
                                      <span className="text-sm font-medium">New Bank Account</span>
                                    </label>
                                    {differencePaymentMethod === 'new-bank' && (
                                      <div className="space-y-2 ml-6">
                                        <Input
                                          placeholder="Account Holder Name"
                                          value={differenceBankDetails.accountHolderName}
                                          onChange={(e) => setDifferenceBankDetails({...differenceBankDetails, accountHolderName: e.target.value})}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="Account Number"
                                          value={differenceBankDetails.accountNumber}
                                          onChange={(e) => setDifferenceBankDetails({...differenceBankDetails, accountNumber: e.target.value})}
                                          className="text-sm"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input
                                            placeholder="Bank Name"
                                            value={differenceBankDetails.bankName}
                                            onChange={(e) => setDifferenceBankDetails({...differenceBankDetails, bankName: e.target.value})}
                                            className="text-sm"
                                          />
                                          <Input
                                            placeholder="IFSC Code"
                                            value={differenceBankDetails.ifscCode}
                                            onChange={(e) => setDifferenceBankDetails({...differenceBankDetails, ifscCode: e.target.value})}
                                            className="text-sm uppercase"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className={`mt-3 p-2 rounded text-xs ${priceDifference > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {priceDifference > 0 ? (
                              <p>⚠️ You will be redirected to payment gateway to pay the extra amount.</p>
                            ) : (
                              <p>✓ Refund will be processed to your selected account within 5-7 business days.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 text-center mb-3">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">No product selected for exchange</p>
                    <Button
                      onClick={handleRedirectToShop}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isProcessingPayment}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Browse Products to Exchange
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Terms */}
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms} 
                  onChange={(e) => setAcceptedTerms(e.target.checked)} 
                  className="mt-0.5" 
                />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <Link 
                    to="/RefundCancellationPage" 
                    target="_blank"
                    className="text-primary hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Return & Refund Policy
                  </Link>
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
                  I confirm the product is unused and in original condition as per our{' '}
                  <Link 
                    to="/terms" 
                    target="_blank"
                    className="text-primary hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowReturnModal(false);
              resetReturnModal();
            }}>Cancel</Button>
            <Button 
              onClick={handleSingleItemSubmit} 
              disabled={submitting || isProcessingPayment}
            >
              {(submitting || isProcessingPayment) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isProcessingPayment ? "Processing Payment..." : "Submit Request"}
              {processingQueue.length > 0 && ` (${currentProcessingIndex + 1}/${processingQueue.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderSummary;