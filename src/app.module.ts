import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/customer.entity';
import { InteractionsModule } from './interactions/interactions.module';
import { Interactions } from './interactions/interaction.entity';
import { TelegramModule } from './telegram/telegram.module';
import { TelegrafModule } from 'nestjs-telegraf';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Customer, Interactions],
        synchronize: true,
      })
    }),

    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('TELEGRAM_TOKEN')!, // علامة ! تعني "أنا أضمن لك أنه موجود"
      }),
      inject: [ConfigService],
    }),
    CustomersModule,
    InteractionsModule,
    TelegramModule
  ]
})
export class AppModule {}
