let env = process.env.NODE_ENV || 'development';
const config = {
    development: {
        db: 'mysql://winter:coding@localhost:3306/todoList'
    },
    production: {

    }
};
module.exports = config[env];