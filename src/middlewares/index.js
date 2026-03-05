const Logger = require("../loggers/discord.log")

const pushToLogDiscord = (req, res, next) => {
    try {
        Logger.sendFormatCode({
            code: req.method === "GET" ? req.query : req.body,
            message: `${req.get("host")}${req.originalUrl}`,
            title: `Method: ${req.method}`
        })
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    pushToLogDiscord
}