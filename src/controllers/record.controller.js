import Record from "../models/record.model.js";
import User from "../models/user.model.js";

export const createRecord = async (req, res) => {
  try {
    const data = req.body;

    if (!data.user) {
  return res.status(400).json({ message: "User is required" });
}

    // If multiple records
    if (Array.isArray(data)) {
      const records = data.map(item => ({
        ...item,
        createdBy: req.user._id  // 👈 admin who created
      }));

      const createdRecords = await Record.insertMany(records);
      return res.status(201).json(createdRecords);
    }

    // Single record
    const record = await Record.create({
      ...data,
      createdBy: req.user._id   // 👈 admin
    });

    res.status(201).json(record);

  } catch (err) {
    res.status(500).json({ message: "Error creating record" });
  }
};

export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search} = req.query;

     let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;

    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit; 

    let filter = {};

    // 🔥 ROLE LOGIC
    if (req.user.role === "viewer") {
      filter.user = req.user._id;
    }
    // analyst/admin → no restriction

    // filters
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // 🔍 SEARCH
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("createdBy", "name email");


    const total = await Record.countDocuments(filter);

    // response
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
      data: records,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching records" });
  }
};


export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error updating record" });
  }
};


export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id,);

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json({
      message: "Record deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting record",
    });
  }
};
