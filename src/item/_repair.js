"use strict";

require('../libs.js');

function main(tmpList, body) {
    item.resetOutput();

    let output = item.getOutput();
    const sessionID = tmpList.data[0].aid.replace(/[^0-9]/g, '') - 0;
    let tmpTraderInfo = trader.get(body.tid, sessionID);
    let repairRate = (tmpTraderInfo.data.repair.price_rate === 0) ? 1 : (tmpTraderInfo.data.repair.price_rate / 100 + 1);
    let RequestData = body.repairItems;

    for (let repairItem of RequestData) {
        const itemToRepair = tmpList.data[0].Inventory.items.find(item => repairItem._id === item._id);

        if (itemToRepair === undefined) {
            continue;
        }

        let itemRepairCost = items.data[itemToRepair._tpl]._props.RepairCost;

        itemRepairCost = Math.floor(itemRepairCost * repairItem.count * repairRate);

        // pay the item	to profile
        if (!itm_hf.payMoney(tmpList,
            {
                scheme_items: [{
                    id: repairItem._id,
                    count: Math.round(itemRepairCost * settings.gameplay.trading.repairMultiplier)
                }],
                tid: body.tid
            }
        )) {
            console.log("no money found");
            return "";
        }

        // change item durability
        let calculateDurability = itemToRepair.upd.Repairable.Durability + repairItem.count;

        if (itemToRepair.upd.Repairable.MaxDurability <= calculateDurability) {
            calculateDurability = itemToRepair.upd.Repairable.MaxDurability;
        }

        itemToRepair.upd.Repairable.Durability = calculateDurability;
        itemToRepair.upd.Repairable.MaxDurability = calculateDurability;
        output.data.items.change.push(itemToRepair);
    }

    profilesDB.update(tmpList);
    return output;
}

module.exports.main = main;
