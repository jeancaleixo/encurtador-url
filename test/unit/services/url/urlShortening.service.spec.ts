import { UrlShortenService } from '../../../../src/modules/urls/services/urlShortening.service';
import { UrlRepositoryInMemory } from '../../../../src/modules/urls/repository/urlRepositoryInMemory';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from '../../../../src/modules/urls/entities/Url';
import { UrlRepository } from 'src/modules/urls/repository/urlRepository';

describe('UrlShortenService', () => {
  let urlShortenService: UrlShortenService;
  let urlRepositoryInMemory: UrlRepositoryInMemory;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({
      BASE_URL: 'http://short.url',
    });

    urlRepositoryInMemory = new UrlRepositoryInMemory();

    urlShortenService = new UrlShortenService(
      urlRepositoryInMemory as unknown as UrlRepository,
      configService,
    );
  });
  it('should create a shortened URL with valid long URL', async () => {
    const longUrl = 'https://example.com';
    const userId = 'user123';

    const result = await urlShortenService.shortenUrl(longUrl, userId);

    expect(result).toBeInstanceOf(Url);
    expect(result.longUrl).toBe(longUrl);
    expect(result.shortenedUrl).toHaveLength(6);
    expect(result.userId).toBe(userId);
    expect(result.clicks).toBe(0);

    expect(urlRepositoryInMemory.urls.length).toBe(1);
    expect(urlRepositoryInMemory.urls[0]).toEqual(result);
  });

  it('should throw BadRequestException for invalid URL', async () => {
    const invalidUrl = 'invalid-url';

    await expect(urlShortenService.shortenUrl(invalidUrl)).rejects.toThrow(
      BadRequestException,
    );
    expect(urlRepositoryInMemory.urls.length).toBe(0);
  });

  it('should generate a 6-character short code using custom alphabet', async () => {
    const longUrl = 'https://example.com';
    const result = await urlShortenService.shortenUrl(longUrl);

    const allowedChars =
      '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    const regex = new RegExp(`^[${allowedChars}]{6}$`);
    expect(result.shortenedUrl).toMatch(regex);
  });

  it('should store userId when provided', async () => {
    const userId = 'user123';
    const url = await urlShortenService.shortenUrl(
      'https://example.com',
      userId,
    );
    expect(url.userId).toBe(userId);
  });

  it('should have null userId when not provided', async () => {
    const url = await urlShortenService.shortenUrl('https://example.com');
    expect(url.userId).toBeNull();
  });

  it('should initialize clicks to 0', async () => {
    const url = await urlShortenService.shortenUrl('https://example.com');
    expect(url.clicks).toBe(0);
  });

  it('should handle different URLs generating different short codes', async () => {
    const url1 = await urlShortenService.shortenUrl('https://example.com/1');
    const url2 = await urlShortenService.shortenUrl('https://example.com/2');

    expect(url1.shortenedUrl).not.toBe(url2.shortenedUrl);
    expect(urlRepositoryInMemory.urls.length).toBe(2);
  });
});
