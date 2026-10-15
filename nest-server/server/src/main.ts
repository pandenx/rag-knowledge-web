import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启跨域，给前端Vite页面访问接口用
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`服务启动在 http://localhost:${process.env.PORT ?? 3000}`);
}
void bootstrap();
