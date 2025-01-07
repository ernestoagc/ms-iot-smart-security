import { ApiProperty } from '@nestjs/swagger';

export class SaveNotificationRequest{
  @ApiProperty()
  distance: number;
}