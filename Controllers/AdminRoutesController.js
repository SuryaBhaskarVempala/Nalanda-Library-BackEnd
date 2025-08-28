const Book = require("../Models/Book");
const Member = require("../Models/Members");
const Borrows = require("../Models/Borrows");
const logger = require("../Utils/logger");


//Admin Reports or DashBoard : 
const adminReports = async (req, res) => {
    logger.info("/admin route called");

    try {
        // Book stats
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.countDocuments({ copies: { $gt: 0 } });
        const borrowedBooksCount = await Borrows.distinct("book").then(arr => arr.length);

        const bookStats = {
            total: totalBooks,
            borrowed: borrowedBooksCount,
            available: availableBooks,
        };
        logger.info(`Book stats: ${JSON.stringify(bookStats)}`);

        // Most Borrowed Books (top 5 by borrowCount)
        const mostBorrowedBooks = await Book.find()
            .sort({ borrowCount: -1 })
            .limit(5)
            .select("title borrowCount")
            .lean();

        const borrowedBooksFormatted = mostBorrowedBooks.map(b => ({
            title: b.title,
            count: b.borrowCount,
        }));
        logger.info(`Most borrowed books: ${JSON.stringify(borrowedBooksFormatted)}`);

        // Active Members (top 5 by borrowCount > 0)
        const activeMembers = await Member.find({ borrowCount: { $gt: 0 } })
            .sort({ borrowCount: -1 })
            .limit(5)
            .select("name borrowCount")
            .lean();

        const activeMembersFormatted = activeMembers.map(m => ({
            name: m.name,
            count: m.borrowCount,
        }));
        logger.info(`Active members: ${JSON.stringify(activeMembersFormatted)}`);

        res.json({
            bookStats,
            borrowedBooks: borrowedBooksFormatted,
            activeMembers: activeMembersFormatted,
        });

    } catch (err) {
        logger.error(`Error fetching admin reports: ${err.message}`);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    adminReports
};