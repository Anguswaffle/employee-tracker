const getEmployees = () => {
  return `SELECT * FROM employee`
}

const getDepartments = () => {
  return `SELECT * FROM department`
}

const getRoles = () => {
  return `SELECT * FROM role`
}

const getManagers = () => {
  return `SELECT * FROM employee e
          JOIN role r ON r.id = e.role_id
          WHERE title = Manager`
}

