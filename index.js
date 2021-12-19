// Importing dependencies
const logo = require('asciiart-logo');
const inquirer = require('inquirer');
const config = require('./package.json');
const mysql = require('mysql2');
require('console.table');
// Query strings
const { selectStr, selectEmployeeId, selectRoleId, selectManagers, newDepartmentQuery, newRoleQuery, newEmployeeQuery, selectDepartmentId, selectEmployeeNames, updateRole, updateManager, searchFor, getFullNames, determineId, selectEmployeeDepartment } = require('./db/utils')

// Creating connection with database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password1',
    database: 'kemployees_db'
  },
  console.log(`Connected to the kemployees_db database.`)
);
// Makes promise pool
const promisePool = db.promise();

// Retrieval functions

// Selects all from a given table
const selectAllFromTable = async (table) => {
  const [rows] = await promisePool.query(selectStr, table);
  return rows;
}

// // Retrieves a list of managers
// // const getManagers = async () => {
// //   const [rows] = await promisePool.query(selectManagers)
// //   return rows;
// // }

// // // Retrieves a given department's ID
// // const getDepartmentId = async (department) => {
// //   const [rows] = await promisePool.query(selectDepartmentId, department)
// //   return rows.map(row => row.id)
// // }

// // // Retrieves the role title's ID
// // const getRoleId = async (roleTitle) => {
// //   const [rows] = await promisePool.query(selectRoleId, roleTitle)
// //   return rows.map(row => row.id);
// // }

// // Retrieves an array of concated employee names
// const getEmployeeNames = async () => {
//   const [rows] = await promisePool.query(selectEmployeeNames)
//   return rows.map(row => row.name);
// }

// // Retrieves a given employee's ID
// const getEmployeeId = async (name) => {
//   if(name === 'None') return null;
//   const [rows] = await promisePool.query(selectEmployeeId, name)
//   return rows.map(row => row.id)
// }

// Display functions

// Retrieves and prints all data from a given table
const printAllTable = async (choice) => {
  const table = choice.split(' ')[2].slice(0, -1);
  const data = await selectAllFromTable(table);
  console.table(`${table.toUpperCase()}S`, data);
  init();
}

const printEmployeeDeptartment = async () => {
  const [rows] = await promisePool.query(selectEmployeeDepartment)
  console.table(rows)
  init();
}

// Update functions

// Updates an employee's info
const changeEmployeeRole = async () => {
  const employeeTable = await selectAllFromTable('employee');
  const roleTable = await selectAllFromTable('role');
  // Maps rows to get role titles
  const roleTitles = roleTable.map(row => row.title)
  // Maps rows to get full employee names
  const employeeNames = getFullNames(employeeTable)
  const questions = [
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's role do you want to update?`,
      choices: employeeNames
    },
    {
      type: 'list',
      name: 'newRole',
      message: `Which role do you want to assign the selected emloyee?`,
      choices: roleTitles
    }
  ]
  const { employee, newRole } = await inquirer.prompt(questions)
  // Deconstructs role id from role table
  const roleId = searchFor(roleTable, 'title', newRole, 'id')
  // Query that updates employee info
  await promisePool.query(updateRole, [roleId, employee])
  console.log(`${employee} was updated.`);
  init();
}

// Updates an emploee's manager
const changeManager = async () => {
  const employeeTable = await selectAllFromTable('employee');
  const employeeNames = getFullNames(employeeTable)
  const questions = [
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's manager do you want to change?`,
      choices: employeeNames
    },
    {
      type: 'list',
      name: 'managerName',
      message: `Who will be the employee's new manager?`,
      // Filters out the chosen employee's name
      choices: (answers) => ['None', ...employeeNames.filter(name => name !== answers.employee)]
    }
  ]
  const { employee, managerName } = await inquirer.prompt(questions);
  // Determines manager's ID, returns null if no new manager
  const managerId = determineId(employeeTable, managerName)
  // Update query
  await promisePool.query(updateManager, [managerId, employee])
  console.log(`${employee}'s manager was changed.`)
  init();
}

// Insert functions

