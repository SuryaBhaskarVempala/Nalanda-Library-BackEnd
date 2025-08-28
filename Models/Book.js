const mongoose = require("mongoose");

function generateISBN13() {
  let prefix = "978";
  let body = "";
  for (let i = 0; i < 9; i++) {
    body += Math.floor(Math.random() * 10);
  }
  const partial = prefix + body;

  let sum = 0;
  for (let i = 0; i < partial.length; i++) {
    const digit = parseInt(partial[i], 10);
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return partial + checkDigit;
}

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  img: {
    type: String,
    default: "https://d3bxjxywei423j.cloudfront.net/assets/default-book.png"
  },
  ISBN: {
    type: String,
    unique: true,
    default: generateISBN13
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  genre: String,
  copies: { 
    type: Number, 
    default: 1 
  },
  borrowCount: { 
    type: Number, 
    default: 0 
  } 
});

module.exports = mongoose.models.Book || mongoose.model("Books", bookSchema);
