import { Controller, Get, Post, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { KeyServiceService } from './key-service.service';

@Controller('keys')
export class KeyServiceController {
  constructor(private readonly keyServiceService: KeyServiceService) {}

  @Get()
  getKeys() {
    return this.keyServiceService.getAllKeys();
  }

  @Post(':apiName/regenerate')
  regenerateKey(@Param('apiName') apiName: string, @Res() res: Response) {
    try {
      const newKey = this.keyServiceService.regenerateKey(apiName);
      return res.status(HttpStatus.OK).json({ apiName, newKey });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
    }
  }
}
