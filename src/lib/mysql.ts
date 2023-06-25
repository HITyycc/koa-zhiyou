import mysql from "mysql2"
import Config from "config"

const pool = mysql.createPool({
    host: Config.get("mysql.host"),
    port: Config.get("mysql.port"),
    user: Config.get("mysql.user"),
    password: Config.get("mysql.password"),
    database: Config.get("mysql.database")
})

export const mysqlClient = pool.promise()