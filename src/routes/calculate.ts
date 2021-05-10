/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from 'express';
import path from "path";
import fs from "fs";
const router = Router();
const databasePath = path.join(__dirname, "../", "../", "database.json");

interface dbBody {
  id?: number,
  shape: string,
  dimensions: Record<string, number> | number,
  area: number
}

let database: dbBody[] = [];

/* POST Calculations. */
router.post('/', function (req: Request, res: Response, next: NextFunction) {
  if (!req.body.shape || !req.body.dimension) {
    return res.status(400).json({ status: "Error", message: "Please provide all details" })
  }
  if (typeof req.body.shape !== "string") {
    return res.status(400).json({ status: "Error", message: "Shape must be of type string" })
  }

  /* Calculate square area. */
  if (req.body.shape.toLowerCase() === "square") {
    if (typeof req.body.dimension !== "number") {
      return res.status(400).json({ status: "Error", message: "Side must be a number" })
    }
    const side = req.body.dimension;
    const shape = req.body.shape;
    const area: number = side * side;
    const newCalculation: dbBody = {
      shape: shape,
      dimensions: side,
      area: area
    }
    fs.readFile(databasePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      database = JSON.parse(data);
      const newPost = generateID(database, newCalculation)
      if (newPost) {
        database.push(newPost);
        writeToDatabase(databasePath, database);
      }
    })
    return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
  }

  /* Calculate rectangle area. */
  if (req.body.shape.toLowerCase() === "rectangle") {
    if (typeof req.body.dimension !== "object") {
      return res.status(400).json({ status: "Error", message: "Dimension must be of type object" })
    }
    const parameters = req.body.dimension;
    const numParams = Object.keys(parameters).length;

    if (numParams !== 2) {
      return res.status(400).json({ status: "Error", message: "Please provide 2 dimensions" });
    }
    if (numParams === 2 && (typeof parameters.a !== "number" || typeof parameters.b !== "number")) {
      return res.status(400).json({ status: "Error", message: "Dimensions must be numbers" })
    }
    const shape = req.body.shape;
    const a: number = parameters.a;
    const b: number = parameters.b;
    const area: number = a * b;
    const newCalculation: dbBody = {
      shape: shape,
      dimensions: { a: a, b: b },
      area: area
    }
    fs.readFile(databasePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      database = JSON.parse(data);
      const newPost = generateID(database, newCalculation)
      if (newPost) {
        database.push(newPost);
        writeToDatabase(databasePath, database);
      }
    })
    return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
  }


  /* Calculate triangle area. */
  if (req.body.shape.toLowerCase() == "triangle") {
    if (typeof req.body.dimension !== "object") {
      return res.status(400).json({ status: "Error", message: "Dimension must be of type object" })
    }
    const parameters = req.body.dimension;
    const numParams = Object.keys(parameters).length;

    if (numParams !== 3) {
      return res.status(400).json({ status: "Error", message: "Please provide 3 dimensions" });
    }
    if (numParams === 3 && (typeof parameters.a !== "number" || typeof parameters.b !== "number" || typeof parameters.c !== "number")) {
      return res.status(400).json({ status: "Error", message: "Dimensions must be numbers" })
    }
    const shape = req.body.shape;
    const a: number = parameters.a;
    const b: number = parameters.b;
    const c: number = parameters.c;
    const s: number = (a + b + c) / 2;
    const area: number = parseFloat(Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2));
    if (!area) {
      return res.status(400).json({ status: "Error", message: "Triangle cannot be made" });
    }
    const newCalculation: dbBody = {
      shape: shape,
      dimensions: { a: a, b: b, c: c },
      area: area
    }
    fs.readFile(databasePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      database = JSON.parse(data);
      const newPost = generateID(database, newCalculation)
      if (newPost) {
        database.push(newPost);
        writeToDatabase(databasePath, database);
      }
    })
    return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
  }

  /* Calculate circle area. */
  if (req.body.shape.toLowerCase() === "circle") {
    if (typeof req.body.dimension !== "number") {
      return res.status(400).json({ status: "Error", message: "Radius must be a number" })
    }
    const shape = req.body.shape;
    const radius = req.body.dimension;
    const area = parseFloat((Math.PI * (radius * radius)).toFixed(2));
    const newCalculation: dbBody = {
      shape: shape,
      dimensions: radius,
      area: area
    }
    fs.readFile(databasePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      
      database = JSON.parse(data);
      const newPost = generateID(database, newCalculation)
      if (newPost) {
        database.push(newPost);
        writeToDatabase(databasePath, database);
      }
    })
    return res.status(201).json({ status: "Successful", message: `The area of the ${req.body.shape} is ${area}` });
  }

  if (req.body.shape.toLowerCase() !== "square" || req.body.shape.toLowerCase() !== "rectangle" || req.body.shape.toLowerCase() !== "triangle" || req.body.shape.toLowerCase() !== "circle") {
    return res.status(404).json({ status: "Error", message: "Shape Not Found" });
  }

});

function generateID(database: dbBody[], newCal: dbBody) {
  if (database.length === 0) {
    const calculation = { id: 1, ...newCal };
    return calculation;
  } else if (database.length !== 0) {
    const lastID = database[database.length - 1].id;
    if (lastID) {
      const newID: number = lastID + 1;
      const calculation = { id: newID, ...newCal };
      return calculation;
    }
  }
}

function writeToDatabase(path: string, content: dbBody[]) {
  fs.writeFile(path, JSON.stringify(content, null, 4), err => {
    if (err) return console.log(err);
  })
  return;
}
export default router;
















