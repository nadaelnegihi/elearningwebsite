import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProgressModule } from 'src/progress/progress.module'; // Import ProgressModule
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule,ProgressModule, // Add ProgressModule here
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
