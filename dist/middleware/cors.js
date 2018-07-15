"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    if (req.method === "OPTIONS") {
        res.status(200).end();
    }
    else {
        next();
    }
}
exports.cors = cors;
//# sourceMappingURL=cors.js.map