import { getOrCreateUser } from '@/models/user'
import { Body, Controller, Post } from 'amala'

@Controller('/login')
export default class LoginController {
  @Post('/')
  async email(@Body('username') username, @Body('password') password) {
    const user = await getOrCreateUser({
      username,
      password,
    })
    return user
  }
}
