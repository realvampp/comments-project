import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsGateway } from './comments/comments.gateway';
import { dataSourceOptions } from '../db/data-source'
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), CommentsModule, AuthModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
