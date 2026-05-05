require("dotenv").config();
const { pool } = require("./index");

async function test() {
    const { rows } = await pool.query("SELECT NOW() as agora");
    console.log("Banco funcionando:", rows[0].agora);
    process.exit(0);
}

test().catch(console.error);
