const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  year: Number,
  price: { type: Number, required: true },
  // Add more fields as needed
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;