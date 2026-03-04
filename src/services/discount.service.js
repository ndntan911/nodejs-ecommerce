const discountModel = require("../models/discount.model");
const BadRequestError = require("../core/error.response");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      startDate,
      endDate,
      isActive,
      shopId,
      minOrderValue,
      productIds,
      appliesTo,
      name,
      description,
      type,
      value,
      maxValue,
      maxUses,
      usesCount,
      maxUsesPerUser,
      usersUsed,
    } = payload;

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("Invalid date");
    }

    const foundDiscount = await discountModel
      .findOne({ discount_code: code, discount_shopId: shopId })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_min_order_value: minOrderValue || 0,
      discount_max_value: maxValue,
      discount_start_date: new Date(startDate),
      discount_end_date: new Date(endDate),
      discount_max_usage: maxUses,
      discount_uses_count: usesCount,
      discount_users_used: usersUsed,
      discount_shopId: shopId,
      discount_max_uses_per_user: maxUsesPerUser,
      discount_is_active: isActive,
      discount_applies_to: appliesTo,
      discount_product_ids: appliesTo === "all" ? [] : productIds,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({ discount_code: code, discount_shopId: shopId })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products = [];
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: { product_shop: shopId, isPublish: true },
        limit,
        page,
        sort: "ctime",
        select: "product_name",
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublish: true,
          _id: { $in: discount_product_ids },
        },
        limit,
        page,
        sort: "ctime",
        select: "product_name",
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit,
      page,
      filter: { discount_shopId: shopId, discount_is_active: true },
      unSelect: ["__v"],
      model: discountModel,
    });
    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: code, discount_shopId: shopId },
      model: discountModel,
    });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code not found");
    }

    if (
      new Date() < foundDiscount.discount_start_date ||
      new Date() > foundDiscount.discount_end_date
    ) {
      throw new BadRequestError("Discount code not found");
    }

    let totalOrder = 0;
    if (foundDiscount.discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0,
      );

      if (totalOrder < foundDiscount.discount_min_order_value) {
        throw new BadRequestError("Discount code not found");
      }
    }

    if (foundDiscount.discount_max_uses_per_user > 0) {
      const userUsed = foundDiscount.discount_users_used.find(
        (user) => user === userId,
      );
    }

    const amount =
      foundDiscount.discount_type === "fixed_amount"
        ? foundDiscount.discount_value
        : (totalOrder * foundDiscount.discount_value) / 100;

    return {
      amount,
      totalOrder,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, code }) {
    const deletedDiscount = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: shopId,
    });
    return deletedDiscount;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: { discount_code: code, discount_shopId: shopId },
    });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code not found");
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: userId },
      $inc: { discount_uses_count: -1 },
    });
    return result;
  }
}

module.exports = DiscountService;
