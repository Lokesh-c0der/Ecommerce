import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./Routes/User.js";
import productRoutes from "./Routes/Product.js";

const app = express();
dotenv.config();
const port =process.env.PORT;

// Middle Wares
app.use(express.json());

//Routes
app.use("/api/",userRoutes);
app.use("/api/",productRoutes);

//static files
app.use("/uploads",express.static("uploads"));

app.get("/",(req,res)=>{
    res.send("<h1>Hello world</h1>");
});

app.listen(port,()=> {
    console.log(`server running at port ${port}`);
    connectDB();
});