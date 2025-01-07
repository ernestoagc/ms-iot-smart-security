import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controller/notification.controller';
import { firebaseAdminProvider } from './services/firebase-admin.provider';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { AlertNotification, AlertNotificationSchema } from './entity/alert-notification.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpHelperService } from '../common/http/http-helper.service';

@Module({
  providers: [NotificationService,firebaseAdminProvider,HttpHelperService],
  controllers: [NotificationController],
  exports:[NotificationService],
  imports :[
    HttpModule,
    MongooseModule.forFeature([
      {
        name:AlertNotification.name,
        schema:AlertNotificationSchema
      }
    ])
  ]
})
export class NotificationModule {
}
