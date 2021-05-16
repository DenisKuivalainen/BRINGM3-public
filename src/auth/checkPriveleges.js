const Cookies = require('cookies');
const { test, find, assoc, forEach } = require('ramda');
const { config } = require('../config');
const { db } = require('./db');

const checkUrl = (url, param) => !!find(x => x === url, config("redirects", param));
const getRedirect = url => {return {
    destination: url,
    permanent: false,
}}

const isAuthenticated = (url, user) => {
    let anyAccess = checkUrl(url, "any");
    let headAccess = !user.is_head && checkUrl(url, "isHead");
    let canAddAccess = !user.can_add && checkUrl(url, "canAdd");

    let settings = checkUrl(url,"settings");

    return settings ? 
        getRedirect("/app/settings") :
        (anyAccess || headAccess || canAddAccess) ?
            getRedirect("/app") : undefined;
}

const notAuthenticated = url => test(/^\/app/, url) ? getRedirect("/") : undefined;

const checkPriveleges = async (ctx) => {
    const cookies = new Cookies(ctx.req, ctx.res);
    let url = ctx.resolvedUrl;

    let session = cookies.get("session");

    let userData = await db("select id, nickname, is_head, can_add, can_reserve from users where id = (select user_id from sessions where id = $1::text)", [session]);
    let user = userData[0];

    !!user && await db("update sessions set last_use = now() where id = $1::text", [session]);
    await db("delete from sessions where extract(epoch from now() - last_use) > 86400 * 20");

    // get redirect url
    let redirect = !!user ? isAuthenticated(url, user) : notAuthenticated(url);

    //remove unnesessary cookies
    const deleteCookies = c => cookies.set(c, 0, {maxAge: 1000});
    !!!user && forEach(deleteCookies, config("authCookies"));

    //create return object containing only props
    let returnObj = {props: (!!user ? user : {})};

    //if redirect needed, add redirect to return
    return !!redirect ? assoc("redirect", redirect, returnObj) : returnObj;
}

module.exports = { checkPriveleges };