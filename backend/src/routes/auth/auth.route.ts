import { Router } from "express";

const router = Router();

router.get("/auth/auhtorize", (req, res) => {
    res.json({ message: "Hello "})
})

export default router;
