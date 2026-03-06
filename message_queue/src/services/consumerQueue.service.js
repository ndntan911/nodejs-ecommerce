const { connectRabbitMQ, consumerQueue } = require("../dbs/init.rabbitmq");

const messageService = {
    consumerQueue: async (queue) => {
        try {
            const { channel } = await connectRabbitMQ();
            await consumerQueue(channel, queue);
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    },

    consumerQueueNormal: async (queue) => {
        try {
            const { channel } = await connectRabbitMQ();
            const notificationQueue = 'notificationQueue'

            // 1. TTL
            // setTimeout(() => {
            //     channel.consume(notificationQueue, (msg) => {
            //         console.log('Received message:', msg.content.toString());
            //         channel.ack(msg);
            //     });
            // }, 15000);

            // 2. Logic error
            channel.consume(notificationQueue, (msg) => {
                try {
                    const numTest = Math.random()
                    if (numTest < 0.8) {
                        throw new Error('Logic error');
                    }
                    console.log('Received message:', msg.content.toString());
                    channel.ack(msg);
                } catch (error) {
                    channel.nack(msg, false, false);
                }
            });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    },

    consumerQueueFailed: async (queue) => {
        try {
            const { channel } = await connectRabbitMQ();
            const notificationExchangeDLX = 'notificationExchangeDLX'
            const notificationRoutingKey = 'notification.routingKey'
            const notificationQueueHandler = 'notificationQueueHandler'

            await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });
            await channel.assertQueue(notificationQueueHandler, { exclusive: false });
            await channel.bindQueue(notificationQueueHandler, notificationExchangeDLX, notificationRoutingKey);

            channel.consume(notificationQueueHandler, (msg) => {
                console.log('Received message failed:', msg.content.toString());
            }, { noAck: true });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }
}

module.exports = messageService;
