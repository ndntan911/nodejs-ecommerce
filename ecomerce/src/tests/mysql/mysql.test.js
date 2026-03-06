const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 8811,
    user: 'root',
    password: 'tipjs',
    database: 'test',
});

const batchSize = 100000
const totalSize = 10_000_000

let currentId = 1
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name${currentId + i}`
        const age = (currentId + i) % 100
        const address = `address${currentId + i}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if (!values.length) {
        pool.end()
        return
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async (error, result) => {
        if (error) {
            console.error(error)
            return
        }
        console.log(result.affectedRows)
        await insertBatch()
    })
}

insertBatch();

