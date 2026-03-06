const { consumerQueue, consumerQueueNormal, consumerQueueFailed } = require("./src/services/consumerQueue.service")

const queueName = "test-topic"
// consumerQueue(queueName).then(() => {
//     console.log("Consumer started");
// }).catch((error) => {
//     console.error("Error starting consumer:", error);
// });

consumerQueueNormal().then(() => {
    console.log("Consumer started");
}).catch((error) => {
    console.error("Error starting consumer:", error);
});

consumerQueueFailed().then(() => {
    console.log("Consumer started");
}).catch((error) => {
    console.error("Error starting consumer:", error);
});
