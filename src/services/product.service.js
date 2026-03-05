const { product, clothing, electronics } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { removeUndefined, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

// define Factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classProduct) {
    this.productRegistry[type] = classProduct;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).createProduct();
  }

  static async updateProduct({ product_id, payload }) {
    const productClass = this.productRegistry[payload.product_type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).updateProduct(product_id);
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_shop",
      ],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    ((this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes));
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock to inventory
      const invenData = await insertInventory({
        productId: newProduct._id,
        stock: this.product_quantity,
        shopId: this.product_shop,
      });

      pushNotiToSystem({
        type: 'SHOP-001',
        senderId: this.product_shop,
        receivedId: 1,
        options: {
          product_name: this.product_name,
          product_shop: this.product_shop,
        }
      }).then(console.log).catch(console.error)
    }
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({
      product_id,
      payload,
      model: product,
    });
  }
}

// define clothing class
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Failed to create clothing");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefined(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: objectParams.product_attributes,
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams),
    );
    if (!updateProduct) throw new BadRequestError("Failed to update product");
    return updateProduct;
  }
}

// define electronics class
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics)
      throw new BadRequestError("Failed to create electronics");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefined(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: objectParams.product_attributes,
        model: electronics,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams),
    );
    if (!updateProduct) throw new BadRequestError("Failed to update product");
    return updateProduct;
  }
}

ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
