const { connectRabbitMQForTest } = require('../dbs/init.rabbitmq');

describe('RabbitMQ Connection', () => {
    it('should connect to RabbitMQ', async () => {
        const result = await connectRabbitMQForTest();
        expect(result).toBeUndefined();
    });
});