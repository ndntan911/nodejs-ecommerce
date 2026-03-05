const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductsByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

class CheckoutService {
    static async checkoutReview({
        cartId,
        userId,
        shop_order_ids = []
    }) {
        const foundCart = await findCartById({ cartId })
        if (!foundCart) throw new BadRequestError("Cart not found")

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }
        const shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, item_products = [], shop_discount = [] } = shop_order_ids[i]

            const checkProductServer = await checkProductsByServer(item_products)
            if (!checkProductServer[0]) throw new BadRequestError("Product not found")

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                priceRaw: checkoutPrice,
                shop_discount,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discount.length > 0) {
                const { totalPrice, discount = 0 } = await getDiscountAmount({
                    shopId,
                    code: shop_discount[0].code,
                    userId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids = [],
        userId,
        cartId,
        user_address,
        user_payment,
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock({
                productId,
                quantity,
                cartId,
            })
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        if (acquireProduct.includes(false)) throw new BadRequestError("Product not found")

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        if (newOrder) {

        }

        return newOrder
    }

    static async getOrdersByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {

    }
}

module.exports = CheckoutService