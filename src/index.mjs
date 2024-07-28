import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

app.use(express.json())
app.use(cookieParser("helloworld"));
app.use(
    session({
        secret: "ayush the dev",
        saveUninitialized: false,
        resave: false,
        cookie: { 
            maxAge: 60000 * 60,
        }
    })
);
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Running on Port ${PORT}');
});

app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id); //or .sessionID
    response.cookie("hello","world", { maxAge: 30000, signed: true });
    response.status(201).send({msg: "Hello, World!"});
});
