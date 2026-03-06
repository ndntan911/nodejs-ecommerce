const amqp = require('amqplib')

const message = 'Hello RabbitMQ from Antigravity'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationExchange'
        const notificationQueue = 'notificationQueue'
        const notificationExchangeDLX = 'notificationExchangeDLX'
        const notificationRoutingKey = 'notification.routingKey'

        await channel.assertExchange(notificationExchange, 'direct', { durable: true })
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKey
        })
        await channel.bindQueue(queueResult.queue, notificationExchange)

        const msg = 'Hello RabbitMQ from Antigravity'
        channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })
        console.log(`[x] Sent: ${msg}`)

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer()
