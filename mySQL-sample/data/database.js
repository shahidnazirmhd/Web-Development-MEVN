const mysql=require("mysql2/promise");
const pool=mysql.createPool({
    host: "localhost",
    database: "blogdb",
    user: "root",
    password: "passmysql"
});
module.exports=pool;