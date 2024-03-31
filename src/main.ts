import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT
      }
    }
  );

// Habilita CORS para permitir solicitudes de diferentes orígenes
// app.enableCors();

// Establece un prefijo global para todas las rutas, comenzando con '/api/v1'
// app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  await app.listen()
    .then(() => {
      logger.log(`ms-products-app is running on port ${envs.PORT}`);
  });

}

bootstrap()
  .catch((error) => {
    const logger = new Logger('Bootstrap');
    logger.error('Application failed to start', error);
  });