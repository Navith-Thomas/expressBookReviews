const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewText = req.query.review; // Get the review from the query parameter
  const username = req.session.username; // Assuming you have the username stored in the session

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  if (!reviewText) {
    return res.status(400).json({ message: 'Review text is required.' });
  }

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    const book = books[isbn];
    
      book.reviews[username] = reviewText;
      res.status(200).json({ message: 'Review for the book with ISBN: ${isbn} has been added/updated successfully'});
    
  } else {
    res.status(404).json({ message: 'Book not found by ISBN.' });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the username from the session
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
  
    const isbn = req.params.isbn;
    
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      const book = books[isbn];
  
      // Check if the user has a review for this book
      if (book.reviews[username]) {
        // Delete the user's review for this book
        delete book.reviews[username];
        res.status(200).json({ message: 'Review for the book has been deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Review not found for the book with ISBN.' });
      }
    } else {
      res.status(404).json({ message: 'Book not found by ISBN.' });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;