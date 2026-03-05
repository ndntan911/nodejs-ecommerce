const { getUnSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  filter,
  limit = 50,
  page = 1,
  sort = "ctime",
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  const discounts = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
  return discounts;
};

const findAllDiscountCodesSelect = async ({
  filter,
  limit = 50,
  page = 1,
  sort = "ctime",
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  const discounts = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return discounts;
};

const checkDiscountExists = async ({ filter, model }) => {
  const foundDiscount = await model.findOne(filter).lean();

  return foundDiscount;
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
