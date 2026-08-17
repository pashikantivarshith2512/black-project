'use client';

import React, { useEffect, useState } from 'react';
import { Star, Check, Trash2, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { Review } from '@/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    const res = await fetchApi<Review[]>('/reviews/admin');
    if (res.success && res.data) {
      setReviews(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    const res = await fetchApi(`/reviews/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    });

    if (res.success) {
      loadReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const res = await fetchApi(`/reviews/${id}`, { method: 'DELETE' });
    if (res.success) {
      loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-espresso-800/40 rounded-2xl border border-ikigai-border">
          <p className="text-xs text-ikigai-cream/60">No reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-ikigai-gold space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="fill-ikigai-gold" size={14} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rev.isApproved ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30' : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                  }`}>
                    {rev.isApproved ? 'APPROVED LIVE' : 'PENDING MODERATION'}
                  </span>
                </div>
                
                <p className="text-xs text-ikigai-cream/80 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="text-xs font-serif font-semibold text-ikigai-gold">
                  — {rev.name}
                </div>
              </div>

              <div className="pt-3 border-t border-ikigai-border/40 flex items-center justify-between space-x-2">
                <button
                  onClick={() => handleApprove(rev.id, !rev.isApproved)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    rev.isApproved
                      ? 'bg-amber-950/60 border border-amber-500/30 text-amber-300 hover:bg-amber-900'
                      : 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {rev.isApproved ? 'Unapprove / Hide' : 'Approve & Publish'}
                </button>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
