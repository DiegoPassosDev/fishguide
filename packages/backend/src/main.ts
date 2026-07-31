import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

async function bootstrap() {
  const [
    { NestFactory },
    { ValidationPipe },
    { SwaggerModule, DocumentBuilder },
    { AppModule },
  ] = await Promise.all([
    import('@nestjs/core'),
    import('@nestjs/common'),
    import('@nestjs/swagger'),
    import('./app.module.js'),
  ]);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FishGuide API')
    .setDescription('API do FishGuide — plataforma colaborativa de pesca')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
