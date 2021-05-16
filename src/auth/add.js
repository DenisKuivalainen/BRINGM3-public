import { append, curry } from "ramda";
import Cookies from 'cookies';
import { db } from "./db";
import { message } from "./res";
import { composeP, viewOnPath } from "ramda-godlike";


const handler = async (req, res) => {
    const cookies = new Cookies(req, res);
    const getValue = (param) => viewOnPath(append(param, ["body"]), req);
    const addSuccessful = composeP(
        id => !!id,
        viewOnPath([0, "id"]),
        curry(db)("select * from add_user($1::int8, $2::text, $3::text, $4::boolean, $5::boolean, $6::boolean) as id"),
        (...args) => args
    )

    const username = getValue("user");
    const name = getValue("name");
    const canAdd = getValue("add");
    const canReserve = getValue("reserve");
    const canDelete = getValue("delete");
    const session = parseInt(cookies.get("session"));

    let msg = await addSuccessful(session, username, name, canAdd, canReserve, canDelete);
    message(res, msg);

    res.end();
}

export default handler;
