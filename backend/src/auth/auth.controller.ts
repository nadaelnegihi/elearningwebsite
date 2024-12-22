
import { Body, Controller, HttpStatus, Post, HttpException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { SignInDto } from './dto/SignInDto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res) {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);
    res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000, // 1 hour expiration
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      user: result.payload,
    };
  }


    @Post('signup')
    async signup(@Body() registerRequestDto: RegisterRequestDto) {
      try {
        // Call the AuthService to handle registration
        const result = await this.authService.register(registerRequestDto);
  
        // Return a success response with HTTP 201 Created status
        return {
          statusCode: HttpStatus.CREATED,
          message: 'User registered successfully',
          data: result,
        };
      } catch (error) {
        console.error('Error during signup:', error);
        if (error.status === 409) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: 'User already exists',
            },
            HttpStatus.CONFLICT,
          );
        }
  
        // Catch any other errors and throw a generic internal server error
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An error occurred during registration',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  