import { ApiProperty } from "@nestjs/swagger";

export class UserDto{
    @ApiProperty({
        description: 'send mail to user'
    })
    email: string;
    @ApiProperty({
        description: 'send name to user'
    })
    name: string
}