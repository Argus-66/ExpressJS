import{ Router } from 'express';

const router = Router();

router.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "Laptop", price: 1000 }]); 
});

export default router;