const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  stock,
  shopId,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_shopId: shopId,
    inven_location: location,
  });
};

const reservationInventory = async ({
  productId,
  quantity,
  cartId,
}) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  }
  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        cartId,
        quantity,
        createOn: new Date(),
      }
    }
  }
  const options = {
    new: true,
    upsert: true,
  }

  return await inventoryModel.updateOne(query, updateSet)
}

module.exports = {
  insertInventory,
  reservationInventory,
};
