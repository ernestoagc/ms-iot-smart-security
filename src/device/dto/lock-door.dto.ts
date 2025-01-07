import { ApiProperty } from '@nestjs/swagger';

export class DoorRequest{

  @ApiProperty()
  id: string;

  @ApiProperty()
  lock: boolean;
}