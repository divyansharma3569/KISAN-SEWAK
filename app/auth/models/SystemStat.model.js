const mongoose = require("mongoose");

const SystemStatSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true },
  count: { type: Number, default: 30 } 
});

const SystemStat = mongoose.model("SystemStat", SystemStatSchema);

module.exports = SystemStat;