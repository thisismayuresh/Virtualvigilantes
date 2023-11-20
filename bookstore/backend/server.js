const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');

// Use the body-parser middleware to parse incoming JSON data
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore');

// Import the Book model
const Book = require('./Book');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a route to add a new book
app.post('/books', async (req, res) => {
  try {
    const { title, author, genre, year, price } = req.body;

    console.log(req.body)



    // Create a new instance of the Book model
    const book = new Book({
      title,
      author,
      genre,
      year,
      price,
    });

    // Save the book to the database
    await book.save();

    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Route to get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



app.put('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const updatedBookData = req.body;
  console.log(updatedBookData);

  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});



app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book Not Found" });
    }

    res.status(200).json({ message: 'Book deleted successfully', deletedBook });
  } catch (error) {
    console.log("Got Error", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
