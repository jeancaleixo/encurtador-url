import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'URL original a ser atualizada',
    example: 'https://www.exemplo.com/pagina-longa',
  })
  @IsNotEmpty({ message: 'A URL não pode estar vazia' })
  @IsUrl({}, { message: 'URL inválida' })
  longUrl: string; // Removido o opcional (
  @IsOptional()
  @IsString()
  shortenedUrl?: string;
}
