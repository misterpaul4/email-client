import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailOptions, Transporter, createTransport } from "nodemailer";

@Injectable()
export class MailerService {
  private transporter: Transporter<SendMailOptions>;

  constructor(
    private configService: ConfigService
  ) {
    const port = this.configService.get("SMTP_PORT");
    this.transporter = createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: port == 465,
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASSWORD"),
      },
    });
  }

  async sendEmail(payload: SendMailOptions) {
    const info = await this.transporter.sendMail(payload);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
}
