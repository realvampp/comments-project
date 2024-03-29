import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dataSourceOptions } from '../db/data-source'
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), CommentsModule, AuthModule,
    ServeStaticModule.forRoot({
      rootPath: './uploads',
      serveRoot: '/static'
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
