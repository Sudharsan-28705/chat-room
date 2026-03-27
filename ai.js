const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyADv17Fg2ED9jD4fWYfQJ7HpgiSojPFl3Q");

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

module.exports = model;
