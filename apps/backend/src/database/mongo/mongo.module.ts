import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';
import { User, UserSchema } from 'src/domains/user/user.entity';
import { UserMongoRepository } from 'src/domains/user/user-mongo.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [MongoService, UserMongoRepository],
  exports: [MongoService, UserMongoRepository],
})
export class MongoModule {}
