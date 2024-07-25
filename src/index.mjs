import express from 'express';
import { query, validationResult, body, matchedData } from "express-validator";


const app = express();

app.use(express.json())

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

const mockUsers= [
    { id: 1, username: "ayush", displayName: "Ayush" },
    { id: 2, username: "subham", displayName: "Subham" },
    { id: 3, username: "kishore", displayName: "Kishore" },
    { id: 4, username: "ramesh", displayName: "Ramesh"  },
    { id: 5, username: "rahul", displayName: "Rahul" },
    { id: 6, username: "suma", displayName: "Suma" },
    { id: 7, username: "prakash", displayName: "Prakash" },
    { id: 8, username: "anil", displayName: "Anil" },
    { id: 9, username: "suresh", displayName: "Suresh" },
    { id: 10, username: "mukesh", displayName: "Mukesh" }
];

app.get(
    "/", (request, response) => {
    response.status(201).send({msg: "Hello, World!"});
});

app.get('/api/users',
    query('filter')
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid filter, must be between 3-10 characters"),
    (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const {
        query : {filter, value},
    } = request;
    //When filter and values are not provided, return all users
    if(!filter &&!value) return response.send(mockUsers);
    console.log(value);
    if(filter && value) 
        return response.send(
            mockUsers.filter((user) => user[filter].includes(value))
    );
    return response.status(201).send(mockUsers);
});


app.post(
    "/api/users",
    [ 
        body('username')
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3, max: 32 })
            .withMessage("Username must be between 5-32 characters")
            .isString()
            .withMessage("Username must be a string"),
        body("displayName").notEmpty(),
    ],
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