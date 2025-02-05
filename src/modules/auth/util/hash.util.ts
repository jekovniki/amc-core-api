import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export async function hashData(string: string, configService: ConfigService): Promise<string> {
  return bcrypt.hash(string, Number(configService.getOrThrow('SALT_ROUNDS')));
}

export async function validateHash(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
