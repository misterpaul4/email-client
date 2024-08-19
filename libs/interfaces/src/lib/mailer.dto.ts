import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsUUID('4')
  accountId: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  text: string;

  @IsString({ each: true })
  @IsOptional()
  cc?: string[];
}
