import Cookies from "cookies";
import { append, curry, __ } from "ramda";
import { viewOnPath, composeP } from "ramda-godlike";
import { db } from "../../../src/auth/db";
import { compare, hash } from "../../../src/auth/hashing";
import { checkUsername, message, redirect } from "../../../src/auth/res";

const getValue = curry((param, req) => JSON.parse(req.body)[param]);

const passCorrect = (req) => composeP(
    hashed => compare(getValue("pass", req), hashed),
    viewOnPath([0, "pass"]),
    curry(db)("select pass from users where username = $1::text"),
    (...args) => args
);

const getSession = async (req, res, user) => {
    const cookies = new Cookies(req, res);

    const encryptSession = async(sId) => {
        let hashedSId = await hash(sId);

        await db("update sessions set id=$1::text where id=$2::text", [hashedSId, sId]);

        return hashedSId;
    }

    

    const getSessionId = composeP(
        encryptSession,
        viewOnPath([0, "id"]),
        curry(db)("select * from new_session($1::text) as id"),
        (...args) => args
    );

    let sessionId = await getSessionId(user);

    cookies.set("session", sessionId, {maxAge: Date.now() + 5000000});
    redirect(res, "/");
}

const handler = async (req, res) => {
    let user = getValue("user", req);

    !(await checkUsername(user)) && await passCorrect(req)(user) ? 
        await getSession(req, res, user) : 
        message(res, "Username or password is not correct.");

    res.end();
}

export default handler