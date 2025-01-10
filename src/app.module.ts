import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { QuickwitService } from './quickwit.service';
import { KafkaConsumer } from './kafka.consumer';
import { kafkaConfig } from './kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [PostController, KafkaConsumer],
  providers: [PostService, QuickwitService],
})
export class AppModule {}
