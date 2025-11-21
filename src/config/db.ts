import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

export const sqlConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER!,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export const pool = new sql.ConnectionPool(sqlConfig)
    .connect()
    .then(pool => {
        console.log("📦 Conectado a SQL Server correctamente");
        return pool;
    })
    .catch(err => {
        console.error("❌ Error al conectar a SQL Server:", err);
        throw err;
    });
