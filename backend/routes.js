const express = require("express");
const userModel = require("./models/User");
const addressModel = require(".models/Address");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.post("/signup", async (request, response) => {
    const user = new userModel({ username: request.body.username, password: bcrypt.hashSync(request.body.password, 10) });
    try {
        const available = await userModel.find({ username: request.body.username, password: bcrypt.hashSync(request.body.password, 10) });
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
    try {
        var user = await userModel.findOne({ username: request.body.username }).exec();
        if (!user) {
            return response.status(400).send({ message: "The username and or password does not exist" });
        }
        if (!bcrypt.compareSync(request.body.password, user.password)) {
            return response.status(400).send({ message: "The username and or password does not exist" });
        }
        let data = {
            time: Date(),
            userId: user._id.toString(),
        };
        const token = jwt.sign(data, "secretkey", (err, token) => {
            return response.send(token);
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

// add that adds a new address to the user
app.post("/addAddress", verifyToken, async (request, response) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403).send({ message: "Unauthorized" });
        } else {
            const address = new addressModel({
                fullname: request.body.fullname,
                phone: request.body.phone,
                relationship: request.body.relationship,
                email: request.body.email,
                location: {
                    type: "Point",
                    coordinates: [request.body.longitude, request.body.latitude],
                },
            });
            try {
                const user = await userModel.findById(authData.userId);
                user.addressId.push(address._id.toString());
                await user.save();
                response.send("success");
            }
            catch (error) {
                response.status(500).send(error);
            }
        }
    });
}
);


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