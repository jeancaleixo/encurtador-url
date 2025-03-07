import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.Guard';
import {
  CreateUrlDto,
  UpdateUrlDto,
  UrlResponseDto,
  UrlListResponseDto,
} from './dto/url.dto';
import { UrlShortenService } from '../../../../modules/urls/services/urlShortening.service';
import { UrlRedirectService } from '../../../../modules/urls/services/redirect.service';
import { UrlQueryService } from '../../../../modules/urls/services/listUrls.service';
import { UrlUpdateService } from '../../../../modules/urls/services/updateUrl.service';
import { UrlDeletionService } from '../../../../modules/urls/services/deleteUrl.service';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(
    private readonly urlShortenService: UrlShortenService,
    private readonly urlRedirectService: UrlRedirectService,
    private readonly urlQueryService: UrlQueryService,
    private readonly urlUpdateService: UrlUpdateService,
    private readonly urlDeletionService: UrlDeletionService,
  ) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Encurtar uma URL' })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada com sucesso',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: 'URL inválida' })
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: any,
  ): Promise<UrlResponseDto> {
    // Verificar se o usuário está autenticado
    const userId = req.user?.id;

    const url = await this.urlShortenService.shortenUrl(
      createUrlDto.longUrl,
      userId,
    );

    return {
      id: url.id,
      longUrl: url.longUrl,
      shortenedUrl: url.shortenedUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as URLs do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs retornada com sucesso',
    type: UrlListResponseDto,
  })
  async getUserUrls(@Req() req: any): Promise<UrlListResponseDto> {
    const urls = await this.urlQueryService.getUserUrls(req.user.id);

    return {
      urls: urls.map((url) => ({
        id: url.id,
        longUrl: url.longUrl,
        shortenedUrl: url.shortenedUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
    };
  }

  @Put('urls/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar URL original' })
  @ApiResponse({
    status: 200,
    description: 'URL atualizada com sucesso',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  @ApiResponse({ status: 400, description: 'URL inválida ou sem permissão' })
  async updateUrl(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: any,
  ): Promise<UrlResponseDto> {
    const url = await this.urlUpdateService.updateUrl(
      id,
      req.user.id,
      updateUrlDto.longUrl,
    );

    return {
      id: url.id,
      longUrl: url.longUrl,
      shortenedUrl: url.shortenedUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  @Delete('urls/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir uma URL encurtada' })
  @ApiResponse({ status: 204, description: 'URL excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  @ApiResponse({ status: 400, description: 'Sem permissão para excluir' })
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    await this.urlDeletionService.deleteUrl(id, req.user.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirecionar para URL original' })
  @ApiResponse({ status: 302, description: 'Redirecionado para URL original' })
  @ApiResponse({ status: 404, description: 'URL encurtada não encontrada' })
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlRedirectService.getOriginalUrl(shortCode);
    res.redirect(HttpStatus.FOUND, url.longUrl);
  }
}
