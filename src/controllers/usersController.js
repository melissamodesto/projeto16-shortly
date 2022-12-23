import { connection } from "../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function getUsers(req, res) {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send('ID inválido');
    }

    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "").trim();

    if(!token){
        return res.status(401).send(`Nenhum token enviado`);
    }

    const secretKey = process.env.JWT_SECRET;
    const userInfo = jwt.verify(token, secretKey);
    delete userInfo.iat;

    try {

        const userAuthorized = await connection.query(`SELECT * FROM sessions WHERE "token" = $1 AND "userId" = $2`, [token, parseInt(userInfo.id)]);
        
        if(userAuthorized.rowCount === 0){
            return res.status(401).send('Token inválido');
        }

        const query = `SELECT * FROM users WHERE id = $1`;
        const values = [id];

        const result = await connection.query(query, [parseInt(values)]);

        if (result.rowCount === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        const userInfoGenerally = await connection.query(`SELECT "userId" as id, name,
                                                        SUM(visualization) as "visitCount"
                                                        FROM users
                                                        JOIN urls ON urls."userId"=users.id
                                                        WHERE users.id=$1
                                                        GROUP BY "userId", name`,
            [parseInt(id)]);

        const userInfo = await connection.query(`SELECT urls.id, 
                                            urls."shortUrl", urls.url, urls.visualization as "visitCount" 
                                            FROM urls WHERE "userId"=$1`,
            [parseInt(id)]);

        if (userInfoGenerally.rowCount !== 0 && userInfo.rowCount !== 0) {
            const info = { ...userInfoGenerally.rows[0], "shortenedUrls": userInfo.rows };
            res.status(200).send(info);
        } else {
            const info = { id: isUser.rows[0].id, name: isUser.rows[0].name, visitCount: 0, shortenedUrls: [] };
            res.status(200).send(info);
        }

    } catch (error) {
        console.log(error);
        res.status(422).send('Erro ao buscar usuário');
    }
}

export async function getRanking(req, res) {
    try {
        const query = `SELECT "usersId" as id, name,
                        COUNT(url) as "linksCount",
                        SUM(visualization) as "visitCount"
                        FROM users
                        LEFT JOIN urls ON urls."userId"=users.id
                        GROUP BY "usersId", name
                        ORDER BY "visitCount" DESC
                        LIMIT 10`;

        const result = await connection.query(query);

        if (result.rowCount === 0) {
            return res.status(404).send('Ranking não encontrado');
        }

        res.status(200).send(result.rows);

    } catch (error) {
        console.log(error);
        res.status(422).send('Erro ao buscar ranking');
    }

}

