import { connection } from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function postSignUp(req, res) {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    try {
        const alreadyExists = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

        if (alreadyExists !== 0) {
            return res.status(422).send("Usuário já cadastrado. Tente fazer login.");
        }

        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`;
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
        res.status(500).send("Erro ao cadastrar usuário. Tente novamente.");
    }

}

export async function postSignIn(req, res) {
    const { email, password } = req.body;

    try {

        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        const user = await connection.query(query, values);

        if (user.rowCount === 0) {
            return res.status(422).send("Usuário não encontrado. Tente novamente.");
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password);

        if (isPasswordCorrect) {

            const data = {
                id: user.rows[0].id,
                name: user.rows[0].name,
            }

            const secretKey = process.env.JWT_SECRET;

            const token = jwt.sign(data, secretKey, { expiresIn: '1d' });

            const query = `INSERT INTO sessions ("userId", token) VALUES ($1, $2)`;
            const values = [user.rows[0].id, token];

            await connection.query(query, values);

            res.status(200).send(token);
        }

        res.status(422).send("Senha incorreta. Tente novamente.");

    } catch (error) {
        console.log(error);

        res.status(500).send("Erro ao fazer login. Tente novamente.");
    }
}