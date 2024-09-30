import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to send a message
  async sendMessage(
    senderId: number,
    content: string,
    receiverId?: number,
    groupId?: number,
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        groupId,
      },
    });
  }

  // Method to fetch messages for a user
  async fetchMessages(userId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  // Method to fetch messages in a group
  async fetchGroupMessages(groupId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        groupId,
      },
      include: {
        sender: true,
      },
    });
  }

  // Method to fetch user groups
  async fetchUserGroups(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        groups: true,
      },
    });
  }
}
