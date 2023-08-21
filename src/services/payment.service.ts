export class PaymentsService {
  static async getClientID() {
    return process.env.CLIENT_ID;
  }
}
