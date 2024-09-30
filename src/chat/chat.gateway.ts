import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('New user connected...', client.id);

    client.broadcast.emit('user-joined', {
      message: `${client.id} has joined the chat`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected...', client.id);

    client.broadcast.emit('user-left', {
      message: `${client.id} has left the chat`,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: any,
    payload: {
      senderId: number;
      content: string;
      receiverId?: number;
      groupId?: number;
    },
  ): Promise<void> {
    // Save message to the database
    const message: Message = await this.chatService.sendMessage(
      payload.senderId,
      payload.content,
      payload.receiverId,
      payload.groupId,
    );

    // Emit message to relevant users
    this.server.emit('messageReceived', message);
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: any, groupId: number) {
    client.join(`group_${groupId}`); // Join the specific group room
  }

  @SubscribeMessage('sendGroupMessage')
  async handleGroupMessage(
    client: any,
    payload: { groupId: number; senderId: number; content: string },
  ) {
    const message = await this.chatService.sendMessage(
      payload.senderId,
      payload.content,
      undefined,
      payload.groupId,
    );
    this.server
      .to(`group_${payload.groupId}`)
      .emit('receiveGroupMessage', message); // Broadcast to the group
  }
}
