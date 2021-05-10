"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.Router();
const databasePath = path_1.default.join(__dirname, "../", "../", "database.json");
let database = [];
/* POST Calculations. */
router.post('/', function (req, res, next) {
    if (!req.body.shape || !req.body.dimension) {
        return res.status(400).json({ status: "Error", message: "Please provide all details" });
    }
    if (typeof req.body.shape !== "string") {
        return res.status(400).json({ status: "Error", message: "Shape must be of type string" });
    }
    /* Calculate square area. */
    if (req.body.shape.toLowerCase() === "square") {
        if (typeof req.body.dimension !== "number") {
            return res.status(400).json({ status: "Error", message: "Side must be a number" });
        }
        const side = req.body.dimension;
        const shape = req.body.shape;
        const area = side * side;
        const newCalculation = {
            shape: shape,
            dimensions: side,
            area: area
        };
        fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            database = JSON.parse(data);
            const newPost = generateID(database, newCalculation);
            if (newPost) {
                database.push(newPost);
                writeToDatabase(databasePath, database);
            }
        });
        return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
    }
    /* Calculate rectangle area. */
    if (req.body.shape.toLowerCase() === "rectangle") {
        if (typeof req.body.dimension !== "object") {
            return res.status(400).json({ status: "Error", message: "Dimension must be of type object" });
        }
        const parameters = req.body.dimension;
        const numParams = Object.keys(parameters).length;
        if (numParams !== 2) {
            return res.status(400).json({ status: "Error", message: "Please provide 2 dimensions" });
        }
        if (numParams === 2 && (typeof parameters.a !== "number" || typeof parameters.b !== "number")) {
            return res.status(400).json({ status: "Error", message: "Dimensions must be numbers" });
        }
        const shape = req.body.shape;
        const a = parameters.a;
        const b = parameters.b;
        const area = a * b;
        const newCalculation = {
            shape: shape,
            dimensions: { a: a, b: b },
            area: area
        };
        fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            database = JSON.parse(data);
            const newPost = generateID(database, newCalculation);
            if (newPost) {
                database.push(newPost);
                writeToDatabase(databasePath, database);
            }
        });
        return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
    }
    /* Calculate triangle area. */
    if (req.body.shape.toLowerCase() == "triangle") {
        if (typeof req.body.dimension !== "object") {
            return res.status(400).json({ status: "Error", message: "Dimension must be of type object" });
        }
        const parameters = req.body.dimension;
        const numParams = Object.keys(parameters).length;
        if (numParams !== 3) {
            return res.status(400).json({ status: "Error", message: "Please provide 3 dimensions" });
        }
        if (numParams === 3 && (typeof parameters.a !== "number" || typeof parameters.b !== "number" || typeof parameters.c !== "number")) {
            return res.status(400).json({ status: "Error", message: "Dimensions must be numbers" });
        }
        const shape = req.body.shape;
        const a = parameters.a;
        const b = parameters.b;
        const c = parameters.c;
        const s = (a + b + c) / 2;
        const area = parseFloat(Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2));
        if (!area) {
            return res.status(400).json({ status: "Error", message: "Triangle cannot be made" });
        }
        const newCalculation = {
            shape: shape,
            dimensions: { a: a, b: b, c: c },
            area: area
        };
        fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("the data===> ", data);
            database = JSON.parse(data);
            const newPost = generateID(database, newCalculation);
            if (newPost) {
                database.push(newPost);
                writeToDatabase(databasePath, database);
            }
        });
        return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
    }
    /* Calculate circle area. */
    if (req.body.shape.toLowerCase() === "circle") {
        if (typeof req.body.dimension !== "number") {
            return res.status(400).json({ status: "Error", message: "Radius must be a number" });
        }
        const shape = req.body.shape;
        const radius = req.body.dimension;
        const area = parseFloat((Math.PI * (radius * radius)).toFixed(2));
        const newCalculation = {
            shape: shape,
            dimensions: radius,
            area: area
        };
        fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            database = JSON.parse(data);
            const newPost = generateID(database, newCalculation);
            if (newPost) {
                database.push(newPost);
                writeToDatabase(databasePath, database);
            }
        });
        return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
    }
    if (req.body.shape.toLowerCase() !== "square" || req.body.shape.toLowerCase() !== "rectangle" || req.body.shape.toLowerCase() !== "triangle" || req.body.shape.toLowerCase() !== "circle") {
        return res.status(404).json({ status: "Error", message: "Shape Not Found" });
    }
});
function generateID(database, newCal) {
    if (database.length === 0) {
        const calculation = { id: 1, ...newCal };
        return calculation;
    }
    else if (database.length !== 0) {
        const lastID = database[database.length - 1].id;
        if (lastID) {
            const newID = lastID + 1;
            const calculation = { id: newID, ...newCal };
            return calculation;
        }
    }
}
function writeToDatabase(path, content) {
    fs_1.default.writeFile(path, JSON.stringify(content, null, 4), err => {
        if (err)
            return console.log(err);
    });
    return;
}
exports.default = router;
