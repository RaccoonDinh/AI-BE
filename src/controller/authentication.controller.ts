import { Body, Controller, Post, Route, Tags } from "tsoa";
import { AuthenticationService } from "../services/authentication.service";
import { ICreateUser, IEmailVerify, ILoginUser } from "../dto/requests";
import { UsersService } from "../services";

@Tags("login")
@Route("authenticate")
export class AuthenticationController extends Controller {
  @Post("/login")
  public async loginUser(@Body() dto: ILoginUser) {
    return AuthenticationService.login(dto);
  }
  @Post("/send-code-email")
  public async sendVerifyCode(@Body() dto: IEmailVerify) {
    return AuthenticationService.sendVerifyCode(dto);
  }
  @Post("/register")
  public async createUser(@Body() dto: ICreateUser) {
    return UsersService.create(dto);
  }
}
