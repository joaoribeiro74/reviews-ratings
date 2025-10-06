import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { ErrorsController } from './errors/errors.controller';
import { ErrorsModule } from './errors/errors.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SharedModule, CoreModule, ReviewsModule, ErrorsModule, PrismaModule, UserModule],
  controllers: [AppController, ErrorsController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
