
// server/src/auth/dto/create-user.dto.ts
import { IsString, IsArray, MinLength, Matches, ArrayMinSize, ArrayUnique } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one number and one special character',
  })
  password: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayUnique()
  @IsString({ each: true })
  shopNames: string[];
}