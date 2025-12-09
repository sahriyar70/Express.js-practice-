import { Request, Response, Router } from "express";

import { userController } from "./user.controller";

const route = Router()

route.post('/', userController.createUser

);

route.get('/',userController.getUser);

route.get('/:id',userController.getUserId);

route.put('/:id', userController.putUserId);

route.delete('/:id',userController.deleteUserId)

export  const userRouts = route;