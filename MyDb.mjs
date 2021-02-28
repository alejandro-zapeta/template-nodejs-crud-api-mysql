import mysql from 'mysql';

const conf = {
    "connectionLimit": 10,
    "host": "localhost", // IP or the DNS domain or whatever
    "user": "root",
    "database": "testx",
    "password": "test123"
};
// Singleton pattern
var pool = null;

class MyDb {
    static async getPool() {
        try {
            // the pool will manage the connections
            if (pool === null) {
                pool = await mysql.createPool(conf);
            }
            return pool;
        } catch (ex) {
            throw ex;
        }
    }

    // select * from 
    static async query(query_) {
        return new Promise(async (resolve, reject) => {
            let thePool = await this.getPool();
            thePool.query(query_, (error, results, fields) => {
                if (error) reject(error);
                resolve(results);
            });
        })
    }

    /* queryFirstOne --- resolve(results[0]); */

    // insert, update and delete
    // acid principles
    static async execStatement(query, data) {
        return new Promise(async (resolve, reject) => {
            let thePool = await this.getPool();
            thePool.getConnection((error01, connection) => {
                if (error01) { reject(error01); return; }
                connection.beginTransaction((error02) => {
                    if (error02) { reject(error02); return; }

                    connection.query(query, data, (error03, r1) => {
                        connection.release();

                        if (error03) { connection.rollback(() => { reject(error03); return; }) }

                        connection.commit((error04) => {
                            if (error04) { connection.rollback(() => { reject(error04); return; }) }
                            resolve(r1.insertId);
                        })
                    })
                })
            })
        })
    }

}

export default MyDb;