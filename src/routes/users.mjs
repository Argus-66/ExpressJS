import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from '../utils/constants.mjs';

const router = Router();

router.get(
    "/api/users",
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
                mockUsers.filter((user) => user[filter].includes(value)
            )
    );
    return response.send(mockUsers);
    }
);

export default router;