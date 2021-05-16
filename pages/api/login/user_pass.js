import {  createPass, resetPass } from "../../../src/auth/user";
import { userMethodSwitch } from "../../../src/auth/res";

const handler = async (req, res) => userMethodSwitch(req, res, [ , , createPass, resetPass]);

export default handler;