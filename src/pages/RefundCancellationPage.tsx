// RefundCancellationPage.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';

const RefundCancellationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Refund & Cancellation Policy"
          subtitle="JewelsKart India"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Refund & Cancellation Policy' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">Refund & Cancellation Policy – JewelsKart India</h1>
              <p className="text-muted-foreground">Last Updated: April 13, 2026</p>
              <p className="text-gray-600 mt-2">At JewelsKart India, customer satisfaction is our priority. Please read our Refund & Cancellation Policy carefully before making a purchase.</p>
            </div>

            {/* Mandatory Unboxing Video Alert */}
            <div className="p-5 bg-amber-50 border-2 border-amber-400 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-lg font-bold text-amber-900">
                <span className="text-amber-600 font-black">⚠️ IMPORTANT MANDATORY CONDITION</span>
              </div>
              <p className="text-amber-900 text-sm font-medium leading-relaxed">
                <strong>Important:</strong> A complete box-opening / unboxing video is mandatory to be eligible for a return or exchange. The video should clearly show the sealed package being opened and the product inside. Requests without an unboxing video will not be accepted.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Order Cancellation</h2>
              <p className="text-gray-600">Orders can be cancelled only before they are dispatched from our warehouse. Once an order has been shipped or dispatched, it cannot be cancelled. To cancel an order, customers must contact us immediately via our official email or customer support number with order details. If the cancellation request is approved, the refund will be processed as per our refund policy.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Return Policy</h2>
              <p className="text-gray-600">Customers can request a return within <strong>7 days of delivery</strong>. After 7 days from delivery, the option to request a return or exchange will be automatically disabled.</p>
              <div className="mt-2 pl-4 border-l-4 border-primary">
                <p className="font-medium text-gray-700">Return Conditions:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>Return requests must be submitted through your account within 7 days of delivery along with the mandatory unboxing video.</li>
                  <li>Products must be returned in original condition, unused, unworn, and with original packaging, tags, and invoice intact.</li>
                  <li>Customized, engraved, made-to-order, or personalized jewellery items are non-returnable and non-refundable.</li>
                  <li>Any product showing signs of use, wear, or tampering will not be eligible for return.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Exchange Policy</h2>
              <p className="text-gray-600">Exchange requests must be raised within <strong>7 days of delivery</strong>. Once the original returned product is picked up and received at our facility, the replacement product may take approximately <strong>7 days to process and send</strong>.</p>
              <p className="text-gray-600">The same mandatory condition applies: A complete box-opening / unboxing video (MP4, MOV, WEBM) showing the sealed package being opened is required for exchange requests.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Refund Policy</h2>
              <p className="text-gray-600">Once the returned product is received and inspected by our team, the refund will be approved or rejected. Approved refunds will be processed within 5–7 business days. Refunds will be credited to your selected payment/bank account or original mode of payment.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Non-Refundable Items</h2>
              <p className="text-gray-600">The following items are not eligible for refund or return: Customized or personalized jewellery, items bought under sale, discount, or promotional offers, and products returned without original packaging or proof of purchase.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Shipping Damage</h2>
              <p className="text-gray-600">If your product arrives damaged, please share unboxing photos or videos within 24 hours of delivery. Claims without proper proof may not be accepted.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Contact Information</h2>
              <p className="text-gray-600">
                Email: support@jewelskartindia.com<br />
                Phone: +91 98765 43210<br />
                Working Hours: Monday – Saturday (10:00 AM – 6:00 PM)
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundCancellationPage;