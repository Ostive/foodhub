"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, Star, ThumbsUp, MessageSquare, Calendar, Flag, ChevronDown, ArrowUpDown } from "lucide-react";

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for reviews
  const reviews = [
    { 
      id: 1, 
      customerName: "Emma Wilson", 
      customerAvatar: "https://randomuser.me/api/portraits/women/44.jpg", 
      rating: 5, 
      comment: "Absolutely delicious pizza! The crust was perfect - crispy on the outside and soft on the inside. Delivery was quick too. Will definitely order again!", 
      date: "2025-04-23", 
      items: ["Margherita Pizza", "Garlic Bread"],
      replied: true,
      helpful: 8,
      flagged: false
    },
    { 
      id: 2, 
      customerName: "James Brown", 
      customerAvatar: "https://randomuser.me/api/portraits/men/32.jpg", 
      rating: 4, 
      comment: "Great food and fast delivery. The only reason I'm not giving 5 stars is because the pizza was a bit cold when it arrived. Flavor was still amazing though!", 
      date: "2025-04-22", 
      items: ["Pepperoni Pizza", "Coca Cola"],
      replied: false,
      helpful: 3,
      flagged: false
    },
    { 
      id: 3, 
      customerName: "Sophia Garcia", 
      customerAvatar: "https://randomuser.me/api/portraits/women/68.jpg", 
      rating: 5, 
      comment: "Best pizza in town! I've tried many places and this is by far my favorite. The ingredients taste fresh and the portions are generous. Customer service is excellent too.", 
      date: "2025-04-21", 
      items: ["Vegetarian Pizza", "Tiramisu"],
      replied: true,
      helpful: 12,
      flagged: false
    },
    { 
      id: 4, 
      customerName: "Michael Chen", 
      customerAvatar: "https://randomuser.me/api/portraits/men/75.jpg", 
      rating: 3, 
      comment: "The food was good but nothing special. Delivery took longer than the estimated time. Might order again but will try something different next time.", 
      date: "2025-04-20", 
      items: ["Hawaiian Pizza"],
      replied: true,
      helpful: 1,
      flagged: false
    },
    { 
      id: 5, 
      customerName: "Olivia Martinez", 
      customerAvatar: "https://randomuser.me/api/portraits/women/90.jpg", 
      rating: 2, 
      comment: "Disappointed with my order. The pizza was undercooked and the toppings were sparse. Delivery was quick though, and the driver was polite.", 
      date: "2025-04-19", 
      items: ["Meat Lovers Pizza", "Caesar Salad"],
      replied: true,
      helpful: 0,
      flagged: false
    },
    { 
      id: 6, 
      customerName: "William Johnson", 
      customerAvatar: "https://randomuser.me/api/portraits/men/45.jpg", 
      rating: 5, 
      comment: "Ordered for a family gathering and everyone loved it! The Family Feast deal is excellent value for money. Will definitely be our go-to for future events.", 
      date: "2025-04-18", 
      items: ["Family Feast"],
      replied: false,
      helpful: 5,
      flagged: false
    },
    { 
      id: 7, 
      customerName: "Ava Thompson", 
      customerAvatar: "https://randomuser.me/api/portraits/women/22.jpg", 
      rating: 1, 
      comment: "Terrible experience. Food was cold, order was incorrect, and customer service was unhelpful when I called to complain. Will not be ordering again.", 
      date: "2025-04-17", 
      items: ["Margherita Pizza", "Garlic Bread"],
      replied: true,
      helpful: 2,
      flagged: true
    },
    { 
      id: 8, 
      customerName: "Ethan Rodriguez", 
      customerAvatar: "https://randomuser.me/api/portraits/men/67.jpg", 
      rating: 4, 
      comment: "Really enjoyed the food. The tiramisu was especially delicious! Only giving 4 stars because delivery took a bit longer than expected, but the quality made up for it.", 
      date: "2025-04-16", 
      items: ["Pepperoni Pizza", "Tiramisu"],
      replied: false,
      helpful: 4,
      flagged: false
    },
  ];

  // Filter and sort reviews
  const filteredAndSortedReviews = [...reviews]
    .filter(review => {
      const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
      const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "helpful":
          comparison = a.helpful - b.helpful;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to toggle sort
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = Array(5).fill(0).map((_, i) => {
    return reviews.filter(review => review.rating === i + 1).length;
  });
  const ratingPercentages = ratingCounts.map(count => ((count / totalReviews) * 100).toFixed(0));

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reviews</h1>
        <p className="text-gray-600">Manage and respond to customer feedback</p>
      </div>

      {/* Review Summary */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-900 flex items-center">
              {averageRating}
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 ml-2" />
            </div>
            <p className="text-gray-500 mt-2">Based on {totalReviews} reviews</p>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <div className="flex items-center w-24">
                    <span className="text-sm font-medium text-gray-700 mr-2">{star} stars</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full" 
                      style={{ width: `${ratingPercentages[5 - star]}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{ratingPercentages[5 - star]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterRating("all")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterRating === "all" ? 'bg-[#D55E00] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button 
              key={rating}
              onClick={() => setFilterRating(rating.toString())} 
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filterRating === rating.toString() ? 'bg-[#D55E00] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              {rating} 
              <Star className={`h-4 w-4 ml-1 ${filterRating === rating.toString() ? 'text-white' : 'text-yellow-400'}`} />
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#D55E00] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 mb-8">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="h-10 w-10 shrink-0">
                    <Image 
                      src={review.customerAvatar} 
                      alt={review.customerName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{review.customerName}</h3>
                      {review.flagged && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Flagged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">{formatDate(review.date)}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Ordered: {review.items.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ThumbsUp className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Flag className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700">{review.comment}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{review.helpful} found this helpful</span>
                </div>
                <div>
                  {review.replied ? (
                    <span className="text-sm text-green-600 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Replied
                    </span>
                  ) : (
                    <button className="text-[#D55E00] hover:text-orange-700 text-sm font-medium">
                      Reply to Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
            <p className="text-gray-500">No reviews found matching your criteria</p>
            <button 
              onClick={() => { setFilterRating("all"); setSearchQuery(""); }}
              className="mt-2 text-[#D55E00] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-[#D55E00]">{reviews.length}</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-[#D55E00]">{averageRating}</p>
            <Star className="h-6 w-6 text-yellow-400 ml-2" />
          </div>
          <p className="text-sm text-green-600 mt-1">+0.3 from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response Rate</h3>
          <p className="text-3xl font-bold text-[#D55E00]">
            {((reviews.filter(r => r.replied).length / reviews.length) * 100).toFixed(0)}%
          </p>
          <p className="text-sm text-green-600 mt-1">Target: 100%</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Flagged Reviews</h3>
          <p className="text-3xl font-bold text-[#D55E00]">{reviews.filter(r => r.flagged).length}</p>
          <p className="text-sm text-red-600 mt-1">Needs attention</p>
        </div>
      </div>
    </>
  );
}
