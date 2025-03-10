/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { Url } from '../entities/Url';

@Injectable()
export class UrlRepositoryInMemory {
  public urls: Url[] = [];

  async create(url: Url): Promise<Url> {
    const newUrl = new Url(
      {
        longUrl: url.longUrl,
        shortenedUrl: url.shortenedUrl,
        userId: url.userId,
        clicks: url.clicks,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      url.id || Math.random().toString(36).substring(2, 9),
    );

    this.urls.push(newUrl);
    return newUrl;
  }

  async findById(id: string): Promise<Url | null> {
    return this.urls.find((url) => url.id === id && !url.deletedAt) || null;
  }

  async findByShortUrl(shortCode: string): Promise<Url | null> {
    return (
      this.urls.find(
        (url) => url.shortenedUrl === shortCode && !url.deletedAt,
      ) || null
    );
  }

  async findByUserId(userId: string): Promise<Url[]> {
    return this.urls.filter((url) => url.userId === userId && !url.deletedAt);
  }

  async update(updatedUrl: Url): Promise<Url> {
    const index = this.urls.findIndex((url) => url.id === updatedUrl.id);

    if (index === -1) {
      throw new Error('URL not found');
    }

    this.urls[index] = updatedUrl;
    return this.urls[index];
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
