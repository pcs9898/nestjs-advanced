import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/apis/user/user.service';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    return await this.userService.checkUserIsAdmin({
      user_id: request.user.id,
    });
  }
}
