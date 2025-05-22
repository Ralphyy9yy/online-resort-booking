import { Router } from 'express'; 
import db from '../config/db.js'; 

const router = Router();  

// Helper function to validate email format 
const validateEmail = (email) => {   
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   
  return emailRegex.test(email); 
};  

// Change the route path to match the React component's endpoint
// This assumes the router is mounted at '/api' in your main server file
router.post('/', (req, res) => {   
  const { name, email, message } = req.body;    
  
  // Check if all fields are provided   
  if (!name || !email || !message) {     
    return res.status(400).json({ error: 'All fields are required' });   
  }    
  
  // Validate email format   
  if (!validateEmail(email)) {     
    return res.status(400).json({ error: 'Invalid email format' });   
  }    
  
  // Optional: Validate message length or other properties   
  if (message.length < 10) {     
    return res.status(400).json({ error: 'Message must be at least 10 characters long' });   
  }    
  
  // Assuming db is properly configured for insert   
  const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';   
  db.query(query, [name, email, message], (err, results) => {     
    if (err) {       
      console.error('Database error:', err);       
      return res.status(500).json({ error: 'Database error' });     
    }      
    
    // Return success with the inserted message data     
    res.status(201).json({       
      message: 'Message sent successfully',       
      data: { name, email, message },     
    });   
  }); 
});  

export default router;