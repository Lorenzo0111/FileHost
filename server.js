const express = require('express');
const {connect} = require('mongoose');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use("/", express.static(__dirname + "/views"));
app.use("/api", require('./routes/api.js'));

connect(process.env.MONGO, () => {
    console.log("Connected to MongoDB");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})