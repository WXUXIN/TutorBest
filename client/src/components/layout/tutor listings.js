import React, { useState, useEffect } from 'react'

const TuteeScreen = () => {
    const [tutorlist, setTutorlist] = useState([])
  
    useEffect(() => {
      const fetchTutorlist = async () => {

        // send get request to the specified endpoint
        const { data } = await axios.get('/api/products')
        
        // update products state variable
        setTutorlist(data)
      }
    // second parameter set [] ensures fetchTutorlist runs once 
    // when rendering

      fetchTutorlist()
    }, [])
}