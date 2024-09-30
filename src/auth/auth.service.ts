import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { genSalt } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findOneByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      data: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async createUser(createUserDto: RegisterDto): Promise<any> {
    const { username, password } = createUserDto;

    const existingUser = await this.usersService.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.usersService.createUser(
      username,
      hashedPassword,
    );

    return { id: newUser.id, username: newUser.username };
  }
}
