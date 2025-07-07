// components/ReviewForm.jsx
import React, { useState } from "react";
import StarRating from "./StarRating";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateUserStats } from "./updateUserStats";
import "./ReviewForm.css";

const ReviewForm = ({ reviewedUserId }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      toast.error("You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    if (!reviewedUserId) {
      toast.error("Reviewed user ID is missing.");
      setLoading(false);
      return;
    }

    if (!name || !comment || rating <= 0) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Check if already reviewed
      const q = query(
        collection(db, "reviews"),
        where("fromUserId", "==", currentUser.uid),
        where("toUserId", "==", reviewedUserId)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        toast.warn("You’ve already reviewed this user.");
        setLoading(false);
        return;
      }

      // Add new review
      const reviewData = {
        fromUserId: currentUser.uid,
        toUserId: reviewedUserId,
        name,
        comment,
        rating,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "reviews"), reviewData);

      toast.success("Review submitted successfully!");

      
      await updateUserStats(reviewedUserId);

      // Reset form
      setName("");
      setComment("");
      setRating(0);

      
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (value) => {
    setRating(value);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <StarRating selectedStars={rating} onRate={handleRate} />
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;