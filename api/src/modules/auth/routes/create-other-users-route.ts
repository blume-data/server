import {Router} from "express";
import { checkAuth } from "../../../services/checkAuth";
import { CreateUpdateOtherUser } from "../Controllers/OtherUserController";
import {CreateOtherUsers} from "../util/urls";

const router = Router();

router.post(CreateOtherUsers, checkAuth, CreateUpdateOtherUser);

export {router as createOtherUsersRouter};