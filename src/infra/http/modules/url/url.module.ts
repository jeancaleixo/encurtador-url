import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlController } from './url.controller';
import { UrlRepository } from '../../../../modules/urls/repository/urlRepository';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { UrlShortenService } from '../../../../modules/urls/services/urlShortening.service';
import { UrlRedirectService } from '../../../../modules/urls/services/redirect.service';
import { UrlQueryService } from '../../../../modules/urls/services/listUrls.service';
import { UrlUpdateService } from '../../../../modules/urls/services/updateUrl.service';
import { UrlDeletionService } from '../../../../modules/urls/services/deleteUrl.service';

@Module({
  imports: [ConfigModule],
  controllers: [UrlController],
  providers: [
    UrlRepository,
    PrismaService,
    UrlShortenService,
    UrlRedirectService,
    UrlQueryService,
    UrlUpdateService,
    UrlDeletionService,
  ],
  exports: [
    UrlShortenService,
    UrlRedirectService,
    UrlQueryService,
    UrlUpdateService,
    UrlDeletionService,
  ],
})
export class UrlModule {}
