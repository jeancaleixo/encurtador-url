import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UrlRepository } from '../repository/urlRepository';
import { UrlQueryService } from '../services/listUrls.service';

@Injectable()
export class UrlDeletionService {
  constructor(
    private urlRepository: UrlRepository,
    private urlQueryService: UrlQueryService,
  ) {}

  async deleteUrl(id: string, userId: string): Promise<void> {
    const url = await this.urlQueryService.getUrlById(id);

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    if (url.deletedAt !== null) {
      throw new BadRequestException('Esta URL já foi excluída');
    }

    if (url.userId !== userId) {
      throw new BadRequestException(
        'Você não tem permissão para excluir esta URL',
      );
    }

    url.deletedAt = new Date();
    url.updatedAt = new Date();

    await this.urlRepository.update(url);
  }
}
