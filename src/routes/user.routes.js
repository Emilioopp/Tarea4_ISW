import {getUsers,createUser,getUser} from "../controllers/user.controller.js"
import {Router} from 'express';

const router= Router();
router.post("/",createUser);
router.get("/all",getUsers);
router.get("/:id",getUser);
export default router;