/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { Url } from '../entities/Url';

@Injectable()
export class UrlRepository {
  constructor(private prisma: PrismaService) {}

  async create(url: Url): Promise<Url> {
    const data = await this.prisma.shortenedUrl.create({
      data: {
        id: url.id,
        longUrl: url.longUrl,
        shortenedUrl: url.shortenedUrl,
        userId: url.userId,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });

    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<Url | null> {
    const url = await this.prisma.shortenedUrl.findFirst({
      where: {
        id,
      },
    });

    if (!url) {
      return null;
    }

    return this.mapToEntity(url);
  }

  async findByShortUrl(shortUrl: string): Promise<Url | null> {
    const url = await this.prisma.shortenedUrl.findFirst({
      where: {
        shortenedUrl: shortUrl,
        deletedAt: null,
      },
    });

    if (!url) {
      return null;
    }

    return this.mapToEntity(url);
  }

  async findByUserId(userId: string): Promise<Url[]> {
    const urls = await this.prisma.shortenedUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return urls.map(this.mapToEntity);
  }

  async update(url: Url): Promise<Url> {
    const data = await this.prisma.shortenedUrl.update({
      where: {
        id: url.id,
      },
      data: {
        longUrl: url.longUrl,
        shortenedUrl: url.shortenedUrl,
        clicks: url.clicks,
        updatedAt: url.updatedAt,
        deletedAt: url.deletedAt,
      },
    });

    return this.mapToEntity(data);
  }

  private mapToEntity(data: any): Url {
    return new Url(
      {
        longUrl: data.longUrl,
        shortenedUrl: data.shortenedUrl,
        userId: data.userId,
        clicks: data.clicks,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
      },
      data.id,
    );
  }
}
