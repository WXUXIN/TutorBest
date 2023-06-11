import React from 'react'
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import products from '../products'

import axios from 'axios'

//display the star ratings of the tutor
// change className accordingly

const Rating = ({ value, text, color }) => {
    return (
      <div className='rating'>
        <span>
          <i
            style={{ color }}
            className={
              value >= 1
                ? 'fas fa-star'
                : value >= 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
        <span>
          <i
            style={{ color }}
            className={
              value >= 2
                ? 'fas fa-star'
                : value >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
        <span>
          <i
            style={{ color }}
            className={
              value >= 3
                ? 'fas fa-star'
                : value >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
        <span>
          <i
            style={{ color }}
            className={
              value >= 4
                ? 'fas fa-star'
                : value >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
        <span>
          <i
            style={{ color }}
            className={
              value >= 5
                ? 'fas fa-star'
                : value >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
        <span>{text && text}</span>
      </div>
    )
  }
  
  // sets the default value for the color prop to '#f8e825' 
  // If the color prop is not provided when using the Rating component, 
  // this default value will be used.

  Rating.defaultProps = {
    color: '#f8e825',
  }
  
  // propTypes property is assigned to the Rating component. 
  // specifies the expected types and requirements for the component's props.

  Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
  }
  


