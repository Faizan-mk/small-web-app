import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({ collection: 'people', versionKey: false })
export class Person {
  @Prop({ type: String, required: true })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, min: 0, max: 360 })
  hue: number

  @Prop({ default: false })
  seeded: boolean
}

export type PersonDocument = HydratedDocument<Person>
export const PersonSchema = SchemaFactory.createForClass(Person)
