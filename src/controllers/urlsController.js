import { connection } from "../database/db.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export async function postUrl(req, res) {

    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();
    
    let error = null;

    if (!token) {
        return res.status(401).send("Token não enviado");
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    let userInfo = null;

    userInfo = jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            error = err;
        }

    });

    if (error) {
        return res.status(401).send("Token inválido");
    } else {
        userInfo = jwt.verify(token, secretKey);
    }

    delete userInfo.iat;


    try {
        const userAuthorized = await connection.query(`
            SELECT * FROM sessions
            WHERE "token" = $1 and "userId" = $2
        `, [token, parseInt(userInfo.id)]);

        if (userAuthorized.rowCount === 0) {
            return res.status(401).send('Token inválido');
        }

        const shortlyUrl = nanoid(8);

        await connection.query(`
            INSERT INTO urls ("shortlyUrl", url, "userId")
            VALUES ($1, $2, $3)
        `, [shortlyUrl, url, user.id]);

        res.status(201).send({
            id,
            url,
            shortUrl: `${id}`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Erro ao encurtar URL");
    }

}

export async function getUrl(req, res) {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(422).send("ID inválido");
    }

    try {

        const query = `SELECT urls.id, urls."shortUrl", urls.url FROM urls 
        WHERE urls.id=$1`;
        const values = [parseInt(id)];

        const url = await connection.query(query, values);

        if (url.rowCount === 0) {
            return res.status(404).send("URL não encontrada");
        }

        res.status(200).send(...url.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Erro ao buscar URL");
    }

}

export async function deleteUrl(req, res) {

    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    let error = null;

    if (isNaN(id)) {
        return res.status(422).send("ID inválido");
    }

    if (!token) {
        return res.status(401).send("Token não enviado");
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    
    let userInfo = null;
    userInfo = jwt.verify(token, secretKey, function(err, decoded) {
        if (err){
            error = err;
        }
    }); 

    if(error){
        return res.status(401).send("Token inválido!");
    } else {
        userInfo = jwt.verify(token, secretKey);
    }

    delete userInfo.iat;

    try {
        const userAuthorized = await connection.query(`
            SELECT * FROM sessions
            WHERE "token" = $1 and "userId" = $2
        `, [token, parseInt(userInfo.id)]);

        if (!userAuthorized.rowCount === 0) {
            return res.status(401).send('Token inválido');
        }

        const query = `DELETE FROM urls WHERE id = $1`;
        const values = [id];

        await connection.query(query, values);

        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.status(500).send("Erro ao deletar URL");
    }

}

export async function getShortUrl(req, res) {

    const { shortUrl } = req.params;

    if (!shortUrl) {
        return res.status(422).send("URL inválida");
    }

    try {

        const query = `SELECT urls.url FROM urls WHERE urls."shortUrl"=$1`;
        const values = [shortUrl];

        const url = await connection.query(query, values);

        if (url.rowCount === 0) {
            return res.status(404).send("URL não encontrada");
        }

        await connection.query(`UPDATE urls SET visualization = visualization + 1 
        WHERE urls."shortUrl"=$1`, [shortUrl])

        res.redirect(url.rows[0].url);

    } catch (error) {

        console.log(error);
        res.status(500).send("Erro ao buscar URL");
    }

}




