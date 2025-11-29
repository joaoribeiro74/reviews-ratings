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
import { ItemsModule } from './items/items.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [SharedModule, CoreModule, ReviewsModule, ErrorsModule, PrismaModule, UserModule, AuthModule, ItemsModule, RatingModule],
  controllers: [AppController, ErrorsController],
  providers: [AppService],
})
export class AppModule {}
