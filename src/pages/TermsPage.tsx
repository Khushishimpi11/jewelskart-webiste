// TermsPage.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Terms & Conditions"
          subtitle="JewelsKart India"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]}
        />

        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">Terms & Conditions – JewelsKart India</h1>
              <p className="text-muted-foreground">Last Updated: April 13, 2026</p>
              <p className="text-gray-600 mt-2">Welcome to JewelsKart India! These Terms & Conditions govern your use of our website, products, and services. By accessing or using our portal (jewelskartindia.com), you agree to be bound by these Terms.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-gray-600">By visiting or placing an order on JewelsKart India, you agree to these Terms & Conditions, our Privacy Policy, and Refund & Cancellation Policy. If you do not agree with any part of these terms, please do not use our website.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Eligibility</h2>
              <p className="text-gray-600">You must be at least 18 years old or accessing with parental/guardian consent to use this website, purchase products, or place orders.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Account Registration</h2>
              <p className="text-gray-600">To make a purchase, you may be required to create an account by providing accurate and complete information. You are responsible for safeguarding your account credentials and for all actions taken under your account. JewelsKart India is not liable for any unauthorized use of your account.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Products & Pricing</h2>
              <p className="text-gray-600">All product descriptions, images, and pricing are displayed for customer convenience. We strive for accuracy; however, in rare cases discrepancies might occur. JewelsKart India reserves the right to correct errors, inaccuracies, or omissions and to change or update information at any time without prior notice. Prices are listed in Indian Rupees (₹) and may change without notice.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Orders & Acceptance</h2>
              <p className="text-gray-600">When you place an order, you agree to receive electronic communications regarding your order. JewelsKart India reserves the right to accept or reject orders for any reason, including product availability, pricing errors, or suspicion of fraud.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Payments</h2>
              <p className="text-gray-600">We accept payments through secure online payment gateways (Credit/Debit Cards, UPI, Net Banking, Wallets). By providing payment information, you represent and warrant that you are authorized to use the payment method. All payments are processed securely, but JewelsKart India is not liable for any payment gateway failures beyond our control.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Shipping, Delivery & Risk of Loss</h2>
              <p className="text-gray-600">Shipping and delivery timelines are estimates only and may vary. Risk of loss for products passes to the buyer upon delivery. Delivery failures due to incorrect address or unavailability may result in additional charges.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">8. Return & Exchange Policy</h2>
              <p className="text-gray-600">Returns and exchanges are governed by our Refund & Cancellation Policy, which forms part of these Terms. Customized, engraved, or personalized products are non-returnable.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">9. Intellectual Property</h2>
              <p className="text-gray-600">All content on JewelsKart India, including text, graphics, logos, images, software, and trademarks, is the property of JewelsKart India or its licensors. You may not reproduce, distribute, modify, display, or otherwise use any content without prior written consent.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">10. User Conduct</h2>
              <p className="text-gray-600">You agree not to: use the website for unlawful purposes, interfere with site security or functionality, post harmful or offensive material, or attempt to disrupt or hack the site. Violations may result in termination, legal action, or reporting to authorities.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">11. Limitation of Liability</h2>
              <p className="text-gray-600">JewelsKart India, its directors, employees, and partners will not be liable for indirect, incidental, or consequential damages arising from your use of the website or products. Our liability is limited to the amount paid by you for the product.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">12. Indemnification</h2>
              <p className="text-gray-600">You agree to indemnify and hold harmless JewelsKart India and its affiliates from any claims, damages, losses, liabilities, and expenses arising from: your breach of these Terms, your misuse of the website or products, or any violation of applicable laws.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">13. Privacy Policy</h2>
              <p className="text-gray-600">Your use of the website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">14. Governing Law & Jurisdiction</h2>
              <p className="text-gray-600">These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">15. Changes to Terms</h2>
              <p className="text-gray-600">JewelsKart India reserves the right to update or modify these Terms at any time. Changes take effect immediately upon posting on the website. Your continued use of the website after changes constitutes acceptance.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">16. Contact Information</h2>
              <p className="text-gray-600">
                Email: info@jewelskartindia.com<br />
                Phone: +91 75585 72001<br />
                Hours: Monday – Saturday (10:00 AM – 6:00 PM)
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;