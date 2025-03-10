/* eslint-disable @typescript-eslint/no-unused-vars */
import { UrlQueryService } from '../../../../src/modules/urls/services/listUrls.service';
import { UrlRepositoryInMemory } from '../../../../src/modules/urls/repository/urlRepositoryInMemory';
import { Url } from '../../../../src/modules/urls/entities/Url';
import { UrlRepository } from 'src/modules/urls/repository/urlRepository';

describe('UrlQueryService', () => {
  let urlQueryService: UrlQueryService;
  let urlRepositoryInMemory: UrlRepositoryInMemory;
  const userId = 'user123';
  const urlId = 'url123';

  beforeEach(() => {
    urlRepositoryInMemory = new UrlRepositoryInMemory();
    urlQueryService = new UrlQueryService(
      urlRepositoryInMemory as unknown as UrlRepository,
    );
  });

  describe('getUserUrls', () => {
    it('should return empty array when user has no URLs', async () => {
      const urls = await urlQueryService.getUserUrls(userId);

      expect(urls).toBeInstanceOf(Array);
      expect(urls.length).toBe(0);
    });

    it('should return all URLs belonging to a user', async () => {
      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example1.com',
            shortenedUrl: 'abc123',
            userId: userId,
            clicks: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          'url1',
        ),
      );

      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example2.com',
            shortenedUrl: 'def456',
            userId: userId,
            clicks: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          'url2',
        ),
      );

      const urls = await urlQueryService.getUserUrls(userId);

      expect(urls).toBeInstanceOf(Array);
      expect(urls.length).toBe(2);
      expect(urls[0].longUrl).toBe('https://example1.com');
      expect(urls[1].longUrl).toBe('https://example2.com');
    });

    it('should not return URLs belonging to other users', async () => {
      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example1.com',
            shortenedUrl: 'abc123',
            userId: userId,
            clicks: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          'url1',
        ),
      );

      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example2.com',
            shortenedUrl: 'def456',
            userId: 'anotherUser',
            clicks: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          'url2',
        ),
      );

      const urls = await urlQueryService.getUserUrls(userId);

      expect(urls).toBeInstanceOf(Array);
      expect(urls.length).toBe(1);
      expect(urls[0].longUrl).toBe('https://example1.com');
    });

    it('should not return deleted URLs', async () => {
      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example1.com',
            shortenedUrl: 'abc123',
            userId: userId,
            clicks: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          'url1',
        ),
      );

      await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example2.com',
            shortenedUrl: 'def456',
            userId: userId,
            clicks: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          'url2',
        ),
      );

      const urls = await urlQueryService.getUserUrls(userId);

      expect(urls.length).toBe(1);
      expect(urls[0].longUrl).toBe('https://example1.com');
    });

    it('should use the repository to find URLs by userId', async () => {
      const findByUserIdSpy = jest.spyOn(urlRepositoryInMemory, 'findByUserId');

      await urlQueryService.getUserUrls(userId);

      expect(findByUserIdSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUrlById', () => {
    it('should return null when URL does not exist', async () => {
      const url = await urlQueryService.getUrlById('nonexistent-id');

      expect(url).toBeNull();
    });

    it('should return URL when it exists', async () => {
      const createdUrl = await urlRepositoryInMemory.create(
        new Url(
          {
            longUrl: 'https://example.com',
            shortenedUrl: 'abc123',
            userId: userId,
            clicks: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          urlId,
        ),
      );

      const url = await urlQueryService.getUrlById(urlId);

      expect(url).not.toBeNull();
      expect(url!.id).toBe(urlId);
      expect(url!.longUrl).toBe('https://example.com');
      expect(url!.shortenedUrl).toBe('abc123');
    });

    it('should use the repository to find URL by id', async () => {
      const findByIdSpy = jest.spyOn(urlRepositoryInMemory, 'findById');

      await urlQueryService.getUrlById(urlId);

      expect(findByIdSpy).toHaveBeenCalledWith(urlId);
    });
  });
});
