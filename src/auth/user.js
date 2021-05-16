const { append, curry } = require("ramda");
const { db } = require("./db");
const { checkUsername } = require("./res");
const { composeP, viewOnPath } = require("ramda-godlike");
const { hash } = require("./hashing");

const getValue = curry((req, param) => JSON.parse(req.body)[param]);

const queryToDb = (query) => composeP(
    id => !!id,
    viewOnPath([0, "id"]),
    curry(db)(query)
);

const deleteFromUsers = async (req, cookies, sql) => {
    const username = getValue(req, "user");
    const session = cookies.get("session");

    return !(await checkUsername(username)) && await queryToDb(sql)([session, username]);
}

//#region GET: get users
const getUsers = async (req, cookies) => await db("select id, username, nickname, family_id, can_add, can_reserve, can_delete, (pass is not null) as pass from users where family_id = (select family_id from users where id = (select user_id from sessions where id = $1)) and is_head = false order by id", [cookies.get("session")]);
//#endregion

//#region POST: add user
const addUser = async (req, cookies) => {
    const addSuccessful = composeP(
        queryToDb("select * from add_user($1::text, $2::text, $3::text, $4::boolean, $5::boolean, $6::boolean) as id"),
        (...args) => args
    )

    const value = getValue(req);

    const username = value("user");
    const name = value("name");
    const canAdd = value("add");
    const canReserve = value("reserve");
    const canDelete = value("delete");
    const session = cookies.get("session");

    return await checkUsername(username) && await addSuccessful(session, username, name, canAdd, canReserve, canDelete);
}
//#endregion

//#region PUT: edit user
const editUser = async (req, cookies) => {
    const addSuccessful = composeP(
        queryToDb("select * from update_user($1::text, $2::int, $3::boolean, $4::boolean, $5::boolean) as id"),
        (...args) => args
    )

    const value = getValue(req);

    const id = value("id");
    const canAdd = value("add");
    const canReserve = value("reserve");
    const canDelete = value("delete");
    const session = cookies.get("session");

    return await addSuccessful(session, id, canAdd, canReserve, canDelete);
}
//#endregion

//#region DELETE: delete user
const deleteUser = (...args) => deleteFromUsers(...args, "select * from delete_user($1, $2) as id");
//#endregion

//#region PUT: add pass
const createPass = async (req) => {
    const username = getValue(req, "user");
    const pass = await composeP(hash, getValue)(req, "pass");
    
    return !(await checkUsername(username)) && await queryToDb("select * from add_pass($1, $2) as id")([username, pass]);
}
//#endregion

//#region DELETE: reset pass
const resetPass  = (...args) => deleteFromUsers(...args, "select * from reset_pass($1, $2) as id");
//#endregion

module.exports = { addUser, editUser, deleteUser, resetPass, createPass, getUsers };