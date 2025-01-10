import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('search')
  async searchPosts(@Query('q') query: string) {
    return this.postService.searchPosts(query);
  }
}
