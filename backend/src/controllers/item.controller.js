// backend/src/controllers/item.controller.js
import Item from "../models/item.model.js";

// Controller to create a new item (no changes)
export const createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, user: req.user.id });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// REVISED Controller to get all items with pagination, sorting, and filtering
export const getItems = async (req, res, next) => {
  try {
    // 1. GET QUERY PARAMETERS
    // Destructure options from the request query, providing default values.
    // Example URL: /api/items?page=2&limit=5&sortBy=title&order=asc
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // 2. SETUP THE BASE FILTER
    // The essential filter is to get items only for the logged-in user.
    const filter = {
      user: req.user.id,
    };

    // 3. CREATE THE QUERY BUILDER
    // We create the query but DON'T execute it yet (no 'await').
    // This allows us to chain more methods for sorting and pagination.
    let query = Item.find(filter);

    // 4. ADD DYNAMIC SORTING
    // Apply the sort options to the query.
    // The `[sortBy]` syntax allows us to use the variable's value as the key.
    const sortOrder = order === "asc" ? 1 : -1;
    query = query.sort({ [sortBy]: sortOrder });

    // 5. ADD PAGINATION
    // Calculate how many documents to skip and apply the limit.
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    // 6. EXECUTE THE QUERY AND GET TOTAL COUNT
    // Now that the query is fully built, we execute it.
    const items = await query;

    // To provide useful pagination info, we also count the total matching documents.
    const totalItems = await Item.countDocuments(filter);

    // 7. SEND THE RESPONSE
    // Respond with the fetched data and pagination metadata.
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

// Controller to get a single item by its ID (no changes)
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

// Controller to update an existing item (no changes)
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

// Controller to delete an item (no changes)
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
