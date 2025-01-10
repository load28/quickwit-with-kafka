import { ClientOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: ClientOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'post-service',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'post-consumer',
    },
    producer: {
      allowAutoTopicCreation: true, // 토픽 자동 생성 활성화
    },
  },
};
