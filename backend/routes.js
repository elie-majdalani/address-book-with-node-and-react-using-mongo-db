const express = require("express");
const userModel = require("./models/User");
const addressModel = require("./models/Address");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.post("/signup", async (req, res) => {
    const user = new userModel({ username: req.body.username, password: bcrypt.hashSync(req.body.password, 10) });
    try {
        const available = await userModel.find({ username: req.body.username, password: bcrypt.hashSync(req.body.password, 10) });
        try {
            if (available.length === 1) {
                return res.status(403).send("User exists");
            }
            await user.save();
            res.status(200).send("success");
        }
        catch (error) {
            return res.status(500).send(error);
        }
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

app.post("/signin", async (req, res) => {
    try {
        var user = await userModel.findOne({ username: req.body.username }).exec();
        if (!user) {
            return res.status(400).send({ message: "The username and or password does not exist" });
        }
        if (bcrypt.hashSync(req.body.password, 10) === user.password) {
            return res.status(400).send({ message: "The username and or password does not exist" });
        }
        let data = {
            time: Date(),
            userId: user._id.toString(),
        };
        const token = jwt.sign(data, "secretkey", (err, token) => {
            data = {
                status: "success",
                token: token,
            }
            return res.json(data);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// add that adds a new address to the user
app.post("/addAddress", verifyToken, async (req, res) => {
    const address = new addressModel({
        fullname: req.body.fullname,
        phone: req.body.phone,
        relationship: req.body.relationship,
        email: req.body.email,
        location: {
            type: "Point",
            coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
        },
    });
    try {
        await address.save();
        const user = await userModel.findById(req.authData.userId);
        user.addressId.push(address._id.toString());
        await user.save()
        res.send("success")
    }
    catch (error) {
        res.status(500).send(error);
    }
});

//get contact info from the entry of a new contact
app.get("/getAddress", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.authData.userId);
    const address = await addressModel.find({ _id: { $in: user.addressId } });
    res.send(address);
});

//  Seach by name
app.post("/searchbyname", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.authData.userId);
    const address = await addressModel.find({ _id: { $in: user.addressId } });
    const search = req.body.search;
    const result = address.filter((address) => {
        return address.fullname.toLowerCase().includes(search.toLowerCase());
    });
    res.send(result);
});

// Search by phone
app.post("/searchbyphone", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.authData.userId);
    const address = await addressModel.find({ _id: { $in: user.addressId } });
    const search = req.body.search;
    const result = address.filter((address) => {
        return address.phone.toLowerCase().includes(search.toLowerCase());
    });
    res.send(result);
});

// Seatch by email
app.post("/searchbyemail", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.authData.userId);
    const address = await addressModel.find({ _id: { $in: user.addressId } });
    const search = req.body.search;
    const result = address.filter((address) => {
        return address.email.toLowerCase().includes(search.toLowerCase());
    });
    res.send(result);
});

// Search by relationship
app.post("/searchbyrelationship", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.authData.userId);
    const address = await addressModel.find({ _id: { $in: user.addressId } });
    const search = req.body.search;
    const result = address.filter((address) => {
        return address.relationship.toLowerCase().includes(search.toLowerCase());
    });
    res.send(result);

});


function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (typeof token !== "undefined") {
        const bearer = token.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, "secretkey", async (err, authData) => {
            if (err) {
                res.sendStatus(403).send({ message: "Unauthorized" });
            } else {
                req.authData = authData;
                next();
            }
        });
    }
    else {
        return res.status(403).send("Forbidden");
    }
}

module.exports = app;