// Adds a new department to the database
const addDepartment = async () => {
  const question = {
    type: 'input',
    name: 'newDepartment',
    message: 'What is the name of the department?',
    validate: newDepartment => {
      if (newDepartment.length > 0 && newDepartment.length <= 30) return true;
      return `Department name must be between 1 and 30 characters.`
    }
  }
  // Deconstructs answer
  const { newDepartment } = await inquirer.prompt(question);
  // Insert query for new department
  await promisePool.query(newDepartmentQuery, newDepartment);
  console.log(`${newDepartment} was added.`);
  init();
}

// Adds a new role to the database
const addRole = async () => {
  const departmentArr = await selectAllFromTable('department');
  const departments = departmentArr.map(department => department.name);
  const questions = [{
    type: 'input',
    name: 'newRole',
    message: `What is the name of the role?`,
    validate: newRole => {
      if (newRole.length > 0 && newRole.length <= 30) return true;
      return `Role name must be between 1 and 30 characters.`
    }
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary of the role?',
    validate: salary => {
      if (isNaN(salary)) return `Salary must be a number only.`
      else if (salary === '') return `Please enter a salary.`
      return true;
    }
  },
  {
    type: 'list',
    name: 'department',
    message: 'What department does the role belong to?',
    choices: departments
  }]
  // Deconstructs answers
  const { newRole, salary, department } = await inquirer.prompt(questions);
  // Retrieving specified department ID
  const [chosenDepartment] = departmentArr.filter(departmentObj => departmentObj.name === department)
  const departmentId = chosenDepartment.id;
  // Insert query for new role
  await promisePool.query(newRoleQuery, [newRole, salary, departmentId]);
  console.log(`${newRole} was added.`);
  init();
}

// Adds a new employee to the database
const addEmployee = async () => {
  // Retrieves rows from specified tables
  const roleTable = await selectAllFromTable('role');
  const employeeTable = await selectAllFromTable('employee');
  // Maps rows to get specified columns
  const roleTitles = roleTable.map(row => row.title);
  const managerNames = getFullNames(employeeTable);
  // Inquirer questions
  const questions = [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employee\'s first name?',
      validate: firstName => {
        if (firstName.length > 0 && firstName.length <= 30) return true;
        return `Employee must have a first name shorter between 1 and 30 characters.`
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employee\'s last name?',
      validate: lastName => {
        if (lastName.length > 0 && lastName.length <= 30) return true;
        return `Employee must have a last name shorter between 1 and 30 characters.`
      }
    },
    {
      type: 'list',
      name: 'newEmployeeRole',
      message: `What is the employee's role?`,
      choices: roleTitles
    },
    {
      type: 'list',
      name: 'managerName',
      message: `Who is the employee's manager?`,
      choices: ["None", ...managerNames]
    }]
  // Awaits answers to questions
  const { firstName, lastName, newEmployeeRole, managerName } = await inquirer.prompt(questions);
  // Determines the role ID
  const roleId = searchFor(roleTable, 'title', newEmployeeRole);
  // Determines the chosen manager's ID
  const managerId = determineId(employeeTable, managerName)
  // Insert query for new employee
  await promisePool.query(newEmployeeQuery, [firstName, lastName, roleId, managerId])
  console.log(`${firstName} ${lastName} was added.`)
  init();
}

// Takes in a task and switches to the appropriate function
const caseSwitch = async (choice) => {
  switch (choice) {
    // All three of these choices function the same way. Each returns all data from a specified table
    case 'View all employees':
    case 'View all roles':
    case 'View all departments': printAllTable(choice);
      break;
    case 'View all employees by department': printEmployeeDeptartment();
      break;
    case 'Add employee': addEmployee();
      break;
    case 'Update employee role': changeEmployeeRole();
      break;
    case `Change an employee's manager`: changeManager();
      break;
    case 'Add role': addRole();
      break;
    case 'Add department': addDepartment();
      break;
    case 'Quit': console.log('Thanks for being you!')
      process.exit();
  }
}

// Initiates employee tracker program
const init = async () => {
  const question = {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['View all employees', 'View all employees by department', 'Add employee', 'Update employee role', `Change an employee's manager`, 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit']
  }
  const { root } = await inquirer.prompt(question);
  // Takes the answer and performs the appropriate function
  caseSwitch(root);
}

// asciiart-logo styled splash screen
console.log(logo(config).render());

init();
