const pool = require("../config/db");

class UserModel {
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
                if (error) {
                    return reject(error);
                }
                const mappedResults = results.map(user => {
                    return {
                        id: user.id,
                        username: user.username,
                        password: user.password
                    };
                })
                resolve(mappedResults);
            });
        })
    }

    static async createUser(username, password) {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.insertId);
            });
        });
    }
}
module.exports = UserModel;