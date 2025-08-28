const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Members",
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Books", 
    required: true 
  },
  borrowDate: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.models.Borrows || mongoose.model("Borrows", borrowSchema);
