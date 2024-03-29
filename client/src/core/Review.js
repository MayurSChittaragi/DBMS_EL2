import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../auth';
import { API } from '../config';

let signedIn = false;

const ProductReviews = (props) => {
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({
		user: '',
		comment: '',
	});

	useEffect(() => {
		signedIn = isAuthenticated();
		console.log(props);
		setNewReview({
			...newReview,
			user: signedIn?.user?._id,
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
		<div>
			<h4>Product Reviews</h4>
			{reviews.map((review) => (
				<div key={review.cust_id * 10 + review.prod_id}>
					<h5>{review.user}:</h5>
					<p>{review.feedback}</p>
				</div>
			))}
			{signedIn && (
				<>
					<h5>Add a review:</h5>
					<form>
						<br />
						<br />
						<label>
							Comment:
							<textarea
								value={newReview.comment}
								onChange={handleCommentInput}
							/>
						</label>
						<br />
						<button type='button' onClick={handleAddReview}>
							Add Review
						</button>
					</form>
				</>
			)}
		</div>
	);
};

export default ProductReviews;
