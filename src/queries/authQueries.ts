export const authQueries = {
    checkExistingUser: 'SELECT * FROM users WHERE email = $1 OR username = $2',
    insertUser: 'INSERT INTO users (name, lastName, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    selectRoleId: 'SELECT id FROM roles WHERE name = $1',
    insertUserRoles: 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
    selectUserByUsername: 'SELECT * FROM users WHERE username = $1'
};