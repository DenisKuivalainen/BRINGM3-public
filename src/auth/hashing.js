const bcrypt = require("bcrypt");

const hash = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
}

const compare = bcrypt.compare;

module.exports = { hash, compare };

