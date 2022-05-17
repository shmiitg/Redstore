require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require("events");

const indexRouter = require("./routes/index");
const cartRouter = require("./routes/cart");
const productsRouter = require("./routes/products");
const accountRouter = require("./routes/account");
//customer
const customerOrdersRouter = require("./routes/customer/orders");
const orderRouter = require("./routes/customer/order");
//admin
const adminOrdersRouter = require("./routes/admin/orders");

const app = express();

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Views and Public
app.set("views", __dirname + "/views");
app.use(express.static("public"));

// Connect to MongoDB
require("./config/db");
let url = process.env.MONGO_DB;

// event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// Session config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: MongoStore.create({ mongoUrl: url, collections: "sessions" }),
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

// Flash
app.use(flash());

// Passport config
const passportInit = require("./config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});

// Routes
app.use("/", indexRouter);
app.use("/cart", cartRouter);
app.use("/products", productsRouter);
app.use("/account", accountRouter);
//customer
app.use("/customer/orders", customerOrdersRouter);
app.use("/customer/orders", orderRouter);
//admin
app.use("/admin/orders", adminOrdersRouter);

// Start server
const port = process.env.PORT || 7000;
const server = app.listen(port, () => console.log("Server is running at port 7000"));

const io = require("socket.io")(server);
io.on("connection", (socket) => {
    socket.on("join", (orderId) => {
        socket.join(orderId);
    });
});

eventEmitter.on("orderUpdated", (data) => {
    io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
    io.to("adminRoom").emit("orderPlaced", data);
});
