const { product } = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      { $text: { $search: regexSearch }, isPublish: true },
      {
        score: { $meta: "textScore" },
      },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect = [] }) => {
  return await product.findById(product_id).select(getUnSelectData(unSelect));
};

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  });
};

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const getProductById = async ({ product_id }) => {
  return await product.findById(product_id).lean();
};

const checkProductsByServer = async (products) => {
  return await Promise.all(products.map(async (product) => {
    const foundProduct = await getProductById({ product_id: product.product_id })
    if (!foundProduct) return null
    return {
      price: foundProduct.product_price,
      quantity: product.quantity,
      product_id: foundProduct._id,
    }
  }))
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  checkProductsByServer,
  getProductById
};
