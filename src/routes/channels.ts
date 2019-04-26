import express from "express";
import { ts3 } from "../app";

const channelRouter = express.Router();

/**
 * Return list of channels
 */
channelRouter.get("/list", (req, res) => {
    ts3.channelList({}).then((channelList) => {
        res.send(channelList);
    });
});

// channelRouter.use("/", (req, res) => {
//     res.send("/channels");
// });

module.exports = channelRouter;
