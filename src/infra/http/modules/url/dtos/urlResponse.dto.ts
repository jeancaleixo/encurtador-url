import { Exclude } from 'class-transformer';
import { Url } from 'src/modules/urls/entities/Url';

export class UrlResponseDto {
  id: string;
  longUrl: string;
  shortenedUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(url: Url) {
    this.id = url.id;
    this.longUrl = url.longUrl;
    this.shortenedUrl = url.shortenedUrl;
    this.clicks = url.clicks;
    this.createdAt = url.createdAt;
    this.updatedAt = url.updatedAt;
    this.deletedAt = url.deletedAt;
  }
}
