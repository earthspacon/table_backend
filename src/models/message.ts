import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

export class Message {
  @prop({ required: true })
  author: Ref<User>

  @prop({ required: true })
  fullname: string
  @prop()
  age: string
  @prop()
  position: string
  @prop()
  money: string
  @prop()
  degree: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})
