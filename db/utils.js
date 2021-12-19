// Strings for querying information
const selectStr = `SELECT * FROM ??`
const selectWildStr = `SELECT ?? FROM ??`
const selectDepartmentId = `SELECT id FROM department WHERE name=?`
const selectRoleId = `SELECT id FROM role WHERE title = ?`
const selectEmployeeNames = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`
const selectEmployeeId = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`
const selectManagers = `SELECT *, CONCAT(first_name, ' ', last_name) AS name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'`
const selectEmployeeDepartment = `SELECT CONCAT(first_name, ' ', last_name) AS full_name, name as department_name FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department_id`

// Update strings
const updateRole = `UPDATE employee SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`
const updateManager = `UPDATE employee SET manager_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`

// Strings for querying inserts
const newDepartmentQuery = `INSERT INTO department (name) VALUES (?)`
const newRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
const newEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

// Delete strings
const deleteFromQuery = `DELETE FROM ?? WHERE ?? = ?`
const deleteEmployeeQuery = `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`

// Helper functions
// Searches for a particular value from a table
const searchFor = (arr, compareKey, term, desiredKey) => {
  const [ newArr ] = arr.filter(element => element[compareKey] === term)
  return newArr[desiredKey];
}
// Determines the given employee's ID
const determineId = (employeeTable, employeeName) => {
  if(employeeName === 'None') return null;
  const [employeeRow] = employeeTable.filter(employee => `${employee.first_name} ${employee.last_name}` === employeeName)
  return employeeRow.id;
}
// Concats first and last names
const getFullNames = (arr) => {
  return arr.map(row => `${row.first_name} ${row.last_name}`);
}

module.exports = { selectStr, selectWildStr, selectDepartmentId, selectRoleId, selectEmployeeNames, selectEmployeeId, selectManagers, selectEmployeeDepartment, updateRole, updateManager, newDepartmentQuery, newRoleQuery, newEmployeeQuery, deleteFromQuery, deleteEmployeeQuery, searchFor, determineId, getFullNames }