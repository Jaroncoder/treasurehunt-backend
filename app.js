const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL)
    .then(console.log('connected!'))
    .catch(err => console.error(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const indexRouter = require('./routes/index');

app.use('/api', indexRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    const error = req.app.get('env') === 'development' ? err: {};
    const status = err.status || 500;
    res.status(status).json({
        status,
        message: err.message,
        error,
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));
