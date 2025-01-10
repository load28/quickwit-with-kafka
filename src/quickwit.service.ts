// quickwit.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Post } from './post.entity';

@Injectable()
export class QuickwitService implements OnModuleInit {
  private readonly quickwitUrl = 'http://localhost:7280';
  private readonly indexId = 'posts';

  async onModuleInit() {
    try {
      // 인덱스 목록 가져오기
      const response = await axios.get(`${this.quickwitUrl}/api/v1/indexes`);
      const indexes = response.data;

      // 인덱스 ID 목록 추출
      const indexIds = indexes.map((index) => index.index_config.index_id);
      console.log('Current index IDs:', indexIds);

      // 원하는 인덱스가 없는 경우에만 생성
      if (!indexIds.includes(this.indexId)) {
        await axios.post(`${this.quickwitUrl}/api/v1/indexes`, {
          version: '0.7',
          index_id: this.indexId,
          doc_mapping: {
            mode: 'dynamic',
            field_mappings: [
              {
                name: 'id',
                type: 'text',
                tokenizer: 'raw',
                indexed: true,
                stored: true,
                record: 'position',
              },
              {
                name: 'title',
                type: 'text',
                tokenizer: 'default',
                indexed: true,
                stored: true,
                record: 'position',
              },
              {
                name: 'content',
                type: 'text',
                tokenizer: 'default',
                indexed: true,
                stored: true,
                record: 'position',
              },
              {
                name: 'created_at',
                type: 'datetime',
                indexed: true,
                stored: true,
                fast: true,
              },
            ],
            timestamp_field: 'created_at',
          },
          indexing_settings: {
            commit_timeout_secs: 10,
          },
          search_settings: {
            default_search_fields: ['title', 'content'],
          },
        });
        console.log(`Index '${this.indexId}' created successfully`);
      } else {
        console.log(`Index '${this.indexId}' already exists`);
      }
    } catch (error) {
      console.error('Error initializing Quickwit index:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  }

  async indexPost(post: Post) {
    try {
      await axios.post(
        `${this.quickwitUrl}/api/v1/${this.indexId}/ingest`,
        {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.createdAt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Error indexing post to Quickwit:', error);
      throw error;
    }
  }

  // quickwit.service.ts의 searchPosts 메서드 수정
  async searchPosts(query: string) {
    try {
      const response = await axios.post(
        `${this.quickwitUrl}/api/v1/${this.indexId}/search`,
        {
          query: `title:"${query}" OR content:"${query}"`,
        },
      );
      return response.data.hits;
    } catch (error) {
      console.error('Error searching posts in Quickwit:', error);
      throw error;
    }
  }
}
