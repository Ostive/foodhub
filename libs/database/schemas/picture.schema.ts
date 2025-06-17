import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Picture extends Document {
  @Prop({ required: true, unique: true })
  Image_id: string;

  // Si tu veux stocker la base64 :
  @Prop()
  image_base64: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
