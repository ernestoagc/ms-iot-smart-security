import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Door extends Document  {

    @Prop()
    status: string
}

export const DoorSchema = SchemaFactory.createForClass(Door);