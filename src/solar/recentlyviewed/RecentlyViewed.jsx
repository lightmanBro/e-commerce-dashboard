import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentlyViewed.scss';

const RecentlyViewed = () => {
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewedItems = async () => {
      try {
        const response = await axios.get('https://api.citratechsolar.com/user/recentlyViewed');
        setRecentlyViewedItems(response.data.recentlyViewedItems);
      } catch (error) {
        console.error('Error fetching recently viewed items:', error);
      }
    };

    fetchRecentlyViewedItems();
  }, []);

  return (
    <div>
      <h2>Recently Viewed Items</h2>
      <div className="recently-viewed">
        {recentlyViewedItems.length > 0 ? (
          recentlyViewedItems.map(item => (
            <div key={item._id} className="item">
              <img src={`https://api.citratechsolar.com/items-media-files/${item.mediaFilesPicture[0]}`} alt={item.productTitle} />
              <h3>{item.productTitle}</h3>
              <p>{item.shortDesc}</p>
              <p>Price: {item.price}</p>
            </div>
          ))
        ) : (
          <p>No recently viewed items.</p>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
