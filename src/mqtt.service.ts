import { Inject, Injectable } from '@nestjs/common';
import {mqtt5, iot} from "aws-iot-device-sdk-v2";
import {ICrtError} from "aws-crt";
import {once} from "events";
import { toUtf8 } from '@aws-sdk/util-utf8-browser';
import * as path from 'path';
import { NotificationService } from './notification/services/notification.service';

@Injectable()
export class MqttService {
    @Inject()
   private  notificationService:NotificationService;

    constructor(){

    }

    arrayToString= (bufferValue: ArrayBuffer) => {
        return new TextDecoder("utf-8").decode(bufferValue);
     }

    createClientConfig() : mqtt5.Mqtt5ClientConfig {
        let builder : iot.AwsIotMqtt5ClientConfigBuilder | undefined = undefined;
    
        const endpoint = 'atz09m2ulkwu3-ats.iot.eu-north-1.amazonaws.com';
        const cert = path.resolve(
          __dirname,
          '../certs/cert.crt',
        );
        const key = path.resolve(
          __dirname,
          '../certs/private.key',
        );
    
    
            builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
                endpoint,
                cert,
                key
            );
    
    
        return builder.build();
    }

    createClient() : mqtt5.Mqtt5Client {

   

        let config : mqtt5.Mqtt5ClientConfig = this.createClientConfig();
    
        console.log("Creating client for " + config.hostName);
        let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);
    
        client.on('error', (error: ICrtError) => {
            console.log("Error event: " + error.toString());
        });
    
        client.on("messageReceived",(eventData: mqtt5.MessageReceivedEvent) : void => {
             
           
            console.log("Message Received event: " + JSON.stringify(eventData.message));
            if (eventData.message.payload) {
                let obj = JSON.parse( this.arrayToString(eventData.message.payload as ArrayBuffer));
                this.notificationService.registerNotification(obj);
                console.log("  with payload: " + toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer)));
            }
        } );
    
        client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
            console.log("Attempting Connect event");
        });
    
        client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
            console.log("Connection Success event");
            console.log ("Connack: " + JSON.stringify(eventData.connack));
            console.log ("Settings: " + JSON.stringify(eventData.settings));
        });
    
        client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
            console.log("Connection failure event: " + eventData.error.toString());
            if (eventData.connack) {
                console.log ("Connack: " + JSON.stringify(eventData.connack));
            }
        });
    
        client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
            console.log("Disconnection event: " + eventData.error.toString());
            if (eventData.disconnect !== undefined) {
                console.log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
            }
        });
    
        client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
            console.log("Stopped event");
        });
    
        return client;
    }

    public async runSampleService() {

        let client : mqtt5.Mqtt5Client = this.createClient();
    
        const connectionSuccess = once(client, "connectionSuccess");
    
        client.start();
        client.subscribe({
            subscriptions: [{ qos: 1, topicFilter: 'localgateway_to_awsiot' }],
          });
    
        await connectionSuccess;
    }

}
