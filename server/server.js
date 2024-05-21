const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/api/employees', upload.single('image'), (req, res) => {
    const { name, age, salary, qualification, gender, deptno } = req.body;
    const image = req.file ? req.file.path : '';

    const query = 'INSERT INTO employees (name, age, salary, qualification, gender, deptno, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [name, age, salary, qualification, gender, deptno, image], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id: results.insertId, ...req.body });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
