export const queries = {
    insertRole: 'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id',
    selectRoles: 'SELECT * FROM roles',
    checkUserExists: 'SELECT * FROM users WHERE id = $1',
    checkRoleExists: 'SELECT * FROM roles WHERE id = $1',
    insertUserRoles: 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
    removeUserRoles: 'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2'
};
