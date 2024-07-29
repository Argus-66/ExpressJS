import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo"; //npm i connect-mongo
//import "./strategies/local-strategy.mjs";

const app = express();

//npm i mongoose
mongoose
.connect("mongodb://localhost/express_tutorial")
.then (() => console.log("Connected to MongoDB"))
.catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "ayush the dev",
    saveUninitialized: false, //If session is new and unmodified, it is saved to the store, if value is True will save dor every even if not modified(too much storage consumption)
    resave: false, // if true forces cookie to be sent back to the client(cookie to save everytime in database...)
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({                  // connect-mongo options
      client: mongoose.connection.getClient(), //mongoDB client connection
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
    response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
    console.log(`Inside /auth/status enpoint`);
    console.log(request.user);
    console.log(request.session)  // Check session data
    console.log(request.session.id); // Get session ID
    return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
    if (!request.user) return response.sendStatus(401);
    request.logout((err) => {
        if (err) return response.sendStatus(400);
        response.send(200);
    });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on Port ${PORT}");
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send({ msg: "Hello, World!" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "Invalid credentials" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Unauthorized" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.status(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});



// client secret = b_0jNt6W2YDc0L5pIttqhMe-cdW0OmqX
// client id = 1267446858251243620
// redirect_url = http://localhost:3000/api/auth/discord/redirect