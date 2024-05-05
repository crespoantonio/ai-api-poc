export const rolQueries = {
    insertRole: 'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id',
    selectRoles: 'SELECT * FROM roles',
    checkUserExists: 'SELECT * FROM users WHERE id = $1',
    checkRoleExists: 'SELECT * FROM roles WHERE id = $1',
    insertUserRoles: 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
    removeUserRoles: 'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
    checkUserHasRole: 'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
    selectUserRolesByUsername: 'SELECT r.id, r.name FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE u.username = $1'
};
