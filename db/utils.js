const selectStr = `SELECT * FROM ??`
const selectNames = `SELECT concat(first_name, ' ', last_name) AS name FROM employee`
const selectRoles = `SELECT title, id FROM role`
const selectManagers = `SELECT first_name FROM employee WHERE role_id = 1`



module.exports = { selectManagers, selectStr, selectNames }