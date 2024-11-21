import React, { useState } from 'react';
import './Accordion.css'; // Import CSS for styling
import Product from './Product';

function Accordion({ title, products }) {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };



  return (
    <div className="accordion">
      <h2
        className={`accordion-title ${expanded ? 'expanded' : ''}`}
        onClick={toggleAccordion}
      >
        {title}
      </h2>
      <div className={`accordion-content ${expanded ? 'expanded' : ''}`}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index}>
              <Product key={product._id} product={product} />
            </div>
          ))
        ) : (
          <div>No product found</div>
        )}
      </div>
    </div>
  );
}

export default Accordion;
