import { ApiProperty } from '@nestjs/swagger';

export class LightRequest{

  @ApiProperty()
  id: string;

  @ApiProperty()
  turnOn: boolean;
}