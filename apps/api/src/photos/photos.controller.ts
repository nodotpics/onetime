import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PhotosService } from './photos.service';
import { PhotoTTL, PhotoUploadLimits } from './photos.constants';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: PhotoUploadLimits.MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (
          !PhotoUploadLimits.ALLOWED_MIME_TYPES.includes(file.mimetype as any)
        ) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('ttl') ttl?: string,
    @Body('passphrase') passphrase?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const ttlSeconds = ttl ? Number(ttl) : undefined;
    if (ttlSeconds && (!Number.isFinite(ttlSeconds) || ttlSeconds % 1 !== 0)) {
      throw new BadRequestException('ttl must be an integer (seconds)');
    }
    if (
      ttlSeconds &&
      (ttlSeconds < PhotoTTL.MIN || ttlSeconds > PhotoTTL.MAX)
    ) {
      throw new BadRequestException(
        `TTL must be between ${PhotoTTL.MIN} and ${PhotoTTL.MAX} seconds`,
      );
    }

    const result = await this.photosService.uploadPhoto(
      file,
      ttlSeconds,
      passphrase,
    );

    return {
      success: true,
      receiptId: result.receiptId,
      expiresAt: result.expiresAt,
    };
  }

  @Get(':id/status')
  async getStatusById(@Param('id') id: string) {
    const status = await this.photosService.getStatusById(id);
    return { success: true, ...status };
  }

  @Post(':id/unlock')
  async unlock(
    @Param('id') id: string,
    @Body('passphrase') passphrase?: string,
  ) {
    const result = await this.photosService.unlockForView(id, passphrase ?? '');
    return { success: true, ...result };
  }

  @Get('receipt/:receiptId/status')
  async getStatusByReceipt(@Param('receiptId') receiptId: string) {
    const status = await this.photosService.getStatusByReceipt(receiptId);
    return { success: true, ...status };
  }

  @Delete(':id')
  async burnReceipt(@Param('id') receiptId: string) {
    if (!receiptId) return { success: true };
    await this.photosService.burnPhoto(receiptId);
    return { success: true };
  }

  @Get(':id')
  async getPhoto(
    @Param('id') id: string,
    @Query('token') token: string | undefined,
    @Res() res: Response,
  ) {
    const { meta, blob } = await this.photosService.getPhotoOnceGuarded(
      id,
      token,
    );

    res.setHeader('Content-Type', meta.mimeType);
    res.setHeader('Content-Length', meta.sizeBytes);
    res.setHeader('Content-Disposition', `inline; filename="${meta.filename}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-One-Time', 'true');

    return res.send(blob);
  }
}
