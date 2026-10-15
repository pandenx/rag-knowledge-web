import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly llmBaseUrl: string;
  private readonly llmApiKey: string;

  constructor(private configService: ConfigService) {
    this.llmBaseUrl = this.configService.get<string>('LLM_BASE_URL')!;
    this.llmApiKey = this.configService.get<string>('LLM_API_KEY')!;
  }

  // 封装调用豆包大模型的方法，接收完整messages数组（支持多轮上下文）
  async chatCompletion(messages: Array<{ role: string; content: string }>) {
    try {
      const res = await axios.post(
        this.llmBaseUrl,
        {
          model: 'doubao-seed-2-1-lite-260915',
          messages: messages, // 直接透传前端传来的对话数组
        },
        {
          headers: {
            Authorization: `Bearer ${this.llmApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('大模型接口错误信息：', err.response?.data);
      } else {
        console.log('错误：', err);
      }
      throw new Error('调用方舟接口失败');
    }
  }
}
