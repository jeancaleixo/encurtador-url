import { IsUrl, IsOptional, IsString } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  longUrl: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
