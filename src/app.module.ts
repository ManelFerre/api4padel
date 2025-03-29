// src/app.module.ts (archivo completo)
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// Eliminar o comentar estas importaciones si no existen
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ClubsModule } from './modules/clubs/clubs.module'; // Nuevo módulo
import { StatisticsModule } from './modules/statistics/statistics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, //configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    MatchesModule,
    ClubsModule, // Añadir el nuevo módulo
    StatisticsModule,
    NotificationsModule,
  ],
  controllers: [], // Eliminar AppController si no existe
  providers: [], // Eliminar AppService si no existe
})
export class AppModule {}