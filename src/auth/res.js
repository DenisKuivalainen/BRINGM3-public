const Cookies = require("cookies");
const { equals, curry, map, compose, concat, repeat, take, __ } = require("ramda");
const { composeP, viewOnPath } = require("ramda-godlike");
const { db } = require("./db");

const writeJsonResponce = (res, status, json) => {
    res.status(status);
    res.json(json);
}

const message = (res, msg) => writeJsonResponce(res, 200, {"message": msg});

const redirect = (res, url) => writeJsonResponce(res, 303, {"redirect": url});

const checkUsername = composeP( // Check if there is user with such username exists
    equals(0),
    parseInt,
    viewOnPath([0, "count"]),
    curry(db)("select count(*) from users where username = $1::text"),
    (...args) => args
);

const userMethodSwitch = async (req, res, results) => {
    const cookies = new Cookies(req, res);

    const getSuccess = () => {
        // Convert args to functions
        const toFunctions = (n, d) => compose(
            map(arg => !!arg ? arg : function() {return false;}), 
            take(n), 
            concat(__, repeat(d, n))
        );

        let fns = toFunctions(5, undefined)(results);
        switch(req.method) {
            case "GET" : 
                return fns[0];
            case "POST" : 
                return fns[1];
            case "PUT": 
                return fns[2]; 
            case "DELETE": 
                return fns[3]; 
            default: fns[4];
        }
    }
    
    const success = await getSuccess()(req, cookies);
    message(res, success);
    res.end();  
}

module.exports = { message, redirect, checkUsername, userMethodSwitch }