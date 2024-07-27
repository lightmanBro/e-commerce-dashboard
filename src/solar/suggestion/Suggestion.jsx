import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Suggestion.scss';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('https://api.citratechsolar.com/user/recentlyViewed');
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div>
      <h2>Suggestions</h2>
      <div className="suggestions">
        {suggestions.length > 0 ? (
          suggestions.map(item => (
            <div key={item._id} className="item">
              <img src={`https://api.citratechsolar.com/items-media-files/${item.mediaFilesPicture[0]}`} alt={item.productTitle} />
              <h3>{item.productTitle}</h3>
              <p>{item.shortDesc}</p>
              <p>Price: {item.price}</p>
            </div>
          ))
        ) : (
          <p>No suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
