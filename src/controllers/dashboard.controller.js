import Record from "../models/record.model.js";

export const getSummary = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "viewer") {
      filter.user = req.user._id;
    }

    const allowedTypes = ["income", "expense"];

    if (req.query.type && allowedTypes.includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const records = await Record.find(filter);

    let income = 0;
    let expense = 0;

    records.forEach(r => {
      if (r.type === "income") income += r.amount;
      else expense += r.amount;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching summary" });
  }
};

export const getCategoryWise = async (req, res) => {
  try {
    let filter = {};

    // 👀 Viewer restriction
    if (req.user.role === "viewer") {
      filter.user = req.user._id;
    }

    const records = await Record.find(filter);

    const result = {};

    records.forEach(r => {
      if (!result[r.category]) {
        result[r.category] = 0;
      }
      result[r.category] += r.amount;
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Error fetching category data" });
  }
};

export const getMonthly = async (req, res) => {
  try {
    let filter = {};

    // 👀 Viewer restriction
    if (req.user.role === "viewer") {
      filter.user = req.user._id;
    }

    const records = await Record.find(filter);

    const result = {};

    records.forEach(r => {
      const month = new Date(r.date).toISOString().slice(0, 7);

      if (!result[month]) {
        result[month] = 0;
      }

      result[month] += r.type === "income" ? r.amount : -r.amount;
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly data" });
  }
};