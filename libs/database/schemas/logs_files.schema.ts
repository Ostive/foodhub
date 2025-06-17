import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LogsFiles extends Document {
  @Prop({ required: true })
  Client_ID: string;

  @Prop({ required: true })
  Time: Date;

  @Prop()
  Mac_adress: string;

  @Prop()
  Localisation: string;

  @Prop()
  IPv4: string;

  @Prop()
  IPv6: string;

  @Prop()
  Mac_Address: string;
}

export const LogsFilesSchema = SchemaFactory.createForClass(LogsFiles);
