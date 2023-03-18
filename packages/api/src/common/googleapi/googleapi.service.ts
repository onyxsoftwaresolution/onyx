import { ConfigService } from '@common/config/config.service';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
const OAuth2 = google.auth.OAuth2;
import MailComposer from 'nodemailer/lib/mail-composer';
import Mail from 'nodemailer/lib/mailer';
import { GaxiosResponse } from 'gaxios';
import { CacheService } from '@common/cache/cache.service';

@Injectable()
export class GoogleApiService {
  private oAuth2Client: OAuth2Client;

  constructor(
    private config: ConfigService,
    private cache: CacheService,
  ) {
    this.oAuth2Client = new OAuth2(
      this.config.get('CLIENT_ID'),
      this.config.get('CLIENT_SECRET'),
      this.config.get('REDIRECT_URI'),
    );
    this.oAuth2Client.on('tokens', tokens => {
      this.cache.set('ACCESS_TOKEN', tokens.access_token);
    });
  }

  getRedirectUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/gmail.send',
    });
  }

  async getToken(code: string) {
    return await this.oAuth2Client.getToken(code);
  }

  async setCredentials() {
    this.oAuth2Client.setCredentials({
      access_token: (await this.cache.get('ACCESS_TOKEN')) ?? this.config.get('ACCESS_TOKEN'),
      refresh_token: this.config.get('REFRESH_TOKEN'),
    });
    return this;
  }

  sendGmail(message: string) {
    const gmail = google.gmail({
      version: 'v1',
      auth: this.oAuth2Client,
    });
    return new Promise<GaxiosResponse>((res, rej) => {
      gmail.users.messages.send({
        auth: this.oAuth2Client,
        userId: 'me',
        // @ts-expect-error ???
        resource: {
          raw: message,
        }
      }, (error, response) => {
        if (response != null) res(response);
        if (error != null) rej(error);
      })
    });
  }

  async createMessage(
    to: string,
    from: string,
    subject: string,
    message: string,
    attachments: Mail.Attachment[]
  ) {
    const mail = new MailComposer({
      to,
      from,
      subject,
      text: message,
      textEncoding: 'quoted-printable',
      attachments,
    });
    const msg = await mail.compile().build();
    return Buffer.from(msg)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
