//Importar as configurações do banco de dados
const Database = require("../db/config")
const bcrypt = require('bcrypt')

module.exports = {
    async create(req, res) {
        //Variável da conexão com o banco de dados
        const db = await Database()

        //Valores digitados pelo usuário na hora do cadastro
        const username = req.body.username;
        const fullAge = req.body.age;
        const email = req.body.email;
        const gen = req.body.gen;
        const bios = req.body.bios;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //Função que calcula a idade do usuário através da data de nascimento recebida
        function realAge(fullAge) {
            let age = 0;
            const year = new Date().getFullYear();            
            const month = new Date().getMonth() + 1;            
            const day = new Date().getDate();

            const ageYear = fullAge.slice(0, 4);
            const ageMonth = fullAge.slice(5, 7);
            const ageDay = fullAge.slice(8, 11)


            if(ageMonth < month) {
                age = year - ageYear
            }  else if(ageMonth == month && ageDay <= day) {
                age = year - ageYear
            } else {
                age = year - ageYear - 1
            }

            return age;
        }       

        //Criar um id único para o usuário
        let userId

        for(let i = 0; i < 6; i++) {
            i == 0 ? userId = Math.floor(Math.random() * 10).toString() : 
            userId += Math.floor(Math.random() * 10).toString();
        }

        //Verificar se já existe este email cadastrado no banco de dados
        const dbEmails = await db.all(`Select email FROM users`)
        let isEmail = dbEmails.some(dbEmail => dbEmail.email == email)

        //Se este email já existe exibe uma mensagem que diz que ja foi cadastrado
        if(isEmail) {
            res.render("error", {error: "Este email já foi cadastrado"})
        // Se o email não existe, verifica se as senhas digitadas são iguais
        } else {
            // Adiciona ao banco de dados as informações do usuário
            await db.run(`INSERT INTO users 
            (
                id,
                isLog,
                password,
                trys,
                blockTime,
                username,
                age,
                email,
                gen,
                bios
            ) VALUES (
                ${parseInt(userId)},
                0,
                "${hashedPassword}",
                0,
                0,
                "${username}",
                ${realAge(fullAge)},
                "${email}",
                "${gen}",
                "${bios}"
            )`
            )

            //Fecha a conexão com o banco de dados
            await db.close()
            
            //Redireciona para a página de login
            res.redirect('/')
        }
    },
    
    async login(req, res) {
        // Cria uma conexão com o database
        const db = await Database()

        //Função que calcula a quantidade de minutos exata desde 1970 e retorna a quantidade de minutos
        function getTime() {
            const date = new Date()
            const time = Number((date.getTime()/1000/60/60).toFixed(4));
            return time;
        }

        // //Verifica se existe o email no banco de dados
        const email = req.body.email
        const dbEmails = await db.all(`SELECT email FROM users`)
        const isEmail = await dbEmails.some(dbEmail => dbEmail.email === email)

        if(isEmail) {
            //Verifica a quantidade de tentativas do usuário de inserir a senha
            const trys = await db.get(`SELECT trys FROM users WHERE email = '${email}'`)

            //Pega o tempo em que o usuário digitou a senha errada pela terceira vez (valor inicial de = 0)
            const blockTime = await db.get(`SELECT blockTime FROM users WHERE email = '${email}'`)

            //Se o número de tentativas for maior ou igual a 3, o usuário é bloqueado por 5 minutos
            if((trys.trys >= 3) && ((getTime() - blockTime.blockTime).toFixed(4) < 0.08)) {
                //Exibe a mensagem de erro
                res.render("error", { error: "Você chegou no número máximo de tentativas, espere por 5 minutos para tentar novamente." })

                //Se o número de tentativas for menor que 3
            } else {
                //Se o tempo de 5 minutos já tiver passado, o número de tentativas do usuário volta para 0 e ele pode tentar novamente por 3 vezes
                await db.run(`UPDATE users SET blockTime = 0 WHERE email = '${email}'`);

                const user = await db.get(`SELECT * FROM users WHERE email = '${email}'`)
                
                //Verifica se a senha inserida é a correta
                if(await bcrypt.compare(req.body.password, user.password)) {
                    await db.run(`UPDATE users SET blockTime = 0 WHERE email = '${email}'`)
                    await db.run(`UPDATE users SET trys = 0 WHERE email = '${email}'`)
                    //Renderiza a conta do usuário
                    res.render("user", { username: user.username, email: user.email, age: user.age, gen: user.gen, bios: user.bios})
                } else 
                {
                    //Atualiza o número de tentativas para + 1
                    await db.run(`UPDATE users SET trys = ${trys.trys + 1} WHERE email = '${email}'`)
                    
                    const acutalTrys = await db.get(`SELECT trys FROM users WHERE email = '${email}'`)
                    
                    //Adiciona o exato tempo em que o usuário digitou a senha errada pela terceira vez ao banco de dados
                    if (acutalTrys.trys % 3 == 0) {
                        const blocktime = getTime();
                        await db.run(`UPDATE users SET blockTime = ${blocktime} WHERE email = '${email}'`)
                        res.render("error", { error: "Você chegou no número máximo de tentativas, espere por 5 minutos para tentar novamente." })
                        return;
                    }

                    //Renderiza a mensagem de senha incorreta
                    res.render("error", { error: "Senha incorreta"})
                }
            }
        } else {
                //Renderiza a mensagem de email não cadastrado
                res.render("error", { error: "Email não cadastrado" })
        }
    }
}