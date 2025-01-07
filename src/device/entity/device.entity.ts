import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Device extends Document  {

    @Prop()
    status: string

    @Prop()
    description: string

    @Prop()
    type: string

    @Prop()
    isActive: boolean

    @Prop()
    creationAt : Date = new Date()
}

export const DeviceSchema = SchemaFactory.createForClass(Device);