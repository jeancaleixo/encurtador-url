import { Url } from 'src/modules/urls/entities/Url';
import { UrlResponseDto } from './urlResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UrlListResponseDto {
  @ApiProperty({ type: [UrlResponseDto] })
  urls: UrlResponseDto[];
  data: UrlResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };

  constructor(urls: Url[], total: number, page: number, limit: number) {
    this.data = urls.map((url) => new UrlResponseDto(url));
    this.meta = {
      total,
      page,
      limit,
    };
  }
}
