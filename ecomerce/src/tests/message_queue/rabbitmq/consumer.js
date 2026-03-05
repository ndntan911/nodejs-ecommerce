const amqp = require('amqplib')

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: false
        })

        console.log(`[*] Waiting for messages in ${queueName}. To exit press CTRL+C`)

        channel.consume(queueName, (message) => {
            console.log(`[x] Received: ${message.content.toString()}`)
        }, {
            noAck: true,
        })
    } catch (error) {
        console.error(error)
    }
}

runConsumer()
