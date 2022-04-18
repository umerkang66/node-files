import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService],
  // this service is available to other modules
  exports: [PowerService],
})
export class PowerModule {}
