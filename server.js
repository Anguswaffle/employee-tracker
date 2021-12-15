const express = require('express');
const mysql = require('mysql2');
const trackEmployees = require('./index')
const { getEmployees, getDepartments, getManagers, getRoles } = require('./helpers/utils')

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


// db.query(getManagers(), (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.table(result);
// });

app.use((req, res) => {

})

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = db;