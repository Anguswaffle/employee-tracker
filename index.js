const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit']
  },
  {
    type: 'input',
    name: 'firstName',
    message: 'What is the employee\'s first name?',
    when: (answers) => answers.root === 'Add employee',
    validate: firstName => {
      if (firstName.length > 0 && firstName.length <= 30) return true;
      return `Employee must have a first name shorter between 1 and 30 characters.`
    }
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'What is the employee\'s first name?',
    when: (answers) => answers.root === 'Add employee',
    validate: lastName => {
      if (lastName.length > 0 && lastName.length <= 30) return true;
      return `Employee must have a last name shorter between 1 and 30 characters.`
    }
  },
  {
    type: 'list',
    name: 'newEmployeeRole',
    message: `What is the employee's role?`,
    when: (answers) => answers.root === 'Add employee',
    choices: ['DISPLAY ALL THE ROLES HERE']
  },
  {
    type: 'list',
    name: 'managerName',
    message: `Who is the employee's manager?`,
    when: (answers) => answers.root === 'Add employee',
    choices: ['None', 'DISPLAY ALL THE OTHER MANAGERS']
  },
  {
    type: 'list',
    name: 'employee',
    message: `Which employee's role do you want to update?`,
    when: (answers) => answers.root === 'Update employee role',
    choices: ['DISPLAY ALL EMPLOYEES HERE']
  },
  {
    type: 'list',
    name: 'role',
    message: `Which role do you want to assign the selected emloyee?`,
    when: (answers) => answers.root === 'Update employee role',
    choices: ['DISPLAY ALL ROLES EXCEPT THE EMPLOYEE\'S CURRENT ROLE']
  },
  {
    type: 'input',
    name: 'newRole',
    message: `What is the name of the role?`,
    when: (answers) => answers.root === 'Add role',
    validate: newRole => {
      if (newRole.length > 0 && newRole.length <= 30) return true;
      return `Role name must be between 1 and 30 characters.`
    }
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary of the role?',
    when: (answers) => answers.root === 'Add role',
    validate: salary => {
      if (isNaN(salary)) return `Salary must be a number only.`
      else if (salary === '') return `Please enter a salary.`
      return true;
    }
  },
  {
    type: 'list',
    name: 'departmentRole',
    message: 'What department does the role belong to?',
    when: (answers) => answers.root === 'Add role',
    choices: ['DISPLAY ALL DEPARTMENTS']
  },
  {
    type: 'input',
    name: 'newDepartment',
    message: 'What is the name of the department?',
    when: (answers) => answers.root === 'Add department',
    validate: newDepartment => {
      if (newDepartment.length > 0 && newDepartment.length <= 30) return true;
      return `Department name must be between 1 and 30 characters.`
    }
  }
]

inquirer.prompt(questions)




/**
 * What would you like to do?
View all employees -> (returns all employees)

Add employee -> What is the employee’s first name? What is the employee’s last name? What is the employee’s role? (display roles) Who is the employee’s manager? (display * from managers where role = ‘Manager’ &&& None) -> return to beginning prompt

Update employee role -> Which employee’s role do you want to update? (display * from employee) -> Which role do you want to assign the selected employee (return * from roles except current role) -> return to beginning prompt

View all roles -> (returns all roles)

Add role -> What is the name of the role? -> What is the salary of the role? -> What department does the role belong to? (display departments) -> Back to beginning prompt

View all department -> (display * from departments)

Add department -> What is the name of the department? -> Back to beginning prompt

Quit
 */