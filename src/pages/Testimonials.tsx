import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InnerPageBanner } from '@/components/InnerPageBanner';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

interface Testimonial {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: Array<{ url: string; publicId: string }>;
  productName: string;
  productImage?: string;
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/testimonials?limit=50`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.reviews);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${id}/helpful`, { method: 'PUT' });
      if (response.ok) {
        setTestimonials(prev => prev.map(t => 
          t._id === id ? { ...t, helpful: t.helpful + 1 } : t
        ));
      }
    } catch (error) {
      console.error('Error updating helpful:', error);
    }
  };

  const filteredTestimonials = selectedRating 
    ? testimonials.filter(t => t.rating === selectedRating)
    : testimonials;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-24">
        <InnerPageBanner
          title="Testimonials"
          subtitle="Customer Voices"
          breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Testimonials' }]}
        />

        {/* Stats Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{stats.totalReviews}+</div>
                <div className="text-gray-600 text-sm">Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{stats.averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(stats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-gray-600 text-sm">Avg Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{stats.fiveStar}</div>
                <div className="text-gray-600 text-sm">5 Star Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-gray-600 text-sm">Authentic</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-4 py-2 rounded-md text-sm ${!selectedRating ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All
              </button>
              {[5,4,3,2,1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${selectedRating === rating ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {rating} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-4">{testimonial.comment}</p>
                  
                  {testimonial.images && testimonial.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {testimonial.images.slice(0, 2).map((img, idx) => (
                        <img key={idx} src={img.url} alt="Review" className="w-16 h-16 object-cover rounded cursor-pointer" />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{testimonial.customerName}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                        {testimonial.verifiedPurchase && <span className="text-green-600">✓ Verified</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleHelpful(testimonial._id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {testimonial.helpful}
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-3">Reviewed for: {testimonial.productName}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;