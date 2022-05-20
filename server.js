const express = require('express');
const app = express();

require('dotenv').config();

app.use("/", express.static(__dirname + "/views"));
app.use("/api", require('./routes/api.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})