// Importing dependencies
const logo = require('asciiart-logo');
const inquirer = require('inquirer');
const config = require('./package.json');
const mysql = require('mysql2');
require('console.table');
// Query strings
const { selectStr, selectEmployeeId, selectRoleId, selectManagers, newDepartmentQuery, newRoleQuery, newEmployeeQuery, selectDepartmentId, selectEmployeeNames } = require('./db/utils')

// asciiart-logo styled splash screen
console.log(logo(config).render());

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

// Retrieves a list of managers
const getManagers = async () => {
  const [rows] = await promisePool.query(selectManagers)
  return rows;
}

// Retrieves a given department's ID
const getDepartmentId = async (department) => {
  const [rows] = await promisePool.query(selectDepartmentId, department)
  return rows.map(row => row.id)
}

// Retrieves the role title's ID
const getRoleId = async (roleTitle) => {
  const [rows] = await promisePool.query(selectRoleId, roleTitle)
  return rows.map(row => row.id);
}

// Retrieves an array of concated employee names
const getEmployeeNames = async () => {
  const [rows] = await promisePool.query(selectEmployeeNames)
  return rows.map(row => row.name);
}

// Retrieves a given employee's ID
const getEmployeeId = async (name) => {
  if(name === 'None') return null;
  const [rows] = await promisePool.query(selectEmployeeId, name)
  return rows.map(row => row.id)
}

// Retrieves and prints all data from a given table
const printAllTable = async (choice) => {
  const table = choice.split(' ')[2].slice(0, -1);
  const data = await selectAllFromTable(table);
  console.table(`${table}s`, data);
}

// Updates an employee's info
const updateEmployee = async () => {
  const employeeNames = await getEmployeeNames();
  // Retrieves rows from specified tables
  const roleTable = await selectAllFromTable('role');
  const managers = await getManagers();

  // Maps rows to get specified columns
  const roleTitles = roleTable.map(row => row.title)
  const managerNames = managers.map(manager => manager.name)

  const questions = [
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's role do you want to update?`,
      choices: employeeNames
    },
    {
      type: 'list',
      name: 'role',
      message: `Which role do you want to assign the selected emloyee?`,
      choices: roleTitles
    },
    {
      type: 'confirm',
      name: 'wantsNewManager',
      message: 'Do you want to reassign employee to a new manager?'
    },
    {
      type: 'list',
      name: 'newManager',
      message: 'Which manager would you like to assign employee to?', 
      choices: ["None", ...managerNames],
      when: (answers) => answers.wantsNewManager === true
    }
  ]
  const { employee, role, newManager } = await inquirer.prompt(questions)

  
}

// Insert functions

// Adds a new department to the database
const addDepartment = async () => {
  const question =   {
    type: 'input',
    name: 'newDepartment',
    message: 'What is the name of the department?',
    validate: newDepartment => {
      if (newDepartment.length > 0 && newDepartment.length <= 30) return true;
      return `Department name must be between 1 and 30 characters.`
    }
  }
  // Deconstructs answer
  const { newDepartment } = await inquirer.prompt(question)
  // Insert query for new department
  await promisePool.query(newDepartmentQuery, newDepartment)
  console.log(`${newDepartment} was added.`)
}

// Adds a new role to the database
const addRole = async () => {
  const departmentArr = await selectAllFromTable('department')
  const departments = departmentArr.map(department => department.name);
  console.log(departments)
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
  const departmentId = await getDepartmentId(department);
  // Insert query for new role
  await promisePool.query(newRoleQuery, [newRole, salary, departmentId])
  console.log(`${newRole} was added.`)
}

// Adds a new employee to the database
const addEmployee = async () => {
  // Retrieves rows from specified tables
  const roleTable = await selectAllFromTable('role');
  const managers = await getManagers();

  // Maps rows to get specified columns
  const roleTitles = roleTable.map(row => row.title)
  const managerNames = managers.map(manager => manager.name)
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
  
  // Retrieves the role ID and manager ID
  const roleId = await getRoleId(newEmployeeRole)
  const managerId = await getEmployeeId(managerName);
  
  // Insert query for new employee
  await promisePool.query(newEmployeeQuery, [firstName, lastName, roleId, managerId])
  console.log(`${firstName} ${lastName} was added.`)
}

// Takes in a task and switches to the appropriate function
const caseSwitch = async (choice) => {
  switch(choice) {
    // All three of these function the same way. Each returns all data from a specified table
    case 'View all employees':
    case 'View all roles':
    case 'View all departments': printAllTable(choice);
      break;
    case 'Add employee': await addEmployee();
    break;
    case 'Update employee role': await updateEmployee();
    break;
    case 'Add role': await addRole();
    break;
    case 'Add department': await addDepartment();
    break;
    default: return;
  }
}

// Initiates employee tracker program
const init = async () => {
  const question = {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit']
  }
  const { root } = await inquirer.prompt(question);
  const again = root !== 'Quit';

  await caseSwitch(root);

  return again ? init() : process.exit()
}

init();

/**
 * 

Update employee role -> Which employee’s role do you want to update? (display * from employee) -> Which role do you want to assign the selected employee (return * from roles except current role) -> return to beginning prompt
 */