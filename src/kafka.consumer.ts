import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { QuickwitService } from './quickwit.service';
import { Post } from './post.entity';

@Controller()
export class KafkaConsumer {
  constructor(private readonly quickwitService: QuickwitService) {}

  @EventPattern('post.created')
  async handlePostCreated(post: Post) {
    await this.quickwitService.indexPost(post);
  }
}
