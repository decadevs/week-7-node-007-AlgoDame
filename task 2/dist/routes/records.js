"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.Router();
const databasePath = path_1.default.join(__dirname, "../", "../", "database.json");
router.get("/", function (req, res, next) {
    fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        let db = JSON.parse(data);
        return res.status(200).json({ status: "Successful", message: db });
    });
});
exports.default = router;
