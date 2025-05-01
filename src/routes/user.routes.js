import {getUsers,createUser,getUser,deleteUser,updateUser} from "../controllers/user.controller.js"
import {Router} from 'express';

const router= Router();
router.post("/",createUser);
router.get("/all",getUsers);
router.get("/get/",getUser);
router.patch("/",updateUser);
router.delete("/del/",deleteUser);
export default router;