// refresh.dto.ts (o refreshToken.dto.ts)
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class RefreshDto {
@ApiProperty({
description: 'El refreshToken que regresó POST /auth/login',
example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIuLi4ifQ.firma',
})
@IsString()
refreshToken: string | undefined;
}