const amqp = require('amqplib');

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return { channel, connection };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const connectRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectRabbitMQ();

        const queue = "test"
        const message = "Hello World"
        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(message));
        console.log('Message sent to RabbitMQ');
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

module.exports = { connectRabbitMQ, connectRabbitMQForTest };