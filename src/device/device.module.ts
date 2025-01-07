import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controller/device.controller';
import { Device, DeviceSchema } from './entity/device.entity';
import { DeviceService } from './services/device.service';

@Module({
  controllers: [ DeviceController],
  providers: [DeviceService],
  imports :[
    MongooseModule.forFeature([
      {
        name:Device.name,
        schema:DeviceSchema
      }
    ])
  ]

})
export class DeviceModule {}
