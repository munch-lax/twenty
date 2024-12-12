import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthException, AuthExceptionCode } from 'src/engine/core-modules/auth/auth.exception';

import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';

@Injectable()
export class FilePathGuard implements CanActivate {
  constructor(private readonly jwtWrapperService: JwtWrapperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    
    if (!query || !query['token']) {
      return false;
    }
    let payload:any ={}
    try{
     payload = await this.jwtWrapperService.verifyWorkspaceToken(
      query['token'],
      'FILE',
    )
  }catch (error) {
    if(error instanceof AuthException && error.code === AuthExceptionCode.UNAUTHENTICATED ){
      return false
    }
    else{
      throw new AuthException(
        'TOKEN VERIFICATION FAILED',
        AuthExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
    if (!payload.workspaceId) {
      return false;
    }
    
    const decodedPayload = await this.jwtWrapperService.decode(query['token'], {
      json: true,
    });

    const expirationDate = decodedPayload?.['expirationDate'];
    const workspaceId = decodedPayload?.['workspaceId'];

    const isExpired = await this.isExpired(expirationDate);

    if (isExpired) {
      return false;
    }

    request.workspaceId = workspaceId;

    return true;
  }

  private async isExpired(expirationDate: string): Promise<boolean> {
    if (!expirationDate) {
      return true;
    }

    if (new Date(expirationDate) < new Date()) {
      throw new HttpException(
        'This url has expired. Please reload twenty page and open file again.',
        HttpStatus.FORBIDDEN,
      );
    }

    return false;
  }
}
