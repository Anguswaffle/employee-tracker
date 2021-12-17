const selectStr = `SELECT ?? FROM ??`


// Wildcard Identifiers
const selectNames = `SELECT concat(first_name, ' ', last_name) AS name FROM employee`

module.exports = { selectStr, selectNames }