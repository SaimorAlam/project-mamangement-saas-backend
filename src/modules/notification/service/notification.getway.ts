/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../common/db/redis/services/redis.service';



interface PayloadType {
  userId: string;
  email?: string;
}


@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://lawal.sakibalhasa.xyz'
    ],
    credentials: true,
  },
})
@Injectable()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token || client.handshake.headers?.authorization;

    if (!token) {
      client.emit('error', { message: 'Authentication token is required' });
      client.disconnect();
      return;
    }

    const jwtAccessSecret = this.configService.get<string>('jwt_access_secret');
    if (!jwtAccessSecret) {
      client.emit('error', { message: 'jwt_access_secret not found' });
      throw new Error('JWT access secret is not defined');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: jwtAccessSecret,
      });
      const userId = decoded.userId;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        client.emit('error', { message: 'User not found.' });
        client.disconnect();
        return;
      }

      console.log("---------------------------soket------------------------------------")
      console.log(userId, client.id)
      console.log("----------------------------end--------------------------")

      await this.redisService.hSet('userSocketMap', userId, client.id);

      client.emit('connectionSuccess', {
        message: 'User connected and authenticated successfully.',
        userId,
        socketId: client.id,
      });
    } catch (error) {
      console.error('Authentication error:', error);
      client.emit('error', { message: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userSocketMap = await this.redisService.hGetAll('userSocketMap');
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === client.id,
    );

    if (userId) {
      await this.redisService.hDel('userSocketMap', userId);
      await this.redisService.hDel('userActiveChatMap', userId);
    }
  }

  async emitToUsers(userIds: string[], event: string, data: any) {
    const socketIds: string[] = [];
    console.log(userIds)
    console.log(event)
    console.log(data)
    const promises = userIds.map((userId) =>
      this.redisService.hGet('userSocketMap', userId),
    );

    const results = await Promise.all(promises);
    console.log(promises)
    console.log("----------------------------------")
    console.log(results)
    for (const socketId of results) {
      console.log(socketId, "----------------------------")
      if (socketId) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }
}



// //now code .
// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { ConfigService } from '@nestjs/config';
// import { RedisService } from '../../../common/db/redis/services/redis.service';

// interface PayloadType {
//   userId: string;
//   email?: string;
// }

// @WebSocketGateway({
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:5000'],
//     credentials: true,
//   },
// })
// @Injectable()
// export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly redisService: RedisService,
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}

//   async handleConnection(client: Socket) {
//     const token =
//       client.handshake.auth?.token || client.handshake.headers?.authorization;

//     if (!token) {
//       client.emit('error', { message: 'Authentication token is required' });
//       client.disconnect();
//       return;
//     }

//     const jwtAccessSecret = this.configService.get<string>('jwt_access_secret');

//     try {
//       const decoded = await this.jwtService.verifyAsync<PayloadType>(token, {
//         secret: jwtAccessSecret,
//       });
//       const userId = decoded.userId;

//       const user = await this.prisma.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         client.emit('error', { message: 'User not found.' });
//         client.disconnect();
//         return;
//       }

//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           status: true,         
//           lastActive: new Date()
//         },
//       });

//       (client as any).userId = userId;

//       await this.redisService.hSet('userSocketMap', userId, client.id);

//       this.server.emit('userStatusChanged', {
//         userId,
//         isOnline: true,
//         lastActive: new Date(),
//       });

//       console.log(`🟢 User Online: ${userId} | Socket: ${client.id}`);

//       client.emit('connectionSuccess', {
//         message: 'Successfully connected and authenticated.',
//         userId,
//       });

//     } catch (error) {
//       console.error('Socket Auth Error:', error.message);
//       client.emit('error', { message: 'Invalid or expired token' });
//       client.disconnect();
//     }
//   }


//   async handleDisconnect(client: Socket) {
//     const userId = (client as any).userId;

//     if (userId) {
//       const offlineTime = new Date();
//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           status: false,        
//           lastActive: offlineTime 
//         },
//       });

//       await this.redisService.hDel('userSocketMap', userId);
//       await this.redisService.hDel('userActiveChatMap', userId);

//       this.server.emit('userStatusChanged', {
//         userId,
//         isOnline: false,
//         lastActive: offlineTime,
//       });

//       console.log(`🔴 User Offline: ${userId} | Last Seen: ${offlineTime}`);
//     }
//   }


//   async emitToUsers(userIds: string[], event: string, data: any) {
//     const promises = userIds.map((userId) =>
//       this.redisService.hGet('userSocketMap', userId),
//     );

//     const socketIds = await Promise.all(promises);

//     for (const socketId of socketIds) {
//       if (socketId) {
//         this.server.to(socketId).emit(event, data);
//       }
//     }
//   }

//   async sendToUsers(userIds: string[], event: string, payload: any) {
//     const socketIds = await Promise.all(
//       userIds.map(id => this.redisService.hGet('userSocketMap', id))
//     );

//     socketIds.forEach(socketId => {
//       if (socketId) this.server.to(socketId).emit(event, payload);
//     });
//   }
// }