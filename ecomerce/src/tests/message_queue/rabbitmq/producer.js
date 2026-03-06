const amqp = require('amqplib')

const message = 'Hello RabbitMQ from Antigravity'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`[x] Sent: ${message}`)

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer()
