const mongoose = require("mongoose");
const Book = require("../Models/Book");
const Member = require("../Models/Members");
const Borrows = require("../Models/Borrows");
const logger = require("../Utils/logger");

//Borrow Book(with out Session)
const borrowBookLocal = async (req, res) => {
    const { userEmail, bookId } = req.body;

    if (!userEmail || !bookId) {
        logger.warn("Borrow attempt missing userEmail or bookId");
        return res.status(400).json({ message: "userEmail and bookId are required" });
    }

    try {
        const member = await Member.findOne({ email: userEmail });
        if (!member) throw new Error("Member not found");

        const book = await Book.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(bookId), copies: { $gt: 0 } },
            { $inc: { copies: -1, borrowCount: 1 } },
            { new: true }
        );
        if (!book) throw new Error("No copies available or book not found");

        member.borrowCount += 1;
        await member.save();

        const borrow = await Borrows.create({
            user: member._id,
            book: book._id,
        });

        logger.info(`Book borrowed: ${book.title} by ${member.email}`);
        return res.status(200).json({ message: "Book borrowed successfully", borrow });
    } catch (error) {
        logger.error(`Error borrowing book: ${error.message}`);
        return res.status(400).json({ message: error.message });
    }
}


// Borrow Book(with Session)
const borrowBookProduction = async (req, res) => {
    const { userEmail, bookId } = req.body;

    if (!userEmail || !bookId) {
        logger.warn("Borrow attempt missing userEmail or bookId");
        return res.status(400).json({ message: "userEmail and bookId are required" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find member
        const member = await Member.findOne({ email: userEmail }).session(session);
        if (!member) throw new Error("Member not found");

        // Decrement book copies and increment borrowCount atomically
        const book = await Book.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(bookId), copies: { $gt: 0 } },
            { $inc: { copies: -1, borrowCount: 1 } },
            { new: true, session }
        );
        if (!book) throw new Error("No copies available or book not found");

        // Increment member's borrow count
        member.borrowCount += 1;
        await member.save({ session });

        // Create borrow record
        const borrow = new Borrows({ user: member._id, book: book._id });
        await borrow.save({ session });

        await session.commitTransaction();
        session.endSession();

        logger.info(`Book borrowed: ${book.title} by ${member.email}`);
        return res.status(200).json({ message: "Book borrowed successfully", borrow });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error borrowing book: ${error.message}`);
        return res.status(400).json({ message: error.message });
    }
}


// Return Book
const returnBook = async (req, res) => {
    const { borrowId } = req.params;

    if (!borrowId) {
        logger.warn("Return attempt missing borrowId");
        return res.status(400).json({ message: "borrowId is required" });
    }

    try {
        const borrow = await Borrows.findById({ _id: new mongoose.Types.ObjectId(borrowId) });
        if (!borrow) throw new Error("Borrow record not found");

        const book = await Book.findByIdAndUpdate(
            borrow.book,
            { $inc: { copies: 1 } },
            { new: true }
        );
        if (!book) throw new Error("Book not found");

        const member = await Member.findByIdAndUpdate(
            borrow.user,
            { $inc: { borrowCount: -1 } },
            { new: true }
        );
        if (!member) throw new Error("Member not found");

        await borrow.deleteOne();

        logger.info(`Book returned: ${book.title} by ${member.email}`);
        return res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
        logger.error(`Error returning book: ${error.message}`);
        return res.status(400).json({ message: error.message });
    }
}


// Get All Borrows For a Member
const borrowBooksForMember = async (req, res) => {
    const { id } = req.user;

    if (!id) {
        logger.warn("Borrows fetch attempt without user ID");
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const borrows = await Borrows.find({ user: id })
            .populate("book")
            .sort({ borrowDate: 1 });

        logger.info(`Fetched borrows for user ID: ${id}`);
        return res.status(200).json(borrows);
    } catch (err) {
        logger.error(`Error fetching borrows: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}


module.exports = {
    borrowBookLocal,
    borrowBookProduction,
    returnBook,
    borrowBooksForMember
}