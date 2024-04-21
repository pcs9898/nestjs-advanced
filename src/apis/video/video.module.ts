import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { MulterExceptionFilter } from './filter/multer-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User]), UserModule],
  controllers: [VideoController],
  providers: [VideoService, MulterExceptionFilter],
  exports: [VideoService],
})
export class VideoModule {}
