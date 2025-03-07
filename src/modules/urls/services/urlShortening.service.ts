/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  private readonly baseUrl: string;

  constructor(
    private urlRepository: UrlRepository,
    private configService: ConfigService,
  ) {
    // Usando nanoid para gerar códigos aleatórios de 6 caracteres
    // Usando alfabeto personalizado que evita caracteres ambíguos
    this.nanoid = customAlphabet(
      '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
      6,
    );

    // Obtendo a base URL das variáveis de ambiente
    this.baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async shortenUrl(longUrl: string, userId?: string): Promise<Url> {
    if (!this.isValidUrl(longUrl)) {
      throw new BadRequestException('URL inválida');
    }

    // Gerando código curto
    const shortCode = this.nanoid();
    const shortenedUrl = `${this.baseUrl}/${shortCode}`;

    // Criando entidade URL
    const url = new Url({
      longUrl,
      shortenedUrl,
      userId: userId || null,
      clicks: 0,
    });

    // Salvando no repositório
    return this.urlRepository.create(url);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
