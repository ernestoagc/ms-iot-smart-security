import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from './device/device.module';
import { MqttService } from './mqtt.service';
import { HttpHelperService } from './common/http/http-helper.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    DeviceModule,
    NotificationModule,
    MongooseModule.forRoot('mongodb+srv://egalarza:QciuzsaUGvky5BbA@clusterdemo.dewsl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDemo'),
    ConfigModule.forRoot()
  ],
  providers: [MqttService, HttpHelperService],
  exports:[HttpHelperService]
})
export class AppModule {
  constructor(private mqttService:MqttService){
    mqttService.runSampleService();
  }
}