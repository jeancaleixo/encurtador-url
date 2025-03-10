/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlRepository } from '../repository/urlRepository';
import { Url } from '../entities/Url';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UrlShortenService {
  private readonly nanoid;
  readonly baseUrl: string;

  constructor(
    private urlRepository: UrlRepository,
    private configService: ConfigService,
  ) {
    this.nanoid = customAlphabet(
      '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
      6,
    );
    this.baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async shortenUrl(longUrl: string, userId?: string): Promise<Url> {
    if (!this.isValidUrl(longUrl))
      throw new BadRequestException('URL inválida');

    const shortCode = this.nanoid();
    const url = new Url({
      longUrl,
      shortenedUrl: shortCode,
      userId: userId ?? null,
      clicks: 0,
    });

    return this.urlRepository.create(url);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
