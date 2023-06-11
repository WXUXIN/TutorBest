import React from 'react'
import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
 import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
 import Rating from '../components/Rating'
 import products from '../products'
 import axios from 'axios'

//shows tutor details

 const ProductScreen = ({ match }) => {
   // const product = products.find((p) => p._id === match.params.id)
  // const [product, setProduct] = useState({})

   useEffect(() => {
     const fetchProduct = async () => {
       const {data} = await axios.get(`/api/products/${match.params.id}`)
       setProduct(data)
     }
     fetchProduct()
   }, [])
}




    //return (
      //<></>