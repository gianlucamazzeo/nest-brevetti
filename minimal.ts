import { NestFactory } from '@nestjs/core';
import { Controller, Get, Module } from '@nestjs/common';

@Controller()
class MinimalController {
  @Get('minimal-test')
  test() {
    return { message: 'Minimal test works!' };
  }
}

@Module({
  controllers: [MinimalController],
})
class MinimalModule {}

async function bootstrap() {
  const app = await NestFactory.create(MinimalModule);
  await app.listen(3001); // Usa una porta diversa
  console.log('Minimal app running on port 3001');
}
void bootstrap();