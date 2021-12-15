const express = require('express');
const mysql = require('mysql2');
const trackEmployees = require('./index')
const { addEmployee, getEmployees, getDepartments, getManagers, getRoles, rootSwitch, getRoleId } = require('./helpers/utils')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password1',
    database: 'kemployees_db'
  },
  console.log(`Connected to the kemployees_db database.`)
);

// const answers = trackEmployees();



// db.promise().query(getEmployees())
//   .then( (data) => {
//     console.table(data);
//   })
//   .catch(console.log)
//   .then( () => console.end);

// db.query()
// loop {
//   const answers = trackEmployees();
//   db.query(switchFunction(answers) (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.table(result);
//   })
// }

// const testThis = async () => {
//   const answers = await trackEmployees();

//   db.query(getRoleId(answers.newEmployeeRole), (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result[0].id)
//     db.query(addEmployee(answers), result[0].id, (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.table(result)
//     });
//   })
// }

testThis();

app.use((req, res) => {

})

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = db;