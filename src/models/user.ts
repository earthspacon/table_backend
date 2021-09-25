import { sign } from '@/helpers/jwt'
import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class User {
  @prop({ required: true, index: true })
  username: string
  @prop({ required: true, index: true })
  password: string

  @prop({ required: true, index: true, unique: true })
  token: string
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

interface LoginOptions {
  username: string
  password: string
}

export async function getOrCreateUser(loginOptions: LoginOptions) {
  if (!loginOptions.username && !loginOptions.password) {
    throw new Error()
  }
  let user: DocumentType<User> | undefined
  user = await UserModel.findOne(loginOptions)

  if (!user) {
    user = await new UserModel({
      ...loginOptions,
      token: await sign(loginOptions),
    }).save()
  }
  return user
}
