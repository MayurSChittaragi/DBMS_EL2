import React, { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../auth";
import { API } from "../config";

let signedIn = false;

const ProductReviews = (props) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    user: "",
    comment: "",
  });

  useEffect(() => {
    signedIn = isAuthenticated();
    console.log(props);
    setNewReview({
      ...newReview,
      user: signedIn.user._id,
      prodId: props.productId,
    });

    // console.log(props.productId);
    getReviews(props.productId);
  }, [props]);

  const getReviews = async (prodId) => {
    axios
      .get(`${API}/reviews/${prodId}`)
      .then((res) => {
        console.log(res.data);
        setReviews(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addReview = async (review) => {
    axios
      .post(`${API}/review`, {
        review,
      })
      .then((res) => {
        console.log(res);
        getReviews(props.productId);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCommentInput = (event) => {
    setNewReview({ ...newReview, comment: event.target.value });
  };

  const handleAddReview = () => {
    // setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
    // setNewReview({ user: '', rating: 1, comment: '' });
    // console.log(newReview);
    addReview(newReview);
  };

  return (
    <div style={{ marginLeft: "10em", marginTop: "1em" }}>
      <h4 style={{ fontSize: "2rem" }}>Product Reviews</h4>
      <br />
      {reviews.map((review) => (
        <div key={review.cust_id * 10 + review.prod_id}>
          <p style={{ fontSize: "1rem", fontWeight: "normal" }}>
            {review.user}:
          </p>
          <p style={{ fontSize: "1rem", fontWeight: "lighter" }}>
            {review.feedback}
          </p>
        </div>
      ))}
      {signedIn && (
        <>
          <h5 style={{}}>Add a review:</h5>
          <form>
            {/* <br /> */}
            {/* <br /> */}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <textarea
                value={newReview.comment}
                onChange={handleCommentInput}
                style={{
                  width: "13rem",
                  borderRadius: "5px",
                }}
              />
            </label>
            <br />
            <button
              type="button"
              onClick={handleAddReview}
              style={{
                borderColor: "red",
                width: "13em",
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              Add Review
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
