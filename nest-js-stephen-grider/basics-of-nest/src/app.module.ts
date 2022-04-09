import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Every nest application should have at least one module
@Module({
  controllers: [AppController],
})
export class AppModule {
  // Module will automatically create the instance of Controller class
}
