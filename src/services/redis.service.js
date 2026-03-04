const redis = require("redis")
const redisClient = redis.createClient()
const { promisify } = require("util")
const { reservationInventory } = require("../models/repositories/inventory.repo")

const pexpire = promisify(redisClient.expire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v1_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime)
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (key) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(key)
}

module.exports = {
    acquireLock,
    releaseLock
}
