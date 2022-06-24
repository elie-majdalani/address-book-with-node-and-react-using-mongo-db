const express = require("express");
const userModel = require("./models");
const app = express();
const jwt = require("jsonwebtoken");

app.post("/signup", async (request, response) => {
    const user = new userModel(request.body);
    try {
        const available = await userModel.find({ name: request.body.name, age: request.body.age });
        try {
            if (available.length === 1) {
                return response.status(403).send("User exists");
            }
            await user.save();
            response.send("sucess");
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }
    catch (error) {
        return response.status(500).send(error);
    }
});

app.post("/signin", async (request, response) => {
    const user = await userModel.find({ name: request.body.name, age: request.body.age });

    try {
        if (user.length === 0) {

            return response.status(404).send("User not found");

        }
        // jwt date set to 60 mins
        let data = {
            time: Date(),
            userId: user[0]._id.toString(),
        }

        const token = jwt.sign(data, "secretkey", (err, token) => {
            return response.send(token);
        });
        } catch (error) {
            return response.status(500).send(error);
        }
    });
    // app.get("/", verifyToken, (req, res) => {
    //     jwt.verify(req.token, "secretkey", (err, authData) => {
    //       if (err) {
    //         res.sendStatus(403);
    //       } else {
    //         res.json({
    //           message: "sucess...",
    //           authData:authData.userId
    //         });
    //       }
    //     });
    //   });

module.exports = app;