const User = require("../models/User.model");
const createHttpError = require("http-errors");
const ipInfo = require("ip-info-finder");
const bcrypt = require("bcrypt");

const http = require("http");
const SystemStat = require("../models/SystemStat.model");
const { signJWT } = require("../helpers/jwtSign.helper");
const { verifyJWT } = require("../helpers/jwtVerify.helper");
const { redisClient } = require("../configs/redis.config");
const {
  registerSchema,
  loginSchema,
} = require("../validations/Auth.validation");

const maxAge = process.env.EXPIRATION_TIME || 2617920000;

//cookie options
const cookieOptions = {
  httpOnly: true,
  maxAge: maxAge,
  signed: true,
};

const register = async (req, res, next) => {
  try {
    let result = await registerSchema.validateAsync(req.body);

    // 1. Dynamically build the $or array to ignore empty/undefined fields
    const searchConditions = [];
    if (result.username) searchConditions.push({ username: result.username });
    if (result.phone) searchConditions.push({ phone: result.phone });

    // 2. Only query if there is something to search for
    if (searchConditions.length > 0) {
      const existingUser = await User.findOne({ $or: searchConditions });

      if (existingUser) {
        if (existingUser.username === result.username)
          throw createHttpError.Conflict(`${result.username} has already been registered`);

        if (existingUser.phone === result.phone)
          throw createHttpError.Conflict(`${result.phone} has already been registered`);
      }
    }

    const salt = await bcrypt.genSalt(10);
    result["password"] = await bcrypt.hash(result.password, salt);

    const avatar = `https://ui-avatars.com/api/?background=random&name=${result.firstName}%20${result.lastName}&size=128&format=svg`;

    const user = new User({...result, avatar});
    let savedUser = await user.save();

    const accessToken = await signJWT({ userId: savedUser._id });

    await redisClient.set(savedUser._id.toString(), accessToken, { EX: maxAge / 10 }); // value is in seconds be careful!!

    // removing secret data
    savedUser = savedUser.toObject();
    delete savedUser.password;
    delete savedUser._id;

    // Increment Total Visitors
    await SystemStat.findOneAndUpdate(
      { identifier: "total_visitors" },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(201)
      .json({
        message: "Registered successfully",
        user: savedUser,
      });
  } catch (err) {
    if (err.isJoi === true) {
      console.log(err);
      return next(createHttpError.UnprocessableEntity("Invalid Credentials"));
    }

    // mongoDB duplicate error
    if (err.code === 11000) {
      return next(createHttpError.Conflict(err.name));
    }
    console.log(err);

    next(err);
  }
};

const viewAccount = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);

    let user = await User.findById(decoded.userId);

    if (!user) createHttpError.NotFound("User not registered");

    // removing secret data
    user = user.toObject();
    delete user.password;
    delete user._id;

    res.status(200).json({ user });
  } catch (err) {
    next(createHttpError.Unauthorized());
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    let user = await User.findOne({ username: result.username });

    if (!user) throw createHttpError.NotFound("User not registerd");
    const isMatch = await bcrypt.compare(result.password, user.password);
    if (!isMatch)
      throw createHttpError.Unauthorized("Username/Password not valid");

    const accessToken = await signJWT({ userId: user._id });

    await redisClient.set(user._id.toString(), accessToken, { EX: maxAge / 10 }); // value is in seconds be careful!!

    // removing secret data
    user = user.toObject();
    delete user.password;
    delete user._id;

    // Increment Total Visitors
    await SystemStat.findOneAndUpdate(
      { identifier: "total_visitors" },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({
        message: "Login successfully",
        user,
      });
  } catch (err) {
    if (err.isJoi === true)
      return next(
        createHttpError.UnprocessableEntity("Invalid Username/Password")
      );

    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);
    await redisClient.del(decoded.userId);
    res
      .cookie("accessToken", "", { maxAge: 0 })
      .status(200)
      .json({ message: "Logged out Successfully" });
  } catch (err) {
    next(err);
  }
};

const authorization = async (req, res, next) => {
  try {
    const decoded = await verifyJWT(req.signedCookies.accessToken);

    if (!decoded?.userId) throw createHttpError.Unauthorized();

    // Dynamically fetch the REAL public IP location using a free API (Works locally and in production)
    const getRealLocation = () => {
      return new Promise((resolve) => {
        http.get("http://ip-api.com/json/", (resp) => {
          let data = "";
          resp.on("data", (chunk) => { data += chunk; });
          resp.on("end", () => {
            try { resolve(JSON.parse(data)); } 
            catch (e) { resolve({ status: "fail" }); }
          });
        }).on("error", () => resolve({ status: "fail" }));
      });
    };

    let ipData = await getRealLocation();

    // If the API fails, fallback to Rajasthan (RJ) instead of MH!
    if (ipData.status !== "success") {
      ipData = {
        city: "Jaipur",
        district: "Jaipur",
        region: "RJ", // Rajasthan
        lat: 26.9124,
        lon: 75.7873,
      };
    }

    // Set the headers. Nginx reads these and passes them to the Deep Learning Python code!
    res.setHeader("uid", decoded.userId);
    res.setHeader("ip", req.ip || "127.0.0.1");
    res.setHeader("city", (ipData.city || "Jaipur").toLowerCase());
    res.setHeader("district", (ipData.district || ipData.city || "Jaipur").toLowerCase());
    res.setHeader("state", ipData.region || "RJ");
    res.setHeader("lat", ipData.lat || 26.9124);
    res.setHeader("lon", ipData.lon || 75.7873);

    res.status(200).json({
      authorize: true,
      uid: decoded.userId,
    });
  } catch (err) {
    console.log({ err });
    next(createHttpError.Unauthorized());
  }
};

module.exports = {
  register,
  viewAccount,
  login,
  logout,
  authorization,
};
