/* eslint-disable @typescript-eslint/unbound-method */

import { UrlUpdateService } from '../../../../src/modules/urls/services/updateUrl.service';
import { UrlQueryService } from '../../../../src/modules/urls/services/listUrls.service';
import { UrlRepositoryInMemory } from '../../../../src/modules/urls/repository/urlRepositoryInMemory';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Url } from '../../../../src/modules/urls/entities/Url';
import { UrlRepository } from 'src/modules/urls/repository/urlRepository';

describe('UrlUpdateService', () => {
  let urlUpdateService: UrlUpdateService;
  let urlQueryService: UrlQueryService;
  let urlRepositoryInMemory: UrlRepositoryInMemory;
  let existingUrl: Url;
  const userId = 'user123';
  const urlId = 'url123';

  beforeEach(async () => {
    urlRepositoryInMemory = new UrlRepositoryInMemory();

    urlQueryService = {
      getUrlById: jest.fn(),
    } as unknown as UrlQueryService;

    urlUpdateService = new UrlUpdateService(
      urlRepositoryInMemory as unknown as UrlRepository,
      urlQueryService,
    );

    existingUrl = new Url(
      {
        longUrl: 'https://example.com',
        shortenedUrl: 'abc123',
        userId: userId,
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      urlId,
    );

    await urlRepositoryInMemory.create(existingUrl);

    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(existingUrl);
  });

  it('should update a URL with valid data and correct user', async () => {
    const newLongUrl = 'https://updated-example.com';

    const result = await urlUpdateService.updateUrl(urlId, userId, newLongUrl);

    expect(result).toBeInstanceOf(Url);
    expect(result.longUrl).toBe(newLongUrl);
    expect(result.id).toBe(urlId);
    expect(result.userId).toBe(userId);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should throw NotFoundException when URL does not exist', async () => {
    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(null);

    await expect(
      urlUpdateService.updateUrl(
        'nonexistent-id',
        userId,
        'https://new-example.com',
      ),
    ).rejects.toThrow(NotFoundException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith('nonexistent-id');
  });

  it('should throw BadRequestException when URL is deleted', async () => {
    const deletedUrl = { ...existingUrl, deletedAt: new Date() };
    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(deletedUrl);

    await expect(
      urlUpdateService.updateUrl(urlId, userId, 'https://new-example.com'),
    ).rejects.toThrow(BadRequestException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should throw BadRequestException when user does not own the URL', async () => {
    const differentUserId = 'differentUser123';

    await expect(
      urlUpdateService.updateUrl(
        urlId,
        differentUserId,
        'https://new-example.com',
      ),
    ).rejects.toThrow(BadRequestException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should throw BadRequestException for invalid URL format', async () => {
    const invalidUrl = 'invalid-url';

    await expect(
      urlUpdateService.updateUrl(urlId, userId, invalidUrl),
    ).rejects.toThrow(BadRequestException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should preserve original URL properties while updating longUrl', async () => {
    const newLongUrl = 'https://updated-example.com';
    const originalShortenedUrl = existingUrl.shortenedUrl;
    const originalClicks = existingUrl.clicks;

    const result = await urlUpdateService.updateUrl(urlId, userId, newLongUrl);

    expect(result.longUrl).toBe(newLongUrl);
    expect(result.shortenedUrl).toBe(originalShortenedUrl);
    expect(result.clicks).toBe(originalClicks);
    expect(result.updatedAt).not.toEqual(existingUrl.updatedAt);
  });
});
