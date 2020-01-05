"use strict";

const profile = require('../profile.js');

function foldItem(tmpList, body) {
    for (let item of tmpList.data[0].Inventory.items) {
        if (item._id && item._id === body.item) {
            item.upd.Foldable = {"Folded": body.value};
            profilesDB.update(tmpList);
            return "OK";
        }
    }

    return "";
}

function toggleItem(tmpList, body) {
    for (let item of tmpList.data[0].Inventory.items) {
        if (item._id && item._id === body.item) {
            item.upd.Togglable = {"On": body.value};
            profilesDB.update(tmpList);
            return "OK";
        }
    }

    return "";
}

function tagItem(tmpList, body) {
    for (let item of tmpList.data[0].Inventory.items) {
        if (item._id === body.item) {
            if (item.upd !== null &&
                item.upd !== undefined &&
                item.upd !== "undefined") {
                item.upd.Tag = {"Color": body.TagColor, "Name": body.TagName};
            } else { //if object doesn't have upd create and add it
                let myobject = {
                    "_id": item._id,
                    "_tpl": item._tpl,
                    "parentId": item.parentId,
                    "slotId": item.slotId,
                    "location": item.location,
                    "upd": {"Tag": {"Color": body.TagColor, "Name": body.TagName}}
                };
                Object.assign(item, myobject); // merge myobject into item -- overwrite same properties and add missings
            }

            profilesDB.update(tmpList);
            return "OK";
        }
    }

    return "";
}

function bindItem(tmpList, body) {
    for (let index in tmpList.data[0].Inventory.fastPanel) {
        if (tmpList.data[0].Inventory.fastPanel[index] === body.item) {
            tmpList.data[0].Inventory.fastPanel[index] = "";
        }
    }

    tmpList.data[0].Inventory.fastPanel[body.index] = body.item;
    profilesDB.update(tmpList);
    return "OK";
}

function examineItem(tmpList, body) {
    let returned = "BAD";

    // ragfair
    if (typeof body.fromOwner !== "undefined" && body.fromOwner.type === "RagFair") {
        returned = body.fromOwner.id;
    }

    // trader
    if (typeof body.fromOwner !== "undefined" && body.fromOwner.type === "Trader") {
        let tmpTraderAssort = trader.getAssort(body.fromOwner.id);

        for (let item of tmpTraderAssort.data.items) {
            if (item._id === body.item) {
                console.log("Found trader with examined item: " + item._id, "", "", true);
                returned = item._tpl;
                break;
            }
        }
    }

    // player inventory
    if (returned === "BAD") {
        for (let item of tmpList.data[0].Inventory.items) {
            if (item._id === body.item) {
                console.log("Found equipment examing item: " + item._id, "", "", true);
                returned = item._tpl;
                break;
            }
        }
    }

    // item not found
    if (returned === "BAD") {
        console.log("Cannot find proper item. Stopped.", "white", "red");
        return "BAD";
    }

    // item found
    let data = json.parse(json.read(filepaths.items[returned]));

    tmpList.data[0].Info.Experience += data._props.ExamineExperience;
    tmpList.data[0].Encyclopedia[returned] = true;
    profilesDB.update(tmpList);
    console.log("EXAMINED: " + returned, "white", "green", true);
    return "OK";
}

function readEncyclopedia(tmpList, body) {
    return "OK";
}

module.exports.foldItem = foldItem;
module.exports.toggleItem = toggleItem;
module.exports.tagItem = tagItem;
module.exports.bindItem = bindItem;
module.exports.examineItem = examineItem;
module.exports.readEncyclopedia = readEncyclopedia;