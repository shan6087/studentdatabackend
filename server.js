const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const uri = "mongodb://localhost:27017/student-db";
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// TODO: Define your student model and routes here
const Schema = mongoose.Schema;

// Student model
const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// Routes
app.get("/students", (req, res) => {
  Student.find()
    .then((students) => res.json(students))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/students", (req, res) => {
  const { name, age, grade } = req.body;
  const newStudent = new Student({ name, age, grade });

  newStudent
    .save()
    .then(() => res.json("Student added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/students/:id", (req, res) => {
  Student.findById(req.params.id)
    .then((student) => res.json(student))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/students/:id", (req, res) => {
  Student.findById(req.params.id)
    .then((student) => {
      student.name = req.body.name;
      student.age = req.body.age;
      student.grade = req.body.grade;

      student
        .save()
        .then(() => res.json("Student updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/students/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => res.json("Student deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
