import {
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New user connected...', client.id);

    client.broadcast.emit('user-joined', {
      user: 'System',
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
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('receiveMessage', { message, senderId: client.id });
  }
}
