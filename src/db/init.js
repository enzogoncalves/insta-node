const Database = require("./config")

const initDb = {
    async init(){
        const db = await Database() // Abre a conexão como  banco de dados
        
        await db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                isLog NUMERIC,
                password TEXT,
                trys INTEGER,
                blockTime INTEGER,
                username TEXT,
                fullName TEXT,
                email TEXT,
                age INTEGER,
                bios TEXT
            )
        `);

        await db.close() // Fecha a conexão com o banco de dados
    }
}

initDb.init();
