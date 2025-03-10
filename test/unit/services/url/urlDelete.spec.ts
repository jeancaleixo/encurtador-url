/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UrlDeletionService } from '../../../../src/modules/urls/services/deleteUrl.service';
import { UrlQueryService } from '../../../../src/modules/urls/services/listUrls.service';
import { UrlRepositoryInMemory } from '../../../../src/modules/urls/repository/urlRepositoryInMemory';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Url } from '../../../../src/modules/urls/entities/Url';
import { UrlRepository } from 'src/modules/urls/repository/urlRepository';

describe('UrlDeletionService', () => {
  let urlDeletionService: UrlDeletionService;
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

    urlDeletionService = new UrlDeletionService(
      urlRepositoryInMemory as unknown as UrlRepository,
      urlQueryService,
    );

    existingUrl = new Url(
      {
        longUrl: 'https://example.com',
        shortenedUrl: 'abc123',
        userId: userId,
        clicks: 0,
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(2023, 0, 1),
        deletedAt: null,
      },
      urlId,
    );

    await urlRepositoryInMemory.create(existingUrl);

    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(existingUrl);
  });

  it('should mark a URL as deleted with valid data and correct user', async () => {
    const deletionDate = new Date(2023, 0, 15);
    jest.spyOn(global, 'Date').mockImplementation(() => deletionDate as any);

    await urlDeletionService.deleteUrl(urlId, userId);

    const updatedUrl = await urlRepositoryInMemory.findById(urlId);

    const deletedUrl = urlRepositoryInMemory.urls.find((u) => u.id === urlId);
    expect(deletedUrl).toBeDefined();
    expect(deletedUrl!.deletedAt).toEqual(deletionDate);
    expect(deletedUrl!.updatedAt).toEqual(deletionDate);
    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);

    jest.restoreAllMocks();
  });

  it('should throw NotFoundException when URL does not exist', async () => {
    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(null);

    await expect(
      urlDeletionService.deleteUrl('nonexistent-id', userId),
    ).rejects.toThrow(NotFoundException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith('nonexistent-id');
  });

  it('should throw BadRequestException when URL is already deleted', async () => {
    const alreadyDeletedUrl = { ...existingUrl, deletedAt: new Date() };
    (urlQueryService.getUrlById as jest.Mock).mockResolvedValue(
      alreadyDeletedUrl,
    );

    await expect(urlDeletionService.deleteUrl(urlId, userId)).rejects.toThrow(
      BadRequestException,
    );

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should throw BadRequestException when user does not own the URL', async () => {
    const differentUserId = 'differentUser123';

    await expect(
      urlDeletionService.deleteUrl(urlId, differentUserId),
    ).rejects.toThrow(BadRequestException);

    expect(urlQueryService.getUrlById).toHaveBeenCalledWith(urlId);
  });

  it('should use the repository to update the URL with deletion date', async () => {
    const updateSpy = jest.spyOn(urlRepositoryInMemory, 'update');

    const deletionDate = new Date(2023, 0, 15);
    jest.spyOn(global, 'Date').mockImplementation(() => deletionDate as any);

    await urlDeletionService.deleteUrl(urlId, userId);

    expect(updateSpy).toHaveBeenCalled();

    const updatedUrl = updateSpy.mock.calls[0][0] as Url;
    expect(updatedUrl.deletedAt).toEqual(deletionDate);
    expect(updatedUrl.updatedAt).toEqual(deletionDate);

    jest.restoreAllMocks();
  });

  it('should preserve original URL properties while marking as deleted', async () => {
    const deletionDate = new Date(2023, 0, 15);
    jest.spyOn(global, 'Date').mockImplementation(() => deletionDate as any);

    await urlDeletionService.deleteUrl(urlId, userId);

    const deletedUrl = urlRepositoryInMemory.urls.find((u) => u.id === urlId)!;

    expect(deletedUrl.longUrl).toBe(existingUrl.longUrl);
    expect(deletedUrl.shortenedUrl).toBe(existingUrl.shortenedUrl);
    expect(deletedUrl.userId).toBe(existingUrl.userId);
    expect(deletedUrl.clicks).toBe(existingUrl.clicks);
    expect(deletedUrl.createdAt).toEqual(existingUrl.createdAt);
    expect(deletedUrl.deletedAt).toEqual(deletionDate);
    expect(deletedUrl.updatedAt).toEqual(deletionDate);

    jest.restoreAllMocks();
  });
});
