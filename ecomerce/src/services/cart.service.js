const cartModel = require("../models/cart.model");

class CartService {
    static async createUserCart({ userId, product }) {
        const query = {
            cart_userId: userId,
            cart_state: "active"
        }
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }
        const options = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product

        const query = {
            cart_userId: userId,
            cart_state: "active",
            'cart_products.product_id': productId
        }
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }
        const options = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ cart_userId: userId })
        if (!userCart) {
            return await this.createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return await this.updateUserCartQuantity({ userId, product })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: "active",
        }
        const updateSet = {
            $pull: {
                cart_products: { productId }
            }
        }

        const deleteCart = await cartModel.updateOne(query, updateSet)

        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cartModel.findOne({ cart_userId: userId }).lean()
    }
}

module.exports = CartService
