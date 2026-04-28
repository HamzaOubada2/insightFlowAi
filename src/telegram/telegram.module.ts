import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customers/customer.entity';
import { CustomerService } from 'src/customers/customer.service';
import { CustomersModule } from 'src/customers/customers.module';
import { InteractionsModule } from 'src/interactions/interactions.module';

@Module({
  imports: [CustomersModule, InteractionsModule],
  providers: [TelegramService, TelegramUpdate],
})
export class TelegramModule {}
