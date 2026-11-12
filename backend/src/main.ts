import 'reflect-metadata'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.setGlobalPrefix('api')

  app.useBodyParser('json', { limit: '256kb' })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.enableCors({ origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3100').split(',') })

  const port = Number(process.env.PORT ?? 4100)
  await app.listen(port)
  Logger.log(`Small web API on http://localhost:${port}/api`, 'Bootstrap')
}

void bootstrap()
