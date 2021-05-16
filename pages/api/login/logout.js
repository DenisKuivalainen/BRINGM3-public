import Cookies from "cookies";
import { db } from "../../../src/auth/db";
import { redirect } from "../../../src/auth/res";

const handler = async (req, res) => {
    const cookies = new Cookies(req, res);
    const session = parseInt(cookies.get("session"));

    await db("delete from sessions where id = $1", [session]);
    cookies.set("session", "", {maxAge: 1000});

    redirect(res, "/auth/login");

    res.end();
}

export default handler;