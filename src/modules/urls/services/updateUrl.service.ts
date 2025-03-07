/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UrlRepository } from '../repository/urlRepository';
import { UrlQueryService } from '../services/listUrls.service';
import { Url } from '../entities/Url';

@Injectable()
export class UrlUpdateService {
  constructor(
    private urlRepository: UrlRepository,
    private urlQueryService: UrlQueryService,
  ) {}

  async updateUrl(
    id: string,
    userId: string,
    newLongUrl: string,
  ): Promise<Url> {
    // Verifica se a URL existe e pertence ao usuário
    const url = await this.urlQueryService.getUrlById(id);

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    if (url.deletedAt !== null) {
      throw new BadRequestException(
        'Esta URL foi excluída e não pode ser editada',
      );
    }

    if (url.userId !== userId) {
      throw new BadRequestException(
        'Você não tem permissão para editar esta URL',
      );
    }

    if (!this.isValidUrl(newLongUrl)) {
      throw new BadRequestException('URL inválida');
    }

    // Atualiza a URL
    url.longUrl = newLongUrl;
    url.updatedAt = new Date();

    return this.urlRepository.update(url);
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
