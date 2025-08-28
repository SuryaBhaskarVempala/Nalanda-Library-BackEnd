const express = require("express");
const router = express.Router();
const { adminOrMember } = require("../Middlewares/Auth");
const { borrowBookLocal, borrowBookProduction, returnBook, borrowBooksForMember } = require("../Controllers/BorrowsRoutesController.js");


// (Protected Route) : Borrow Book (This is for MongoDB Atlas,it supports) 
router.post("/borrowBookById", adminOrMember,);

// (Protected Route) : Borrow Book
router.post("/borrowBookById", adminOrMember,);

// (Protected Route) : Return Book
router.post("/returnBookById/:borrowId", adminOrMember,);

// (Protected Route) : Get All Borrows For a Member
router.get("/borrowsByMember/", adminOrMember,);


module.exports = router;