import { addUser, editUser, deleteUser, getUsers } from "../../../src/auth/user";
import { userMethodSwitch } from "../../../src/auth/res";

const handler = (req, res) => userMethodSwitch(req, res, [ getUsers, addUser, editUser, deleteUser]);

export default handler;