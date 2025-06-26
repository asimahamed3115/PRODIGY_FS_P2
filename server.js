const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'data', 'employees.json');

const readEmployees = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeEmployees = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get('/api/employees', (req, res) => {
  res.json(readEmployees());
});

app.post('/api/employees', (req, res) => {
  const employees = readEmployees();
  const newEmployee = { id: Date.now(), ...req.body };
  employees.push(newEmployee);
  writeEmployees(employees);
  res.status(201).json(newEmployee);
});

app.delete('/api/employees/:id', (req, res) => {
  let employees = readEmployees();
  const id = parseInt(req.params.id);
  employees = employees.filter(emp => emp.id !== id);
  writeEmployees(employees);
  res.status(200).json({ success: true });
});

app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let employees = readEmployees();
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found' });
  employees[index] = { id, ...req.body };
  writeEmployees(employees);
  res.json(employees[index]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});