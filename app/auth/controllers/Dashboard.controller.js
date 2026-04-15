const createHttpError = require("http-errors");
const Dashboard = require("../models/Dashboard.model");
const Disease = require("../models/Disease.model");
const Plant = require("../models/Plant.model");
const SystemStat = require("../models/SystemStat.model"); // MUST be imported!

const getDashboardData = async (req, res, next) => {
  try {
    const mapData = Dashboard.aggregate([
      { $group: { _id: "$state", numberOfValue: { $sum: 1 } } },
    ]);

    const dashboardPlantData = Dashboard.aggregate([
      { $group: { _id: "$plantId", numberOfValue: { $sum: 1 } } },
      { $sort: { numberOfValue: -1 } },
      { $limit: 10 }
    ]);

    const dashboardDiseaseData = Dashboard.aggregate([
      { $group: { _id: "$diseaseId", numberOfValue: { $sum: 1 } } },
      { $sort: { numberOfValue: -1 } },
      { $limit: 10 }
    ]);

    const populateData = await Promise.all([dashboardPlantData, dashboardDiseaseData]);
    const plantData = await Plant.populate(populateData[0], { path: "_id", select: "commonName" });
    const diseaseData = await Disease.populate(populateData[1], { path: "_id", select: "name" });

    // ==========================================
    // NEW: Real Daily Activity (Last 14 Days)
    // ==========================================
    const now = new Date();
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivityPromise = Dashboard.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

    // ==========================================
    // NEW: Real Monthly Trends (Current Year)
    // ==========================================
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const monthlyTrendsPromise = Dashboard.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
    ]);

    // Run all database queries at once
    const result = await Promise.all([mapData, plantData, diseaseData, dailyActivityPromise, monthlyTrendsPromise]);

    let startOfShift = new Date(now);
    startOfShift.setHours(3, 0, 0, 0);
    if (now.getHours() < 3) startOfShift.setDate(startOfShift.getDate() - 1);
    const todaysDetections = await Dashboard.countDocuments({ createdAt: { $gte: startOfShift } });

    const visitorStat = await SystemStat.findOne({ identifier: "total_visitors" });
    const totalVisitors = visitorStat ? visitorStat.count + 30 : 30;

    const totalPredictions = plantData.reduce((sum, item) => sum + item.numberOfValue, 0);
    const topPlant = plantData.length > 0 && plantData[0]._id ? plantData[0]._id.commonName : "None";

    res.status(200).json({
      totalPredictions,
      topPlant,
      totalVisitors,
      todaysDetections,
      mapData: result[0],
      plantData: plantData.reduce(
        (acc, item) => ({ legends: [...acc.legends, item._id ? item._id.commonName : "Unknown"], data: [...acc.data, item.numberOfValue] }),
        { legends: [], data: [] }
      ),
      diseaseData: diseaseData.reduce(
        (acc, item) => ({ legends: [...acc.legends, item._id ? item._id.name : "Unknown"], data: [...acc.data, item.numberOfValue] }),
        { legends: [], data: [] }
      ),
      // ✅ FIX: Change result[1] to result[3] and result[2] to result[4]
      dailyActivity: result[3],
      monthlyTrends: result[4]
    });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

const getTotalRequest = async (req, res, next) => {
  try {
    const result = await Dashboard.aggregate([
      { $group: { _id: null, totalRequest: { $sum: 1 } } },
    ]);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardData, getTotalRequest };