const Book = require("../Models/Book");
const mongoose = require("mongoose");
const logger = require("../Utils/logger.js");


// Add Book
const addBook = async (req, res) => {
    const { title, author, genre, img, copies } = req.body;

    try {
        let book;
        if (img) {
            book = await Book.create({ title, author, genre, img, copies });
        } else {
            book = await Book.create({ title, author, genre, copies });
        }
        logger.info(`Book added: ${book.title} (ID: ${book._id})`);

        return res.status(200).json({ message: "Book Added Successfully" });
    } catch (err) {
        logger.error(`Error adding book: ${err.message}`);
        return res.status(500).json({ message: "Server Error" });
    }
}



// Get Books By Filters & Sorting & Pagination
const getBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, title, author, genre, sort } = req.query;

        const filters = {};
        if (title) filters.title = new RegExp(title, "i");
        if (author) filters.author = new RegExp(author, "i");
        if (genre) filters.genre = genre;

        // sort = "asc" => ascending, "desc" => descending, default descending
        let sortOption = { publicationDate: -1 }; 
        if (sort === "asc") sortOption = { publicationDate: 1 };
        if (sort === "desc") sortOption = { publicationDate: -1 };

        const books = await Book.find(filters)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Book.countDocuments(filters);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            books
        });
    } catch (err) {
        logger.error(`Error fetching books: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
}



//Update Book
const updateBook = async (req, res) => {
    const { id, title, author, genre, img, copies } = req.body;

    if (!id) {
        logger.warn("Book update attempt without ID");
        return res.status(400).json({ message: "Book ID is required for update" });
    }

    try {
        const book = await Book.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { title, author, genre, img, copies },
            { new: true }
        );

        if (!book) {
            logger.warn(`Book not found for update: ID ${id}`);
            return res.status(404).json({ message: "Book not found" });
        }

        logger.info(`Book updated: ${book.title} (ID: ${book._id})`);
        return res.status(200).json({ message: "Book updated successfully", book });
    } catch (err) {
        logger.error(`Error updating book: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}


// Delete Book
const deleteBook = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findByIdAndDelete(new mongoose.Types.ObjectId(id));

        if (!book) {
            logger.warn(`Book not found for deletion: ID ${id}`);
            return res.status(404).json({ message: "Book not found" });
        }

        logger.info(`Book deleted: ${book.title} (ID: ${book._id})`);
        return res.status(200).json({ message: "Book deleted successfully", book });
    } catch (err) {
        logger.error(`Error deleting book: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}



module.exports = {
    addBook,
    deleteBook,
    updateBook,
    getBooks
}