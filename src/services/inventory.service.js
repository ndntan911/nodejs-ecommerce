const { getProductById } = require("../models/repositories/product.repo")
const { BadRequestError } = require("../core/error.response")

class InventoryService {
    static async addStockToInventory({
        productId,
        stock,
        shopId,
        location = "unknown",
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError("Product not found")

        const query = { inven_shopId: shopId, inven_productId: productId }
        const updateSet = { $inc: { inven_stock: stock }, $set: { inven_location: location } }
        const options = { upsert: true, new: true }
        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService