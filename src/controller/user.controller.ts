// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Security,
  Request,
  Path,
  Tags,
} from "tsoa";
import { UsersService } from "../services";
import { ICreateUser, ISignJWT } from "../dto/requests/user.dto";
import * as jwt from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../types/express";

@Tags("Users")
@Route("users")
export class UsersController extends Controller {
  @Post()
  public async createUser(@Body() dto: ICreateUser) {
    return UsersService.create(dto);
  }

  @Post("/sign-jwt-token")
  public signJwtToken(@Body() dto: ISignJWT) {
    return jwt.sign(
      { userId: dto.userId, role: [dto.role] },
      process.env.JWT_SECRET || ""
    );
  }

  @Security("jwt", ["user"])
  @Get()
  public getUser(@Request() request: IGetUserAuthInfoRequest) {
    return UsersService.getUser(request.user.userId);
  }

  @Get("/{userId}")
  public findUserById(@Path() userId: string) {
    return UsersService.findUserById(userId);
  }
}
