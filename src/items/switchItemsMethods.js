const { length, curry, find, map, compose, assoc } = require("ramda");
const { viewOnPath } = require("ramda-godlike");
const { db } = require("../auth/db");

const getBody = (req) => (key) => JSON.parse(req.body)[key];

const getItems = async (req, session) => {
    //#region Metods
    const updateItemsWithUsers = curry((users, key, item) => {
        let userIdOnKey = item[key];
        let userWithId = () => find((user) => user.id === userIdOnKey, users);

        return assoc(
            key + "_value",
            !!userIdOnKey ?  userWithId().nickname : userIdOnKey,
            item
        );
    });

    const getItems = async (familyRows) => {
        
        let thisFamilyId = viewOnPath([0, "family_id"], familyRows);

        let familyItems = await db("select * from items where family_id = $1 order by id", [thisFamilyId]);
        let familyUsers = await db("select id, nickname from users where family_id = $1", [thisFamilyId]);

        const updateItem = compose(
            updateItemsWithUsers(familyUsers, "added_id"),
            updateItemsWithUsers(familyUsers, "reserved_id")
        );

        return map(updateItem, familyItems);
    }
    //#endregion

    let familyId = await db("select family_id from users where id = (select user_id from sessions where id = $1::text)", [session]);

    return length(familyId) === 1 ? await getItems(familyId) : [];
}

const postItems = (req, session) => {
    const get = getBody(req);
    let item = get("item");
    let desc = get("desc");
    let category = get("category");
    return db("select * from new_item($1::text, $2::text, $3::text, $4::int)", [session, item, desc, category])
}

const putOrDeleteItems = (query) => (req, session) => db(query, [session, getBody(req)("id")]);

const switchMethod = (method) => {
    switch(method) {
        case "GET" : 
            return getItems;
        case "POST" : 
            return postItems;
        case "PUT": 
            return putOrDeleteItems("select * from reserve_item($1::text, $2::int)"); 
        case "DELETE": 
            return putOrDeleteItems("select * from delete_item($1::text, $2::int)"); 
    }
}

module.exports = { switchMethod };