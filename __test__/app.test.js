/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../bin/www");
describe("GET /fetchrecords: Record of all previous calculations", () => {
    it("should return a record of all the previous calculations in json format", async () => {
        const res = await request(app)
            .get("/fetchrecords")
            .set("Accept", "application/json");
        expect(res.status).toEqual(200);
        expect(res.type).toBe("application/json");
    });
});

describe("POST /calculate: Calculate the area of a shape", () => {
    it("should return the area of a given shape", async () => {
        const dummyData = {
            shape: "square",
            dimension: 5
        };

        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");
        expect(res.body.status).toBe("Successful");
        expect(res.body.message).toBe("The area of the square is 25");
        expect(res.status).toEqual(201);
        expect(res.type).toBe("application/json");
    });
});

describe("POST /calculate: Return error for invalid parameters", () => {
    it("Should send error message  for invalid triangle", async () => {
        const dummyData = {
            shape: "triangle",
            dimension: { a: 105, b: 99, c: 6 }
        };
        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");

        expect(res.body.status).toBe("Error");
        expect(res.body.message).toBe("Triangle cannot be made");
        expect(res.status).toEqual(400);
        expect(res.type).toBe("application/json");
    });

    it("Should send error message  for invalid number of parameters", async () => {
        const dummyData = {
            shape: "rectangle",
            dimension: { a: 105, b: 99, c: 6 }
        };
        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");
        expect(res.body.status).toBe("Error");
        expect(res.body.message).toBe("Please provide 2 dimensions");
        expect(res.status).toEqual(400);
        expect(res.type).toBe("application/json");
    });
});

describe("Return error for invalid shape and success for valid shapes", () => {
    it("Should send error message  for invalid shape", async () => {
        const dummyData = {
            shape: "hexagon",
            dimension: 6
        };
        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");
        expect(res.body.status).toBe("Error");
        expect(res.body.message).toBe("Shape Not Found");
        expect(res.status).toEqual(404);
        expect(res.type).toBe("application/json");
    });

    it("should return the area of a given shape", async () => {
        const dummyData = {
            shape: "circle",
            dimension: 8
        };

        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");
        expect(res.body.status).toBe("Successful");
        expect(res.body.message).toBe("The area of the circle is 201.06");
        expect(res.status).toEqual(201);
        expect(res.type).toBe("application/json");
    });

    it("should return the area of a given shape", async () => {
        const dummyData = {
            shape: "rectangle",
            dimension: { "a": 5, "b": 7 }
        };

        const res = await request(app)
            .post("/calculate")
            .send(dummyData)
            .set("Accept", "application/json");
        expect(res.body.status).toBe("Successful");
        expect(res.body.message).toBe("The area of the rectangle is 35");
        expect(res.status).toEqual(201);
        expect(res.type).toBe("application/json");
    });
});
