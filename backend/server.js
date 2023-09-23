const express = require("express");
const notes = require("./data/notes");
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const path = require("path");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

// Use the cors middleware
app.use(cors());

// app.get('/api/notes', (req,res) => {
//     res.send(notes);
// });

app.use('/api/users',userRoutes);
app.use('/api/notes',noteRoutes);

// ------------------- Deployment --------------------------------
const __dirname1 = path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}
else{
    app.get("/", (req,res) => {
        res.send("API is running..");
    });
}
// ------------------- Deployment --------------------------------

app.use(notFound);
app.use(errorHandler);

// app.get('http://localhost:5000/api/notes/:id', (req,res) => {
//     const note = notes.find((n) => n._id===req.params.id);
//     res.send(note);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});