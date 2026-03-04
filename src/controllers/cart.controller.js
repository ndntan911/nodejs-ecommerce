const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Add to cart successfully",
            metadata: await CartService.addToCart({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart successfully",
            metadata: await CartService.updateCart({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    deleteUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete user cart successfully",
            metadata: await CartService.deleteUserCart({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list user cart successfully",
            metadata: await CartService.getListUserCart({
                ...req.query,
                userId: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new CartController();
