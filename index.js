const logo = require('asciiart-logo');
const inquirer = require('inquirer');
const config = require('./package.json');
const mysql = require('mysql2');
const { selectStr } = require('./db/utils')

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password1',
    database: 'kemployees_db'
  },
  console.log(`Connected to the kemployees_db database.`)
);

// asciiart-logo styled splash screen
console.log(logo(config).render());

// Prompts array
const questions = [

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


const init = async () => {
  const question = {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit']
  }
  const { root } = await inquirer.prompt(question);
  const again = root !== 'Quit';

  caseSwitch(root)

  return again ? init() : console.log('Thanks for tracking your employees!')
}

const getRoles = () => {
  let test = [];
  db.query(selectStr, ['title', 'role'], (err, results) => {
    if(err) console.error(err);
    else results.forEach(obj => test.push(obj.title));
    return test;
  }) 
  console.log(`Will this work? ${test}`)
}

// console.log(getRole());
// console.log('This is not gonna work' + getRoles());

const addEmployee = async () => {
  const roles = await getRoles()

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
    message: 'What is the employee\'s first name?',
    validate: lastName => {
      if (lastName.length > 0 && lastName.length <= 30) return true;
      return `Employee must have a last name shorter between 1 and 30 characters.`
    }
  },
  {
    type: 'list',
    name: 'newEmployeeRole',
    message: `What is the employee's role?`,
    choices: roles
  },
  {
    type: 'list',
    name: 'managerName',
    message: `Who is the employee's manager?`,
    choices: ['None', 'DISPLAY ALL THE OTHER MANAGERS']
  }]

  const answers = await inquirer.prompt(questions);

  db.query(selectStr, 'role', (err, results) => {

  })


}

// addEmployee();

// init();



// inquirer.prompt(questions)

// const trackEmployees = async () => {
  
//   const answers = await inquirer.prompt(questions);
//   const again = answers.root !== 'Quit';

//   // const queryThis = rootSwitch(answers)

//   // db.query(queryThis, (err, result) => {
//   //   if (err) {
//   //     console.log(err);
//   //   }
//   //   console.table(result);
//   // });

//   // return again ? trackEmployees() : console.log('You fucking rock')
//   return answers;
// }

// trackEmployees();

// const init = async () => {
//   const answers = await trackEmployees();
//   db.query(answers, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.table(result)
//   })
// }

// init();
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


/**
 *
 */