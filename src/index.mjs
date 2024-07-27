import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Running on Port ${PORT}');
});

app.get("/", (request, response) => {
    response.cookie("hello","world", { maxAge: 60000 * 60 * 2 });
    response.status(201).send({msg: "Hello, World!"});
});
