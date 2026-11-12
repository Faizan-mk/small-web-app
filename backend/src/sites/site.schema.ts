import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({ _id: false })
export class Revision {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  html: string

  @Prop({ required: true })
  publishedAt: Date
}
const RevisionSchema = SchemaFactory.createForClass(Revision)

@Schema({ collection: 'sites', versionKey: false })
export class Site {
  @Prop({ required: true, unique: true })
  address: string

  @Prop({ required: true, index: true })
  authorId: string

  @Prop({ required: true })
  createdAt: Date

  @Prop({ type: [RevisionSchema], required: true })
  revisions: Revision[]

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  text: string

  @Prop({ required: true })
  addressWords: string

  @Prop({ required: true })
  updatedAt: Date

  @Prop({ default: false })
  seeded: boolean
}

export type SiteDocument = HydratedDocument<Site>
export const SiteSchema = SchemaFactory.createForClass(Site)

SiteSchema.index(
  { title: 'text', addressWords: 'text', text: 'text' },
  { name: 'site_text', weights: { title: 4, addressWords: 4, text: 1 }, default_language: 'english' },
)
