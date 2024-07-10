// MyGaugeComponent.jsx
import React, { useState, useEffect } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const MyGaugeComponent = ({ product }) => {
  const [stock, setStock] = useState(0);
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    if (product) {
      setStock(product.stock);
      setAvailable(product.available);
    }
  }, [product]);

  const calculateAvailablePercentage = () => {
    if (stock === 0) return 0;
    return (available / stock) * 100;
  };

  return (
    <Gauge
      value={calculateAvailablePercentage()}
      startAngle={-110}
      endAngle={110}
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
          transform: 'translate(0px, 0px)',
        },
      }}
      text={({ value, valueMax }) => `${available} / ${stock}`}
    />
  );
};

export default MyGaugeComponent;
