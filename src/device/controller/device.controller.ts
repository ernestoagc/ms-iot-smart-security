import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DeviceRequest } from '../dto/device.dto';
import { LightRequest } from '../dto/light.dto';
import { DoorRequest } from '../dto/lock-door.dto';
import { DeviceService } from '../services/device.service';

@Controller('device')
export class DeviceController {
constructor(private readonly deviceService:DeviceService){

}

@Post('/door')
@HttpCode(HttpStatus.OK)
public doorAction(@Body() lockDoorRequest:DoorRequest){
    return this.deviceService.lockDoor(lockDoorRequest);
}

@Post('/light')
@HttpCode(HttpStatus.OK)
public lightAction(@Body() lightRequest:LightRequest){
   return this.deviceService.turnOnLight(lightRequest);
}

@Post('/register')
@HttpCode(HttpStatus.OK)
public registerDevice(@Body() deviceRequest:DeviceRequest){
    return this.deviceService.registerDevice(deviceRequest);
}

@Get('/fetch')
@HttpCode(HttpStatus.OK)
public fetchNotification(){
   return this.deviceService.fetchDevices();
}

}
