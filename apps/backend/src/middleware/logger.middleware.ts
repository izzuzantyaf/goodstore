import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Logger middleware untuk menampilkan informasi dari request yang masuk di console
 * @example
 * GET /api/users {"user-agent":"PostmanRuntime/7.26.8","ip":"::ffff:"}
 * POST /api/users {"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36","ip":"::ffff:
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `${req.method} ${req.path} ${JSON.stringify({
        'user-agent': req.headers['user-agent'],
        ip: req.ip,
      })}`,
    );
    next();
  }
}
