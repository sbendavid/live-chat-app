import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(
    @Body()
    body: {
      senderId: number;
      content: string;
      receiverId?: number;
      groupId?: number;
    },
  ) {
    return this.chatService.sendMessage(
      body.senderId,
      body.content,
      body.receiverId,
      body.groupId,
    );
  }

  @Get('messages/:userId')
  async getMessages(@Param('userId') userId: number) {
    return this.chatService.fetchMessages(userId);
  }

  @Get('group/:groupId/messages')
  async getGroupMessages(@Param('groupId') groupId: number) {
    return this.chatService.fetchGroupMessages(groupId);
  }

  @Get('user/:userId/groups')
  async getUserGroups(@Param('userId') userId: number) {
    return this.chatService.fetchUserGroups(userId);
  }
}
