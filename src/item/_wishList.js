"use strict";

require('../libs.js');

/* Adding item to wishlist
*  input: playerProfileData, Request body
*  output: OK (saved profile)
* */
function addToWishList(tmpList, body) {
    for (let item in tmpList.data[0]['Wishlist']) {
        // don't add the item
        if (tmpList.data[0].WishList[item] === body['templateId']) {
            return "OK";
        }
    }
    // add the item to the wishlist
    tmpList.data[0].WishList.push(body['templateId']);
    profilesDB.update(tmpList);
    return "OK";
}

/* Removing item to wishlist
*  input: playerProfileData, Request body
*  output: OK (saved profile)
* */
function removeFromWishList(tmpList, body) {
    for (let item in tmpList.data[0]['Wishlist']) {
        if (tmpList.data[0].WishList[item] === body['templateId']) {
            tmpList.data[0].WishList.splice(item, 1);
        }
    }
    profilesDB.update(tmpList);
    return "OK";
}

/* Reset wishlist to empty []
*  input: playerProfileData
*  output: none
* */
function resetWishList(tmpList){
    tmpList.data[0].WishList = [];
    profilesDB.update(tmpList);
}

module.exports.addToWishList = addToWishList;
module.exports.removeFromWishList = removeFromWishList;
module.exports.resetWishList = resetWishList;