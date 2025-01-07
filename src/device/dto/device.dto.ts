import { ApiProperty } from '@nestjs/swagger';

export class DeviceRequest{

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;
}