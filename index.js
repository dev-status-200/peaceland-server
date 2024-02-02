const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const db = require("./models");

const transportRoutes = require('./routes/transport');
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/package');
const bookingRoutes = require('./routes/booking');
const promoRoutes = require('./routes/promo');
const customersRoutes = require('./routes/customers');

app.use(morgan('tiny'));
app.use(cors());

//cron.schedule('0 */5 * * * *', () => console.log("Hello World"));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(express.json());
db.sequelize.sync();

app.get("/", (req, res) => { res.json('Hello World') });
app.use("/auth", authRoutes);
app.use("/product", packageRoutes);
app.use("/transport", transportRoutes);
app.use("/bookings", bookingRoutes);
app.use("/promo", promoRoutes);
app.use("/customer", customersRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => { console.log(`App listenings on port ${PORT}`) });