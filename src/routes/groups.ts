import express from "express";
import { ts3 } from "../app";

const groupRouter = express.Router();
const serverRouter = express.Router();
const channelRouter = express.Router();

groupRouter.use("/server", serverRouter);
groupRouter.use("/channel", channelRouter);

/**
 * Return all server group icons
 */
serverRouter.get("/icons/list", (req, res) => {
    let iconList: Buffer[] = [];
    let promiseList: Promise<Buffer>[] = [];
    let responseList: {data: Buffer, groupId: number}[] = [];
    ts3.serverGroupList({type: "1"}).then((serverGroupList) => {
        serverGroupList = serverGroupList.filter(group => (group as any).iconid != "0");
        serverGroupList.forEach(group => {
            let promise = group.getIcon();
            promiseList.push(promise);
            promise.then(icon => {
                responseList.push({data: icon, groupId: group.getSGID()});
            });
        });
        Promise.all(promiseList).then(icons => {
            res.send(responseList);
        });
    });
})

/**
 * Return all server groups with icons included
 */
serverRouter.get("/list", (req, res) => {
    let promiseList: Promise<Buffer>[] = [];
    let responseList: {icon: Buffer | null, group: TeamSpeakServerGroup}[] = [];
    ts3.serverGroupList({type: "1"}).then((serverGroupList) => {
        let serverGroupListIcons = serverGroupList.filter(group => (group as any).iconid != "0");
        let serverGroupListNoIcons = serverGroupList.filter(group => (group as any).iconid == "0");
        serverGroupListIcons.forEach(group => {
            let promise = group.getIcon();
            promiseList.push(promise);
            promise.then(icon => {
                // convert icon buffer to base64 string
                responseList.push({group: group, icon: icon.toString('base64') as any});
            });
        });
        serverGroupListNoIcons.forEach(group => {
            responseList.push({group: group, icon: null});
        })
        Promise.all(promiseList).then(icons => {
            setTimeout(() => {
                res.send(responseList);
            }, 0);
        });
    });
})

/**
 * Return icon of servergroup
 */
serverRouter.get("/icons/:groupId", (req, res) => {
    ts3.getServerGroupByID(req.params.groupId).then((serverGroup) => {
        serverGroup.getIcon().then(icon => {
            res.send(icon);
        })
    });
});

serverRouter.get("/", (req, res) => {
    res.json("/groups/server");
})

/**
 * Return icon of channelgroup
 */
channelRouter.get("/icons/:groupId", (req, res) => {
    ts3.getChannelGroupByID(req.params.groupId).then((channelGroup) => {
        channelGroup.getIcon().then(icon => {
            res.send(icon);
        })
    });
});

channelRouter.get("/", (req, res) => {
    res.json("/groups/channel");
})

groupRouter.get("/", (req, res) => {
    res.json("/groups");
})

module.exports = groupRouter;
