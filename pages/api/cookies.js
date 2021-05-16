import Cookies from "cookies";
import { viewOnPath } from "ramda-godlike";
import { message } from "../../src/auth/res";

const api = (req, res) => {
    const cookies = new Cookies(req, res);

    const query = (param) => viewOnPath(["query", param], req);
    
    cookies.set(query("name"), query("value"), {maxAge: Date.now() + 5000000, httpOnly: false});
    
    message(res, "Cookie set")
    res.end();
}
  
export default api;