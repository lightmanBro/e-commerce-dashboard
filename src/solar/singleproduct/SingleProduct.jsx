import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductImage from "../image/Image";
import ProductDetails from "../details/ProductDetails";
import Reviews from "../review/Review";
import RecentlyViewed from "../recentlyviewed/RecentlyViewed";
import Cookies from 'js-cookie';
import "./SingleProduct.scss";
import Suggestions from "../suggestion/Suggestion";
import DiscountCountdown from "../discount/DiscountCountDown";
const SingleProductPage = () => {
  const [authToken, setAuthToken] = useState(Cookies.get('token'));
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [cartAdd, setCartAdd] = useState();
  
  console.log(authToken);
  const dummyProduct = {
    productTitle: "Dummy Solar Panel",
    shortDesc: "High efficiency solar panel",
    price: 100,
    mediaFilesPicture: ["/images/dummy-solar-panel.jpg"],
  };

  const dummyReviews = [
    { customer: { name: "John Doe" }, comments: "Great product!", rating: 5 },
    {
      customer: { name: "Jane Smith" },
      comments: "Good value for money",
      rating: 4,
    },
    { customer: { name: "Mark Johnson" }, comments: "Works well", rating: 4 },
  ];

  const dummySuggestions = [
    {
      productTitle: "Dummy Battery",
      price: 50,
      mediaFilesPicture: ["/images/dummy-battery.jpg"],
    },
    {
      productTitle: "Dummy Inverter",
      price: 150,
      mediaFilesPicture: ["/images/dummy-inverter.jpg"],
    },
  ];

  useEffect(() => {
    setAuthToken(Cookies.get('token'));
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:4000/product/one/${productId}`
        );
        const review = await axios.get(
          `http://127.0.0.1:4000/product/review/${productId}`
        );
        if (response.data.data.post) {
          console.log(response.data.data.post, "reviews", review.data);
          setProduct(response.data.data.post);
          setReviews(review.data);
          // Fetch suggestions if your API supports it or handle it here
          // setSuggestions(response.data.suggestions);
        } else {
          setProduct(dummyProduct);
          setReviews(dummyReviews);
          setSuggestions(dummySuggestions);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
        setProduct(dummyProduct);
        setReviews(dummyReviews);
        setSuggestions(dummySuggestions);
      }
    };

    fetchProductDetails();
  }, [productId]);
  // useEffect(() => {
  //   alert("Added to cart");
  // }, [cartAdd]);
  const addToCart = async (product) => {
    // Handle adding to cart
    console.log("Added to cart:");
    const cartRes = await axios.post(`http://127.0.0.1:4000/cart`, {
      productId,
      quantity: 1,
      userId: "667050ecdafa4dd0270f272f",
    });
    if (cartRes.data) {
      setCartAdd(cartRes.data);
    }
  };

  const addToFavorites = (product) => {
    // Handle adding to favorites
    console.log("Added to favorites:", product);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="single-product-page">
        <div className="left">
        <ProductImage imageUrls={product.mediaFilesPicture} discount={product.discount} />
          {/* <RecentlyViewed /> */}
        </div>
        <div className="right">
          <div className="reviews">{reviews.length} Reviews</div>
          <ProductDetails product={product} addToCart={addToCart} />
          <Reviews reviews={reviews} />
        </div>
      </div>
      <Suggestions />
    </>
  );
};

export default SingleProductPage;
