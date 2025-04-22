import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { TemplateDelegate, compile } from 'handlebars';
import path from 'path';
import fs from 'fs';
import { logger } from '../util/logger.util';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private templates: Map<string, { subject: string; textTemplate: TemplateDelegate; htmlTemplate?: TemplateDelegate }>;
  private templateDir: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    this.templates = new Map();
    this.templateDir = path.join(process.cwd(), 'src/shared/mail/templates');

    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      const files = fs.readdirSync(this.templateDir).filter((file) => file.endsWith('.hbs'));

      for (const file of files) {
        const filePath = path.join(this.templateDir, file);
        const templateName = path.basename(file, '.hbs');
        const templateSource = fs.readFileSync(filePath, 'utf8');
        const template = compile(templateSource) as any;

        this.templates.set(templateName, template);
      }

      logger.info(`Loaded ${this.templates.size} email templates!`);
    } catch (error) {
      logger.error(`Error loading email templates:`, error);
    }
  }

  async sendTemplateEmail(to: string, templateName: string, subject: string, data: any) {
    const compiledTemplate = this.templates.get(templateName) as any;
    if (!compiledTemplate) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const renderedSubject = subject.includes('{{') ? compile(subject)(data) : subject;
    const html = compiledTemplate(data);

    return await this.sendMail(to, renderedSubject, undefined, html);
  }

  async sendMail(to: string, subject: string, text?: string, html?: any) {
    const from = this.configService.get<string>('FROM_EMAIL');

    return await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}
