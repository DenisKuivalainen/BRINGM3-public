import { append } from "ramda";
import { composeP, viewOnPath } from "ramda-godlike";
import { db } from "../../../src/auth/db";
import { hash } from "../../../src/auth/hashing";
import { checkUsername, message, redirect } from "../../../src/auth/res";

// Create new family and add new user
const addNewUser = async (res, ...args) => {
    await db("select * from new_head_user($1::text, $2::text, $3::text)", args);

    redirect(res, "/auth/success");
}

const handler = async (req, res) => {

    const getValue = (param) => JSON.parse(req.body)[param];
    
    let username = getValue("user");
    let pass = await composeP(hash, getValue)("pass");
    let name = getValue("name");

    await checkUsername(username) ? 
        await addNewUser(res, username, pass, name) : 
        message(res, "Username exists. Please, choose another one."); 

    res.end();
}

export default handler;