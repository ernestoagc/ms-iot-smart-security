import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRequest } from '../dto/device.dto';
import { LightRequest } from '../dto/light.dto';
import { DoorRequest } from '../dto/lock-door.dto';
import { Device } from '../entity/device.entity';
import {HttpHelperService} from '../../common/http/http-helper.service';

import * as crypto from "crypto"

@Injectable()
export class DeviceService {

    constructor(
      private readonly httpHelperService:HttpHelperService<any>,
        @InjectModel(Device.name)
        private readonly deviceModel : Model<Device>
    ){}

    public async registerDevice(deviceRequest:DeviceRequest){
      
      let deviceDb = {... deviceRequest, creationAt:new Date()}

      const device = await this.deviceModel.create(deviceDb);
      return device;
    }

    
    async  encryptStr(str: string, secret: string): Promise<string> {
      return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
    }

      encryptStrTest(str: string, secret: string):string {
      return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
    }

    async  getTokenSign(): Promise<{ [k: string]: string }> {
      const nonce = '';
      const method = 'GET';
      const timestamp = Date.now().toString();
      const signUrl = '/v1.0/token?grant_type=1';
      const contentHash = crypto.createHash('sha256').update('').digest('hex');
      const signHeaders = Object.keys({});
      const signHeaderStr = Object.keys(signHeaders).reduce((pre, cur, idx) => {
        return `${pre}${cur}:${{}[cur]}${idx === signHeaders.length - 1 ? '' : '\n'}`;
      }, '');
      const stringToSign = [method, contentHash, signHeaderStr, signUrl].join('\n');
      const signStr = "3685a752b0d6447db769db66993f7906" + timestamp + nonce + stringToSign;
      return {
        t: timestamp,
        sign_method: 'HMAC-SHA256',
        client_id: "avduc79fu3d5kc377mds",
        sign: await this.encryptStr(signStr,"3685a752b0d6447db769db66993f7906"),
      };
    }

    private async callTuyaPlaform(){
    console.log("==>starting callTuyaPlaform");


    const params: URLSearchParams = new URLSearchParams();
    params.append('grant_type', "1");
    const timestamp = Date.now().toString();
     
    let header =  this.httpHelperService.getHeaders();
    header["client_id"] = "avduc79fu3d5kc377mds";
    header["sign"] = "F7A687492FFA8BA4CA62F6567D32488EE6DAA760621E6D71338F370ED13AD999";
    header["sign_method"] = "HMAC-SHA256";
    header["t"] =1736729323651;
 

    console.log("==>calling method to get Tuya Token");
      let tokenTuya:any = await this.httpHelperService.get(process.env.TUYA_ENDPOINT_TOKEN,header);
 
      console.log("==>getting TUYA token: ",tokenTuya.data.result.access_token);

      console.log("==>calling method to lock/unlock door");
      let responseDevice = await this.httpHelperService.post(process.env.TUYA_ENDPOINT_DOOR_LOCK,header);
 
      return responseDevice;

    }

    private async updateDevice(updateDevice:any){

     await this.callTuyaPlaform();
      
     let deviceDb:any =  await this.deviceModel.findById(updateDevice.id);

     
     let objeto :any ={};
     if(deviceDb.type=="DOOR"){
      objeto.isActive = updateDevice.lock;
     } else {
      objeto.isActive = updateDevice.turnOn;
     }

     console.log("==>updating status door on database");
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



