import { Controller, Post, Get, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { messages: Array<{ role: string; content: string }> }) {
    return await this.chatService.chatCompletion(body.messages);
  }

  // 仅用于浏览器调试
  @Get()
  async testChat() {
    const data = await this.chatService.chatCompletion([{ role: 'user', content: '你好' }]);
    return data;
  }
}
