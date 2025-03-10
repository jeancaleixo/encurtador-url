import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlRepository } from '../repository/urlRepository';
import { Url } from '../entities/Url';

@Injectable()
export class UrlRedirectService {
  private readonly baseUrl: string;

  constructor(
    private urlRepository: UrlRepository,
    private configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async getOriginalUrl(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findByShortUrl(shortCode);

    if (!url || url.deletedAt !== null) {
      throw new NotFoundException('URL encurtada não encontrada');
    }

    url.clicks = url.clicks + 1;
    await this.urlRepository.update(url);

    return url;
  }
}
