import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './domains/user/user.module';
import { AuthModule } from './domains/auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*', // Middleware akan dijalankan untuk semua route
      method: RequestMethod.ALL, // Middleware akan dijalankan untuk semua jenis request method
    });
  }
}
