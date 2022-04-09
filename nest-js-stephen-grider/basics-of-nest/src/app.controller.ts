import { Controller, Get } from '@nestjs/common';

@Controller('/app')
export class AppController {
  @Get('/root')
  public getRootRoute(): string {
    return 'hi there!';
  }

  @Get('/bye')
  public getByeThere(): string {
    return 'Bye there!';
  }
}
