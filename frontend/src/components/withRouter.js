import React from 'react';
import { useParams } from 'react-router-dom';

export const withCategoryParam = (Component) => {
  const Wrapper = (props) => {
    const { category } = useParams();
    
    return (
      <Component
        category={category}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

export const withProductIdParam = (Component) => {
  const Wrapper = (props) => {
    const { productId } = useParams();
    
    return (
      <Component
      productId={productId}
        {...props}
        />
    );
  };
  
  return Wrapper;
};