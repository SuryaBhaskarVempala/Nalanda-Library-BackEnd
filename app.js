const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./Config/db");
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

//Database Connection :
connection(process.env.MONGODB_URL);


//Middlewares :
app.use(express.json());
app.use(cors());  //it accepts all domains


// Routes :
app.use("/api/auth", require("./Routes/AuthRoutes"));
app.use("/api/books",require("./Routes/BooksRoutes"));
app.use("/api/borrows",require("./Routes/BorrowsRoutes"));
app.use("/api/admin",require("./Routes/AdminRoutes"));



app.get("/api", (req, res) => {
  res.send("Backend server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
