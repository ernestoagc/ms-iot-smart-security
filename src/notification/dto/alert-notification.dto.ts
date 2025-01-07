import { ApiProperty } from '@nestjs/swagger';

export class AlertNotificationResponse{

  @ApiProperty()
  id: String;

  @ApiProperty()
  creationAt: Date;

  @ApiProperty()
  distance: number;

  @ApiProperty()
  hasView: boolean;
}