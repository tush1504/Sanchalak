const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leaderRoutes = require("./routes/leaderRoutes");
const dashRoutes = require("./routes/dashboardRoutes");
const { default: helmet } = require('helmet');
const errorHandler = require("./middleware/errorHandler");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());



app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/leader", leaderRoutes);
app.use("/api/dashboard", dashRoutes);

app.get("/healthz" , (req,res) =>{
  res.status(200).send("OK")
})

app.get("/api/ping", (req, res) => {
  res.status(200).send("Server is awake!");
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});