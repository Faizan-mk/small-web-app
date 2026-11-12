import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export const TRANSITIONS = ['typed', 'link', 'search', 'history', 'back', 'forward', 'reload', 'publish', 'start'] as const
export type Transition = (typeof TRANSITIONS)[number]

@Schema({ collection: 'visits', versionKey: false })
export class Visit {
  @Prop({ required: true })
  personId: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  at: Date

  @Prop({ required: true, enum: TRANSITIONS })
  transition: Transition

  @Prop({ required: true })
  found: boolean

  @Prop({ type: String, default: null })
  title: string | null

  @Prop({ type: String })
  seedKey?: string
}

export type VisitDocument = HydratedDocument<Visit>
export const VisitSchema = SchemaFactory.createForClass(Visit)
VisitSchema.index({ personId: 1, at: -1 })
VisitSchema.index({ seedKey: 1 }, { unique: true, sparse: true })
