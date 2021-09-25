import { MessageModel } from '@/models/message'
import { auth } from '@/middlewares/auth'
import { checkMessage } from '@/middlewares/checkMessage'
import {
  Controller,
  Flow,
  Get,
  Post,
  Put,
  Delete,
  Body,
  CurrentUser,
  Ctx,
} from 'amala'
import { Context } from 'koa'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

@Controller('/')
@Flow(auth)
export default class {
  @Post('/')
  async create(
    @Body('fullname') fullname: string,
    @Body('age') age: string,
    @Body('position') position: string,
    @Body('money') money: string,
    @Body('xren') xren: string,
    @CurrentUser() author: Ref<User>,
    @Ctx() ctx: Context
  ) {
    const data = { author, fullname, age, position, money, xren }
    Object.keys(data).forEach((key) =>
      data[key] === undefined && delete data[key]
    )
    const savedData = await MessageModel.findOne({ author, fullname })
    if (!savedData && fullname) {
      await new MessageModel(data).save()
      ctx.status = 200
    }
  }

  @Get('/')
  async getAll(@CurrentUser() author: Ref<User>) {
    const messages = await MessageModel.find({ author })
    return messages
  }

  @Get('/:id')
  @Flow(checkMessage)
  async getOne(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Put('/:id')
  @Flow(checkMessage)
  async update(
    @Body('fullname') fullname: string,
    @Body('age') age: string,
    @Body('position') position: string,
    @Body('money') money: string,
    @Body('xren') xren: string,
    @Ctx() ctx: Context
  ) {
    await MessageModel.updateOne(ctx.state.message, {
      fullname,
      age,
      position,
      money,
      xren,
    })
    ctx.status = 200
  }

  @Delete('/:id')
  @Flow(checkMessage)
  async delete(@Ctx() ctx: Context) {
    await MessageModel.deleteOne(ctx.state.message)
    ctx.status = 200
  }

  @Delete('/')
  async deleteAll(@CurrentUser() author: Ref<User>, @Ctx() ctx: Context) {
    await MessageModel.deleteMany({ author })
    ctx.status = 200
  }
}
