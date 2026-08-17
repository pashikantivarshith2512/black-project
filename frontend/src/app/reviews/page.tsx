'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function ReviewsPage() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      const res = await fetchApi<Review[]>('/reviews');
      if (res.success && res.data) {
        setReviews(res.data);
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setSubmitting(true);
    setFeedback(null);

    const res = await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({ name, rating, comment }),
    });

    if (res.success) {
      setFeedback({ text: res.message || 'Review submitted for moderation!', isError: false });
      setComment('');
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 2500);
    } else {
      setFeedback({ text: res.message || 'Failed to submit review.', isError: true });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ikigai-border pb-8">
        <div>
          <div className="flex items-center space-x-1 text-ikigai-gold mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-ikigai-gold" size={20} />
            ))}
            <span className="text-sm font-bold text-ikigai-cream pl-2">4.4 / 5.0 (671+ Ratings)</span>
          </div>
          <h1 className="font-serif text-4xl font-bold gold-gradient-text">Guest Stories & Reviews</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="gold-gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 w-fit"
        >
          <Plus size={16} />
          <span>Write a Review</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-ikigai-gold space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="fill-ikigai-gold" size={14} />
                    ))}
                  </div>
                  <span className="text-[10px] text-ikigai-cream/50">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ikigai-cream/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-ikigai-border/40 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-ikigai-gold">— {rev.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified Guest
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-espresso-900 border border-ikigai-gold/40 rounded-2xl p-6 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-ikigai-border pb-3">
              <h3 className="font-serif text-lg font-bold text-ikigai-gold">Share Your IKIGAI Experience</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ikigai-cream/50 hover:text-ikigai-gold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-ikigai-cream/70">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="e.g. Priya Reddy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ikigai-cream/70">Rating *</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg border ${
                        rating >= star
                          ? 'border-ikigai-gold text-ikigai-gold bg-ikigai-gold/10'
                          : 'border-ikigai-border text-ikigai-cream/40'
                      }`}
                    >
                      <Star size={18} className={rating >= star ? 'fill-ikigai-gold' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ikigai-cream/70">Review Comment *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-xl p-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="Tell us about the coffee, pizza, ambience or service..."
                />
              </div>

              {feedback && (
                <div className={`p-3 rounded-xl text-xs ${feedback.isError ? 'bg-red-950/40 text-red-300' : 'bg-emerald-950/40 text-emerald-300'}`}>
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold shadow-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
