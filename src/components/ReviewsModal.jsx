import React, { useState } from 'react';
import { X, Star, CheckCircle, MessageSquare, Send } from 'lucide-react';

export const ReviewsModal = ({ isOpen, onClose, suite, onAddReview }) => {
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !suite) return null;

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const reviewObj = {
      name: newName.trim(),
      rating: newRating,
      date: "Just now",
      comment: newComment.trim(),
      avatar: "/assets/male_buyer_avatar.jpg"
    };

    onAddReview(suite.id, reviewObj);
    setSubmitted(true);
    setNewName('');
    setNewComment('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={() => onClose()} 
      />

      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 max-h-[90vh] flex flex-col font-['Satoshi']">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">{suite.name} Reviews</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-['Satoshi'] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {suite.rating} ({suite.reviewCount} Verified Reviews)
              </span>
            </div>
            <p className="text-xs text-[#6e5a8e] mt-0.5 font-['Satoshi'] font-medium">Real verified customer feedback and card activation performance.</p>
          </div>
          <button 
            onClick={() => onClose()}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* Reviews List & Write Review Form */}
        <div className="overflow-y-auto flex-1 space-y-6 pr-1 font-['Satoshi']">

          {/* Write a Review Section */}
          <form onSubmit={handlePostReview} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 font-['Satoshi']">
            <h4 className="font-['Satoshi'] font-extrabold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>Leave a Verified Customer Review</span>
            </h4>

            {/* Star Selector */}
            <div className="flex items-center gap-2 font-['Satoshi']">
              <span className="text-xs text-[#6e5a8e] font-semibold">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name (e.g. Rahul M.)"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-10 px-3 bg-white border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-['Satoshi'] font-semibold"
              />
            </div>

            <textarea
              placeholder="Write your review about card balance activation speed, limit performance..."
              required
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 bg-white border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-['Satoshi'] font-semibold"
            />

            <div className="flex justify-between items-center pt-1 font-['Satoshi']">
              {submitted ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Review posted successfully!
                </span>
              ) : (
                <span className="text-[10px] text-[#6e5a8e] font-['Satoshi'] font-semibold">Verified Buyer Badge Auto-Attached</span>
              )}

              <button
                type="submit"
                className="glass-btn px-4.5 py-2 rounded-full text-xs font-['Satoshi'] font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>

          {/* List of Verified Reviews */}
          <div className="space-y-3 font-['Satoshi']">
            <h4 className="text-xs font-['Satoshi'] font-extrabold text-[#6e5a8e] uppercase tracking-wider">
              Verified Buyer Reviews ({suite.reviews ? suite.reviews.length : 0})
            </h4>

            {suite.reviews && suite.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-2 font-['Satoshi']">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src="/assets/male_buyer_avatar.jpg" 
                      alt={rev.name} 
                      className="w-8 h-8 rounded-full object-cover border border-purple-200 shadow-xs" 
                    />
                    <div>
                      <h5 className="font-['Satoshi'] font-extrabold text-xs text-[#1e1035]">{rev.name}</h5>
                      <span className="text-[9.5px] text-emerald-600 font-['Satoshi'] font-extrabold uppercase flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> VERIFIED BUYER
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#6e5a8e] font-['Satoshi'] font-semibold">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs text-[#524170] font-['Satoshi'] font-medium leading-relaxed pl-10.5">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
