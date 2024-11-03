// src/components/CustomButton.js
import React from 'react';
import './CustomButton.css';

const CustomButton = ({ onClick, children, ...props }) => (
  <button className="custom-button" onClick={onClick} {...props}>
    {children}
  </button>
);

export default CustomButton;
