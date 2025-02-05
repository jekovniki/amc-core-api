import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        database: configService.getOrThrow('DATABASE_NAME'),
        username: configService.getOrThrow('DATABASE_USER'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('DATABASE_SYNCHRONIZE') === 'true',
        logging: true,
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('No options found when running migration');
        }
        const dataSource = await new DataSource(options).initialize();
        await dataSource.runMigrations();
        return dataSource;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
