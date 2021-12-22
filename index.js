// Importing dependencies
const logo = require('asciiart-logo');
const inquirer = require('inquirer');
const config = require('./package.json');
const mysql = require('mysql2');
require('console.table');
// Query strings and helper functions
const { selectStr, selectEmployeeManager, newDepartmentQuery, newRoleQuery, newEmployeeQuery, updateEmployee, deleteFromQuery, searchFor, getFullNames, determineId, selectEmployeeDepartment, selectTotalSalary } = require('./db/utils')

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

// Display functions

// Retrieves and prints all data from a given table
const printAllTable = async (choice) => {
  const table = choice.split(' ')[2].slice(0, -1);
  const data = await selectAllFromTable(table);
  console.table(`${table.toUpperCase()}S`, data);
}

// Prints employees by department
const printEmployeeDepartment = async () => {
  const [rows] = await promisePool.query(selectEmployeeDepartment)
  console.table(rows)
}

// Prints a table of employee IDs, names, and their manager's employee ID
const printEmployeeManager = async () => {
  const [rows] = await promisePool.query(selectEmployeeManager)
  console.table(rows)
}

// Prints the total salary budget of the chosen department
const printBudget = async () => {
  // Retrieves department table and stores it in an array
  const departmentArr = await selectAllFromTable('department');
  // Array of department names
  const departments = departmentArr.map(department => department.name);
  const question = {
    type: 'list',
    name: 'department',
    message: `Which department's budget would you like to view?`,
    choices: departments
  }
  const { department } = await inquirer.prompt(question);
  // Searches for chosen department's ID
  const id = searchFor(departmentArr, 'name', department, 'id');
  // All the salaries from chosen department
  const [rows] = await promisePool.query(selectTotalSalary, id);
  let totalSalary = 0;
  // Adds all salaries together
  rows.forEach(row => totalSalary += Number(row.salary))
  console.log(`$${totalSalary.toLocaleString("en-US")} is currently being spent on salaries in ${department}.`);
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
  const employeeId = determineId(employeeTable, employee)
  // Deconstructs role id from role table
  const roleId = searchFor(roleTable, 'title', newRole, 'id')
  // Query that updates employee info
  await promisePool.query(updateEmployee, ['role_id', roleId, employeeId])
  console.log(`${employee} was updated.`);
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
  const employeeId = determineId(employeeTable, employee);
  // Determines manager's ID, returns null if no new manager
  const managerId = determineId(employeeTable, managerName)
  // Update query
  await promisePool.query(updateEmployee, ['manager_id', managerId, employeeId])
  console.log(`${employee}'s manager was changed.`)
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
  const roleId = searchFor(roleTable, 'title', newEmployeeRole, 'id');
  // Determines the chosen manager's ID
  const managerId = determineId(employeeTable, managerName)
  // Insert query for new employee
  await promisePool.query(newEmployeeQuery, [firstName, lastName, roleId, managerId])
  console.log(`${firstName} ${lastName} was added.`)
}

// Delete functions

// Removes a department or role
const removeFrom = async (choice) => {
  // Determines which table to delete from
  const table = choice.split(' ')[1];
  const tableInfo = await selectAllFromTable(table);
  // Determines if table is department or role then sets column name const
  if (table === 'department') columnName = 'name'
  else if (table === 'role') columnName = 'title'
  const nameList = tableInfo.map(row => row[columnName])
  const question = {
    type: 'list',
    name: 'toRemove',
    message: `Which ${table} would you like to remove?`,
    choices: nameList
  }
  const { toRemove } = await inquirer.prompt(question);
  const id = searchFor(tableInfo, columnName, toRemove, 'id')
  // Deletes selected item from table
  await promisePool.query(deleteFromQuery, [table, id])
  console.log(`${toRemove} was removed.`)
}

// Removes an employee
const removeEmployee = async () => {
  // Retrieves an array of employee names 
  const employeeTable = await selectAllFromTable('employee');
  const employeeNames = getFullNames(employeeTable);
  const question = {
    type: 'list',
    name: 'employee',
    message: 'Which employee would you like to remove?',
    choices: employeeNames
  }
  const { employee } = await inquirer.prompt(question);
  const employeeId = determineId(employeeTable, employee)
  await promisePool.query(deleteFromQuery, ['employee', employeeId]);
  console.log(`${employee} was removed.`)
}

// Takes in a task and switches to the appropriate function
const caseSwitch = async (choice) => {
  switch (choice) {
    // All three of these choices function the same way. Each returns all data from a specified table
    case 'View all departments':
    case 'View all roles':
    case 'View all employees': await printAllTable(choice);
      break;
    case 'Remove department':
    case 'Remove role': await removeFrom(choice);
      break;
    case 'Remove employee': await removeEmployee();
      break;
    case 'View all employees by department': await printEmployeeDepartment();
      break;
    case 'View all employees by manager': await printEmployeeManager();
      break;
    case 'Add employee': await addEmployee();
      break;
    case 'Update employee role': await changeEmployeeRole();
      break;
    case `Change an employee's manager`: await changeManager();
      break;
    case 'Add role': await addRole();
      break;
    case 'Add department': await addDepartment();
      break;
    case 'View department budget': await printBudget();
      break;
  }
}

// Initiates employee tracker program
const init = async () => {
  const question = {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', `Change an employee's manager`, 'View all roles', 'Add role', 'Remove role', 'View all departments', 'Add department', 'Remove department', 'View department budget', 'Quit']
  }
  const { root } = await inquirer.prompt(question);
  // Takes the answer and performs the appropriate function
  await caseSwitch(root);
  // Determines whether or not to run init() again
  const again = root !== 'Quit'
  return again ? await init() : process.exit()
}

// asciiart-logo styled splash screen
console.log(logo(config).render());

init();
