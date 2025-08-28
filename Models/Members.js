const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MembersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "Member"],
    default: "Member"
  },
  borrowCount: {
    type: Number,
    default: 0,
  }
});

MembersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


MembersSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const adminEmails = ["admin1@example.com", "boss@example.com"]; 

MembersSchema.pre("save", function (next) {
  if (adminEmails.includes(this.email)) {
    this.role = "Admin"; 
  }
  next();
});


module.exports = mongoose.models.Members || mongoose.model("Members", MembersSchema);
