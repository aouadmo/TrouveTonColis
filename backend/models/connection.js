const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database bien connecté !'))
    .catch(error => console.error(error));