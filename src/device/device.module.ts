import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controller/device.controller';
import { Device, DeviceSchema } from './entity/device.entity';
import { DeviceService } from './services/device.service';
import { HttpHelperService } from '../common/http/http-helper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ DeviceController],
  providers: [DeviceService,HttpHelperService],
  imports :[
    HttpModule,
    MongooseModule.forFeature([
      {
        name:Device.name,
        schema:DeviceSchema
      }
    ])
  ]

})
export class DeviceModule {}
