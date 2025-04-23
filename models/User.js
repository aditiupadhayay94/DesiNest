const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

// ✅ Prevent model overwrite error
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
