import Item from "../models/item.model.js";

export const createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, user: req.user.id });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {
      user: req.user.id,
    };

    let query = Item.find(filter);

    const sortOrder = order === "asc" ? 1 : -1;
    query = query.sort({ [sortBy]: sortOrder });

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    const items = await query;

    const totalItems = await Item.countDocuments(filter);

    res.status(200).json({
      message: "Items fetched successfully",
      data: items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.status(200).json({ msg: "Item successfully deleted" });
  } catch (error) {
    next(error);
  }
};