import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
  // Whenever cpuService instance will be created
  // powerService will be provided
  constructor(private powerService: PowerService) {}

  compute(a: number, b: number): number {
    console.log('Drawing 10 watts of power from Power Service');
    this.powerService.supplyPower(10);
    return a + b;
  }
}
