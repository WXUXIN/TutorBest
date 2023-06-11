import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import products from '../products'

import axios from 'axios'

//display the star ratings of the tutor
// change className accordingly

const Rating = ({ tutor }) => {
  return (
    <div>
      <h1>{tutor.name}</h1>
      <div>
        { tutor.Rating } &nbsp;
        <FontAwesomeIcon icon={faStar} />      
      </div>       
    </div>
  );
};

export default Rating;


  


