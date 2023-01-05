import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // CORS akan diaktifkan ketika aplikasi berjalan di mode yang bukan production, sehingga bisa diakses dari browser
    // CORS akan dinonaktifkan ketika aplikasi berjalan di mode production, sehingga hanya bisa diakses dari domain aplikasi frontend kita
    cors: {
      origin:
        process.env.NODE_ENV !== 'production'
          ? '*'
          : [process.env.FRONTEND_URL],
    },
    logger: process.env.NODE_ENV === 'production' ? ['log'] : ['debug'],
  });

  // Dokumentasi API akan diaktifkan ketika aplikasi berjalan di mode yang bukan production, sehingga bisa diakses dari browser
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('GoodStore OpenAPI')
      .setDescription('GoodStore API Documentation')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    // Dokumentasi API akan diakses dari path /api
    // Contoh: https://example.com/api
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
