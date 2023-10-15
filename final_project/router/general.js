const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    //return res.send(JSON.stringify(books,null,4));
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject('Failed to fetch books data');
    }
  });

  // Handle the Promise with callbacks
  getBooks
    .then((booksData) => {
      // Successfully fetched books data
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      // Failed to fetch books data
      res.status(500).json({ message: error });
    });
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    //return res.send(books[isbn])
    getBookByISBN(isbn)
    .then((book) => {
      if (book) {
        res.send(book);
      } else {
        res.status(404).json({ message: 'Book not found by ISBN.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
    //return res.status(300).json({message: "Yet to be implemented"});
});

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject('Failed to find book by ISBN');
    }
  });
}
  
 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  /*const booksbyauthor = [];
  // Obtain all the keys for the 'books' object and iterate through the array
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      const book = books[bookId];
      if (book.author === author) {
        const { author, ...bookWithoutAuthor } = book;
        booksbyauthor.push({ isbn: bookId, ...bookWithoutAuthor });
      }
    }
  }

  if (booksbyauthor.length > 0) {
    return res.send({booksbyauthor});
  } else {
    res.status(404).json({ message: 'No books by the specified author found.' });
  }*/
  
  //return res.status(300).json({message: "Yet to be implemented"});
  getBooksByAuthor(author)
  .then((booksByAuthor) => {
    if (booksByAuthor.length > 0) {
      res.send({ booksbyauthor: booksByAuthor });
    } else {
      res.status(404).json({ message: 'No books by the specified author found.' });
    }
  })
  .catch((error) => {
    res.status(500).json({ message: error });
  });
});

function getBooksByAuthor(author) {
return new Promise((resolve, reject) => {
  const booksByAuthor = [];

  // Obtain all the keys for the 'books' object and iterate through the array
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      const book = books[bookId];
      if (book.author === author) {
        const { author, ...bookWithoutAuthor } = book;
        booksByAuthor.push({ isbn: bookId, ...bookWithoutAuthor });
      }
    }
  }

  if (booksByAuthor.length > 0) {
    resolve(booksByAuthor);
  } else {
    reject('No books by the specified author found.');
  }
});
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  /*const booksbytitle = [];
  // Obtain all the keys for the 'books' object and iterate through the array
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      const book = books[bookId];
      if (book.title === title) {
        const { title, ...bookWithoutTitle } = book;
        booksbytitle.push({ isbn: bookId, ...bookWithoutTitle });
      }
    }
  }

  if (booksbytitle.length > 0) {
    return res.send({booksbytitle});
  } else {
    res.status(404).json({ message: 'No books by the specified title found.' });
  }*/
  //return res.status(300).json({message: "Yet to be implemented"});
  getBooksByTitle(title)
    .then((booksByTitle) => {
      if (booksByTitle.length > 0) {
        res.send({ booksbytitle: booksByTitle });
      } else {
        res.status(404).json({ message: 'No books by the specified title found.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = [];

    // Obtain all the keys for the 'books' object and iterate through the array
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId)) {
        const book = books[bookId];
        if (book.title === title) {
          const { title, ...bookWithoutTitle } = book;
          booksByTitle.push({ isbn: bookId, ...bookWithoutTitle });
        }
      }
    }

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject('No books by the specified title found.');
    }
  });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbnParam = req.params.isbn;

  if (books[isbnParam]) {
    const reviews = books[isbnParam].reviews;
    return res.send(reviews);
  } else {
    res.status(404).json({ message: 'Book not found by ISBN.' });
  
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
