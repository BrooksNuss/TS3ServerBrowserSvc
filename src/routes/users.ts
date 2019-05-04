import express from "express";
import { ts3 } from "../app";

const userRouter = express.Router();

/**
 * Return list of users
 */
userRouter.get("/list", (req, res) => {
    // client_type of 0 means standard user, not query user.
    ts3.clientList({client_type: 0}).then((clientList) => {
        res.send(clientList);
    });
});

module.exports = userRouter;
