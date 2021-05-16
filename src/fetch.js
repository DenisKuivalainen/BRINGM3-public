import { composeP } from "ramda-godlike";

const statusHendler = (router) => async (res) => {
    const response = await res.json();
    
    switch(res.status) {
        case 500:
            router.push("/500");
            break;
        case 404:
            router.push("/404");
            break;
        case 303:
            router.push(response.redirect);
            break;
        default:
            return response;
    }

    return undefined;
}

const fetchApi = (router) => composeP(statusHendler(router), fetch);

export default fetchApi;