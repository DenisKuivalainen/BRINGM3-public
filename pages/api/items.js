
import { message } from "../../src/auth/res";
import Cookies from "cookies";
import { switchMethod } from "../../src/items/switchItemsMethods";

const handler = async (req, res) => {
    const cookies = new Cookies(req, res);
    const session = cookies.get("session");

    message(res, await switchMethod(req.method)(req, session));
    res.end();
}

export default handler;