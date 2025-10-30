const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donorRoutes = require('./routes/donorRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/donors', donorRoutes);

mongoose.connect('mongodb://localhost:27017/donationDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server running on port 5000'));
