import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
const router = Router();
const databasePath = path.join(__dirname, "../", "../", "database.json");

router.get("/", function (req: Request, res: Response, next: NextFunction) {
    fs.readFile(databasePath, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        let db = JSON.parse(data);
        return res.status(200).json({ status: "Successful", message: db });
    })
})

export default router;
 