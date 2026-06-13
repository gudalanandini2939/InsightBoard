const Record = require("../models/Record");

const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { title, category, amount, date, note } = req.body;

    if (!title || !category || !amount || !date) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const record = await Record.create({
      title,
      category,
      amount: Number(amount),
      date,
      note,
      user: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await record.deleteOne();

    res.status(200).json({ message: "Record deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};