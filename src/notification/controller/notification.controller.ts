import {NotificationService} from '../services/notification.service'
import {SendNotificationRequest} from '../dto/send-notification.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { SaveNotificationRequest } from '../dto/save-notification.dto';

@Controller('notification')
export class NotificationController {

    constructor(
        private readonly notificationService:NotificationService){
    }

    @Post('/save')
    @HttpCode(HttpStatus.OK)
    public saveNotification(@Body() saveNotificationRequest:SaveNotificationRequest){
        this.notificationService.saveNotification(saveNotificationRequest);
    }


    @Get('/fetch')
    @HttpCode(HttpStatus.OK)
    public fetchNotification(){
       return this.notificationService.fetchNotification();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    public getNotification(@Param('id') id:string){
       return this.notificationService.getNotification(id);
    }
}
