// post.service.ts
import { Injectable } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { kafkaConfig } from './kafka.config';
import { QuickwitService } from './quickwit.service';
import { Post } from './post.entity';
import { CreatePostDto } from './post.dto';

@Injectable()
export class PostService {
  @Client(kafkaConfig)
  private readonly kafkaClient: ClientKafka;

  constructor(private readonly quickwitService: QuickwitService) {}

  async createPost(createPostDto: CreatePostDto) {
    const post: Post = {
      id: uuidv4(),
      title: createPostDto.title,
      content: createPostDto.content,
      createdAt: new Date(),
    };

    // Kafka에 이벤트 발행
    await this.kafkaClient.emit('post.created', post);

    return post;
  }

  async searchPosts(query: string) {
    return this.quickwitService.searchPosts(query);
  }
}
