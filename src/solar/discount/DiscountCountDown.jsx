// src/components/discount/DiscountCountdown.js
import React, { useState, useEffect } from 'react';
import './DiscountCountDown.scss';

const DiscountCountdown = ({ expiryDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(expiryDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="discount-countdown">
      <div className="countdown-label">Offer expires in</div>
      <div className="countdown-timer">
        {timeLeft.days !== undefined ? (
          <>
            <div className="time-box">
              <div className="time-value">{timeLeft.days}</div>
              <div className="time-label">Days</div>
            </div>
            <div className="time-box">
              <div className="time-value">{timeLeft.hours}</div>
              <div className="time-label">Hours</div>
            </div>
            <div className="time-box">
              <div className="time-value">{timeLeft.minutes}</div>
              <div className="time-label">Min</div>
            </div>
            <div className="time-box">
              <div className="time-value">{timeLeft.seconds}</div>
              <div className="time-label">Sec</div>
            </div>
          </>
        ) : (
          <span>Offer expired</span>
        )}
      </div>
    </div>
  );
};

export default DiscountCountdown;
