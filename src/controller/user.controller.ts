// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Route,
  Security,
  Request,
  Tags,
  Query,
  Path,
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
  @Get("/get-user")
  public findUserById(@Request() request: IGetUserAuthInfoRequest) {
    return UsersService.getUser(request.user.userId);
  }

  @Security("jwt", ["admin"])
  @Get("/find-user-by-phone")
  public getUserByPhone(@Query() phone: string) {
    return UsersService.findUserByPhone(phone);
  }

  @Security("jwt", ["admin"])
  @Put("/{id}")
  public activeUser(@Path() id: string) {
    return UsersService.activeUser(id);
  }

  @Security("jwt", ["admin"])
  @Get("/get-all-user")
  public getAllUser() {
    return UsersService.getAllUser();
  }
}
