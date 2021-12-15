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

const addEmployee = (answers) => {
  return `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', 1, NULL)`
}

const getRoleId = (role) => {
  return `SELECT id FROM role WHERE title = '${role}'`
}

const rootSwitch = (answers) => {

  switch (answers.root) {
    case 'View all departments': return getDepartments();
    case 'View all employees': return getEmployees();
    case 'View all roles': return getRoles();
    case 'Add employee': return addEmployee(answers);
  }
}

module.exports = { getEmployees, getDepartments, getManagers, getRoles, rootSwitch };