const getEmployees = () => {
  return `SELECT * FROM employee;`
}

const getDepartments = () => {
  return `SELECT * FROM department;`
}

const getRoles = () => {
  return `SELECT * FROM role;`
}

const getManagers = () => {
  return `SELECT first_name, last_name FROM employee e JOIN role r ON r.id = e.role_id WHERE r.title = 'Manager';`
}

// const addEmployee = (answers) => {
//   return ``
// }

// const rootSwitch = (answers) => {

//   switch()
//   case 'View all Departments': getDepartments();
//   break;
// }

module.exports = { getEmployees, getDepartments, getManagers, getRoles };