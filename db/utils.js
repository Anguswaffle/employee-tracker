// Strings for querying information
const selectStr = `SELECT * FROM ??`
const selectDepartmentId = `SELECT id FROM department WHERE name=?`
const selectRoleId = `SELECT id FROM role WHERE title = ?`
const selectEmployeeNames = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`
const selectEmployeeId = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`
const selectManagers = `SELECT *, CONCAT(first_name, ' ', last_name) AS name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'`

// Update strings
const updateRole = `UPDATE employee SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`
const updateManager = `UPDATE employee SET manager_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?`

// Strings for querying inserts
const newDepartmentQuery = `INSERT INTO department (name) VALUES (?)`
const newRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
const newEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

// Helper functions

const searchFor = (arr, compareKey, term, desiredKey) => {
  const [ newArr ] = arr.filter(element => element[compareKey] === term)
  return newArr[desiredKey];
}
const getFullNames = (arr) => {
  return arr.map(row => `${row.first_name} ${row.last_name}`);
}

module.exports = { selectStr, selectDepartmentId, selectRoleId, selectEmployeeNames, selectEmployeeId, selectManagers, updateRole, updateManager, newDepartmentQuery, newRoleQuery, newEmployeeQuery, searchFor, getFullNames }