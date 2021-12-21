// Strings for querying information
const selectStr = `SELECT * FROM ??`
const selectEmployeeDepartment = `SELECT employee.id, CONCAT(first_name, ' ', last_name) AS full_name, role_id, manager_id, salary, name as department_name FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department_id`
const selectTotalSalary = `SELECT salary FROM role JOIN employee ON employee.role_id = role.id WHERE department_id = ?`
const selectEmployeeManager = `SELECT id AS employee_id, CONCAT(first_name, ' ', last_name) AS name, manager_id AS manager_employee_id FROM employee ORDER BY manager_id DESC`

// Update string
const updateEmployee = `UPDATE employee SET ?? = ? WHERE id = ?`

// Strings for querying inserts
const newDepartmentQuery = `INSERT INTO department (name) VALUES (?)`
const newRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
const newEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

// Delete string
const deleteFromQuery = `DELETE FROM ?? WHERE id = ?`

// Helper functions
// Searches for a particular value from a table
const searchFor = (arr, compareKey, term, desiredKey) => {
  const [newArr] = arr.filter(element => element[compareKey] === term)
  return newArr[desiredKey];
}
// Determines the given employee's ID
const determineId = (employeeTable, employeeName) => {
  if (employeeName === 'None') return null;
  const [employeeRow] = employeeTable.filter(employee => `${employee.first_name} ${employee.last_name}` === employeeName)
  return employeeRow.id;
}
// Concats first and last names
const getFullNames = (arr) => {
  return arr.map(row => `${row.first_name} ${row.last_name}`);
}

module.exports = { selectStr, selectEmployeeManager, newDepartmentQuery, newRoleQuery, newEmployeeQuery, updateEmployee, deleteFromQuery, searchFor, getFullNames, determineId, selectEmployeeDepartment, selectTotalSalary }