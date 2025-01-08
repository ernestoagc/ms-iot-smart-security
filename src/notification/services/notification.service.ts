import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as firebase from 'firebase-admin';
import { Model } from 'mongoose';
import { AlertNotification } from '../entity/alert-notification.entity';
import { SendNotificationRequest } from '../dto/send-notification.dto';
import { SaveNotificationRequest } from '../dto/save-notification.dto';
import {HttpHelperService} from '../../common/http/http-helper.service'

@Injectable()
export class NotificationService {

    constructor(
      private readonly httpHelperService:HttpHelperService<any>,
      @InjectModel(AlertNotification.name)
      private readonly alertNotificationModel : Model<AlertNotification>
    ){

    }

    public async getNotification(id:string){
     let notificationDb =  await this.alertNotificationModel.findById(id);

     let objUpdated = {hasView:true};

     await  notificationDb.updateOne(objUpdated);
     return {
      id:id,
      hasView:notificationDb.hasView,
      creationAt:notificationDb.creationAt,
      distance:notificationDb.distance,
      image:notificationDb.image
     }

    }

    public async fetchNotification(){
      let result:any = await this.alertNotificationModel
      .find()
      .limit(10)
      .sort( '-creationAt' );

     let resultado =  result.map(not => (
        {
          id: not._id.toString(),
          creationAt: not.creationAt,
          hasView:not.hasView,
          distance:not.distance,
          image:not.image
        }
      ));

      return resultado;
    }

    public async saveNotification( saveNotificationRequest:SaveNotificationRequest){
      console.log("saveNotification");
      let notificationDb = {... saveNotificationRequest, 
        hasView:false, 
        creationAt:new Date(),
        image:'https://i.imgur.com/cy8hgbO.jpeg'
      }

      const notificacion = await this.alertNotificationModel.create(notificationDb);
      
      let {distance} = saveNotificationRequest;

      let objRequestNotification = {
        appId: 25977,
        appToken: "4ajMqrrIQxDlywGyUApPik",
        title: "Alert Proximity sensor",
        body: "Distance: " + distance.toString() ,
        dateSent: "1-7-2025 2:01AM"
    }

    //https://app.nativenotify.com/api/notification
    //https://run.mocky.io/v3/1a8d9c58-69a2-4781-af9c-d746543335aa
      await this.httpHelperService.post(
        "https://app.nativenotify.com/api/notification",
        objRequestNotification
      );


      return notificacion;
    }

    public async registerNotification(message:any){
      let {distance} = message;
      if(distance>4000){
        console.log("distance: {0}",distance);
         this.saveNotification({distance: distance});

      }

    return ;

    }

    public async sendNotification(notification:SendNotificationRequest){
        try {
            await firebase
              .messaging()
              .send({
                notification: {
                  title: notification.title,
                  body: notification.body,
                },
                token: notification.deviceId,
                data: {},
                android: {
                  priority: 'high',
                  notification: {
                    sound: 'default',
                    channelId: 'default',
                  },
                },
                apns: {
                  headers: {
                    'apns-priority': '10',
                  },
                  payload: {
                    aps: {
                      contentAvailable: true,
                      sound: 'default',
                    },
                  },
                },
              })
              .catch((error: any) => {
                console.error(error);
              });
          } catch (error) {
            console.log(error);
            return error;
          }
    }
}
