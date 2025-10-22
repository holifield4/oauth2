import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import { AuthUser } from "../../types/auth.types";

const router = Router();

router.get(
  "/hello",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser;
    res.json({ message: `Hello ${user.name}!` });
  },
);

export default router;
