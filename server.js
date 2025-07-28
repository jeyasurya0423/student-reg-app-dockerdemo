const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const cors = require('cors'); // Import CORS

// Setup app and MongoDB connection
const app = express();

// Use CORS for allowing cross-origin requests (necessary for different ports or domains)
app.use(cors()); // This will allow all domains by default

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection URI (ensure the database name is 'enroll' and the collection is 'students')
  const mongoURI = 'mongodb://admin:12345678@mongodb:27017/enroll?authSource=admin';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // 30 seconds
  socketTimeoutMS: 45000           // 45 seconds
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));


// Define the schema for the 'students' collection
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
}, { collection: 'students' });  // Ensure collection name is 'students'

const Student = mongoose.model('Student', studentSchema);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Add a new student
app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;

  // Check if all fields are present
  if (!name || !age || !grade) {
    console.log('Missing fields:', req.body); // Debugging output
    return res.status(400).json({ message: 'All fields are required' });
  }

  const student = new Student({ name, age, grade });
  try {
    await student.save();
    console.log('Student added:', student); // Debugging output
    res.status(201).json(student);
  } catch (error) {
    console.error('Error saving student:', error); // Debugging output
    res.status(500).json({ message: 'Error saving student' });
  }
});

// Listen on port 3001
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
