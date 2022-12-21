import { connection } from "../database/db.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export async function postUrl(req, res) {

    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).send("Token não enviado");
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    const userInfo = jwt.verify(token, secretKey);
    delete userInfo.iat;

    try {
        const userAuthorized = await connection.query(`
            SELECT * FROM sessions
            WHERE token = $1
        `, [token]);

        if (!userAuthorized.rowCount === 0) {
            return res.status(401).send('Token inválido');
        }

        const id = nanoid(5);

        await connection.query(`
            INSERT INTO urls (id, url, "userId")
            VALUES ($1, $2, $3)
        `, [id, url, user.id]);

        res.status(201).send({
            id,
            url,
            shortUrl: `${id}`
        });

    } catch (error) {
        console.log(error);
        res.status(422).send("Erro ao encurtar URL");
    }

}

