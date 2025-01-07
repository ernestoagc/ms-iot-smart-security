import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRequest } from '../dto/device.dto';
import { LightRequest } from '../dto/light.dto';
import { DoorRequest } from '../dto/lock-door.dto';
import { Device } from '../entity/device.entity';

@Injectable()
export class DeviceService {

    constructor(
        @InjectModel(Device.name)
        private readonly deviceModel : Model<Device>
    ){}

    public async registerDevice(deviceRequest:DeviceRequest){
      
      let deviceDb = {... deviceRequest, creationAt:new Date()}

      const device = await this.deviceModel.create(deviceDb);
      return device;
    }

    private async updateDevice(updateDevice:any){
      
     let deviceDb:any =  await this.deviceModel.findById(updateDevice.id);

     let objeto :any ={};
     if(deviceDb.type=="DOOR"){
      objeto.isActive = updateDevice.lock;
     } else {
      objeto.isActive = updateDevice.turnOn;
     }

     await  deviceDb.updateOne(objeto);
      return  {code :'200'};
    }

    public async lockDoor(lockDoorRequest:DoorRequest){
      return this.updateDevice({...lockDoorRequest,type:'DOOR'})
    }

    public async turnOnLight(lightRequest:LightRequest){
      
      return this.updateDevice({...lightRequest,type:'LIGHT'})
    }



    public async fetchDevices(){

      let result:any = await this.deviceModel
      .find()
      .limit(10)
      .sort( '-creationAt' );

     let resultado =  result.map(dev => (
        {
          id: dev._id.toString(),
          isActive:dev.isActive,
          creationAt: dev.creationAt,
          type:dev.type,
          status:dev.status
        }
      ));

     return resultado;

    }

    

    
}



