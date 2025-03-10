/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { UrlRedirectService } from '../../../../src/modules/urls/services/redirect.service';
import { UrlRepositoryInMemory } from '../../../../src/modules/urls/repository/urlRepositoryInMemory';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from '../../../../src/modules/urls/entities/Url';
import { UrlRepository } from 'src/modules/urls/repository/urlRepository';

describe('UrlRedirectService', () => {
  let urlRedirectService: UrlRedirectService;
  let urlRepositoryInMemory: UrlRepositoryInMemory;
  let configService: ConfigService;
  const shortCode = 'abc123';
  const longUrl = 'https://example.com';

  beforeEach(() => {
    configService = new ConfigService({
      BASE_URL: 'http://short.url',
    });

    urlRepositoryInMemory = new UrlRepositoryInMemory();

    urlRedirectService = new UrlRedirectService(
      urlRepositoryInMemory as unknown as UrlRepository,
      configService,
    );
  });

  it('should retrieve the original URL and increment clicks', async () => {
    const url = await urlRepositoryInMemory.create(
      new Url(
        {
          longUrl,
          shortenedUrl: shortCode,
          userId: 'user123',
          clicks: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        'url123',
      ),
    );

    const result = await urlRedirectService.getOriginalUrl(shortCode);

    expect(result).toBeInstanceOf(Url);
    expect(result.longUrl).toBe(longUrl);
    expect(result.clicks).toBe(6);

    const updatedUrl = await urlRepositoryInMemory.findByShortUrl(shortCode);
    expect(updatedUrl!.clicks).toBe(6);
  });

  it('should throw NotFoundException when short URL does not exist', async () => {
    const nonExistentCode = 'nonexistent';

    await expect(
      urlRedirectService.getOriginalUrl(nonExistentCode),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when URL is deleted', async () => {
    await urlRepositoryInMemory.create(
      new Url(
        {
          longUrl,
          shortenedUrl: shortCode,
          userId: 'user123',
          clicks: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(), // URL is deleted
        },
        'url123',
      ),
    );

    await expect(urlRedirectService.getOriginalUrl(shortCode)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should use the repository to find the URL by short code', async () => {
    const findByShortUrlSpy = jest.spyOn(
      urlRepositoryInMemory,
      'findByShortUrl',
    );

    await urlRepositoryInMemory.create(
      new Url(
        {
          longUrl,
          shortenedUrl: shortCode,
          userId: 'user123',
          clicks: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        'url123',
      ),
    );

    await urlRedirectService.getOriginalUrl(shortCode);

    expect(findByShortUrlSpy).toHaveBeenCalledWith(shortCode);
  });

  it('should use the repository to update the URL with incremented clicks', async () => {
    const updateSpy = jest.spyOn(urlRepositoryInMemory, 'update');

    const url = await urlRepositoryInMemory.create(
      new Url(
        {
          longUrl,
          shortenedUrl: shortCode,
          userId: 'user123',
          clicks: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        'url123',
      ),
    );

    await urlRedirectService.getOriginalUrl(shortCode);

    expect(updateSpy).toHaveBeenCalled();

    const updatedUrl = updateSpy.mock.calls[0][0] as Url;
    expect(updatedUrl.clicks).toBe(11);
  });

  it('should initialize with default base URL if not in config', async () => {
    const emptyConfigService = new ConfigService({});

    const serviceWithDefaultUrl = new UrlRedirectService(
      urlRepositoryInMemory as unknown as UrlRepository,
      emptyConfigService,
    );

    await urlRepositoryInMemory.create(
      new Url(
        {
          longUrl,
          shortenedUrl: shortCode,
          userId: 'user123',
          clicks: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        'url123',
      ),
    );

    const result = await serviceWithDefaultUrl.getOriginalUrl(shortCode);
    expect(result).toBeInstanceOf(Url);
    expect(result.clicks).toBe(1);
  });
});
