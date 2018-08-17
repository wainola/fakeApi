#!/usr/bin/env node
const express = require('express');
const DATABASE = require('./db');
const cors = require('cors');
const config = require('./config')
const dotenv = require('dotenv').config();

const app = express();
const DBMYSQL = new DATABASE({
    host: 'localhost',
    user: config.user,
    password: config.password,
    database: 'employees',
});
const { PORT: port } = process.env;

app.use(cors())

app.get('/employees', (req, res, next) => {
    DBMYSQL.query('SELECT * FROM EMPLOYEES WHERE emp_no = FLOOR(RAND() * (10001 - 11000) + 11000)')
    .then(resultado => {
        res.json({data: resultado});
    });
});

app.get('/salaries', (req, res, next) => {
    DBMYSQL.query('SELECT * FROM SALARIES LIMIT 500')
    .then(resultado => res.json({data: resultado}));
});

const query = `select e.*, d.* from employees e join dept_emp on e.emp_no = dept_emp.emp_no join departments d on dept_emp.dept_no = d.dept_no limit 5000;`;

app.get('/emps_depts', (req, res, next) => {
    DBMYSQL.query(query)
    .then(resultado => res.json({data: resultado}))
    .catch(err => {
        res.json({error: err});
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});