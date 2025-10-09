import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ErrorsController } from './errors/errors.controller';
import { ErrorsModule } from './errors/errors.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SharedModule, CoreModule, ReviewsModule, ErrorsModule, PrismaModule, UserModule, AuthModule],
  controllers: [AppController, ErrorsController],
  providers: [AppService],
})
export class AppModule {}
