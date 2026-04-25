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

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Order Cancellation</h2>
              <p className="text-gray-600">Orders can be cancelled only before they are dispatched from our warehouse. Once an order has been shipped or dispatched, it cannot be cancelled. To cancel an order, customers must contact us immediately via our official email or customer support number with order details. If the cancellation request is approved, the refund will be processed as per our refund policy.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Returns & Exchanges</h2>
              <p className="text-gray-600">We accept returns only in the following cases: the product received is damaged, defective, or incorrect or different from what was ordered.</p>
              <div className="mt-2 pl-4 border-l-4 border-primary">
                <p className="font-medium text-gray-700">Return Conditions:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>Customers must notify us within 24 hours of delivery by email or WhatsApp with clear photos/videos of the product.</li>
                  <li>Products must be returned in original condition, unused, unworn, and with original packaging, tags, and invoice intact.</li>
                  <li>Customized, engraved, made-to-order, or personalized jewellery items are non-returnable and non-refundable.</li>
                  <li>Any product showing signs of use, wear, or tampering will not be eligible for return.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Refund Policy</h2>
              <p className="text-gray-600">Once the returned product is received and inspected by our team, the refund will be approved or rejected. Approved refunds will be processed within 7–10 business days. Refunds will be credited to the original mode of payment only (UPI, Card, Net Banking, etc.). Shipping charges are non-refundable, unless the return is due to a JewelsKart India error (damaged/incorrect item).</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Replacement Policy</h2>
              <p className="text-gray-600">In case of damaged or incorrect products, we may offer a replacement instead of a refund, subject to product availability. Replacement products will be shipped only after the returned item is received and verified.</p>
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