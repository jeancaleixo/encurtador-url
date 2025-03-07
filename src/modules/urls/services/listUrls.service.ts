import { Injectable } from '@nestjs/common';
import { UrlRepository } from '../repository/urlRepository';
import { Url } from '../entities/Url';

@Injectable()
export class UrlQueryService {
  constructor(private urlRepository: UrlRepository) {}

  async getUserUrls(userId: string): Promise<Url[]> {
    // Busca todas as URLs do usuário que não foram excluídas logicamente
    return this.urlRepository.findByUserId(userId);
  }

  async getUrlById(id: string): Promise<Url | null> {
    // Busca uma URL específica pelo ID
    return this.urlRepository.findById(id);
  }
}
