import express from "express";
// import {ChannelRouter} from "./channels";
// import {UserRouter} from "./users";

const router = express.Router();

router.use("/users", require("./users"));

router.use("/channels", require("./channels"));

// router.use("*", (req, res) => {
//     res.send("/api/v1/");
// });

module.exports = router;
