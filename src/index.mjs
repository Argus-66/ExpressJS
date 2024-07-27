import express from 'express';
import { 
    query, 
    validationResult,
    body, 
    matchedData, 
    checkSchema, 
} from "express-validator";
import { createUserValidationSchema } from './utils/validationSchemas.mjs';
import usersRouter from './routes/users.mjs';
import { mockUsers } from './utils/constants.mjs';


const app = express();

app.use(express.json())
app.use(usersRouter);

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

const resolveIndexByUserId = (request, response, next) => {
    const {
        params:{id},
    } = request;   
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(!findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
}


const PORT = process.env.PORT || 3000;



app.get("/", (request, response) => {
    response.status(201).send({msg: "Hello, World!"});
});




app.post("/api/users", 
    checkSchema(createUserValidationSchema), 
    (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if(!result.isEmpty())
        return response.status(400).send({ errors: result.array()});
    const data = matchedData(request); 
    const newUser = {id: mockUsers[mockUsers.length-1].id + 1, ...data};
    mockUsers.push(newUser);
    return response.send(newUser);
});

app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const {findUserIndex} = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.get('/api/products', (request, response) => {
    response.send([
        { id: 1, name: "Laptop", price: 1000 },
        { id: 2, name: "Mobile", price: 500 },
        { id: 3, name: "Headphones", price: 200 }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// localhost:3000
// localhost:3000/api/users
// localhost:3000/products?key=values&key2=value2


//PUT --------------------------------------------

app.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body,findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body};
    return response.sendStatus(200);
});


//PATCH --------------------------------------------

app.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;   
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return response.sendStatus(200);

});


//DELETE --------------------------------------------

app.delete('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);

});