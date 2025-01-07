import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationRequest{
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  deviceId: string;
}