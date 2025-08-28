const express = require("express");
const router = express.Router();
const { adminOnly } = require("../Middlewares/Auth");
const {addBook,getBooks,updateBook,deleteBook} = require("../Controllers/BooksRoutesController");


// (Protected Route): Add Book
router.post("/", adminOnly, addBook);

// GET ALL with pagination + filters + sorting
router.get("/",getBooks);

// (Protected Route): Update Book
router.put("/", adminOnly,updateBook);

// (Protected Route): Delete Book
router.delete("/:id", adminOnly,deleteBook);


module.exports = router;
