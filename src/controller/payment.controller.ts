import * as jwt from "jsonwebtoken";
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
import { PaymentsService } from "../services/payment.service";

@Tags("Payments")
@Route("payments")
export class PaymentsController extends Controller {
  @Security("jwt", ["user"])
  @Get("/get-client-id")
  public getClientID() {
    return PaymentsService.getClientID();
  }
}
