const express = require("express");
const userModel = require("./models");
const jwt = require('jsonwebtoken');
const app = express();

app.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "sucess...",
        authData:authData.userId
      });
    }
  });
});

app.post("/signup", async (request, response) => {
  const user = new userModel(request.body);
  try {
    const available = await userModel.find({ name: request.body.name, age: request.body.age });
    try {
      if (available.length === 1) {
        return response.status(403).send("User exists");
      }
      await user.save();
      response.send("User created");
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

function verifyToken(req, res, next) {
  // Tokens are generally passed in header of request
  // Due to security reasons.

  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else {
    return res.status(403).send("Forbidden");
  }
}

module.exports = app;