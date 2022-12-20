import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import connection from '../database/connection.js';

export async function postSignUp(req, res) {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    try {
        const alreadyExists = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

        if (alreadyExists !== 0) {
            return res.status(422).send("Usuário já cadastrado. Tente fazer login.");
        }

        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [name, email, hash];

        try {
            await connection.query(query, values);
            res.sendStatus(201);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        res.status(422).send("Erro ao cadastrar usuário. Tente novamente.");
    }

}

export async function postSignIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await connection.query('SELECT * FROM users.email, users.password WHERE email = $1', [email]);

        if (user.rowCount === 0) {
            return res.status(422).send("Usuário não encontrado. Tente novamente.");
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password);

        if (!isPasswordCorrect) {
            return res.status(422).send("Senha incorreta. Tente novamente.");
        }

        const token = uuid();

        try {
            await connection.query('UPDATE users SET token = $1 WHERE email = $2', [token, email]);
            res.send(token);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    } catch (error) {
        console.log(error);
        res.status(422).send("Erro ao fazer login. Tente novamente.");
    }
}