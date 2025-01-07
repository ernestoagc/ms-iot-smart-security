import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class AlertNotification extends Document  {

    @Prop()
    distance: number

    @Prop()
    creationAt : Date = new Date()

    @Prop()
    hasView: boolean = false

    @Prop()
    image: string


}

export const AlertNotificationSchema = SchemaFactory.createForClass(AlertNotification);