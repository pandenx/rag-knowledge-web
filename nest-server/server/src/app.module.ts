import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module'; // 你之前nest g module chat生成的chat模块

@Module({
  imports: [
    // 全局启用环境变量，加载.env文件
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，所有service不用重复导入
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
