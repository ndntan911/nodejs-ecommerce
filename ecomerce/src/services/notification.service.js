const Notification = require('../models/notification.model')

const pushNotiToSystem = async ({ type = 'SHOP-001', senderId, receivedId, content, options = {} }) => {
    let noti_content
    if (type === 'SHOP-001') {
        noti_content = `@@@ just created a new product @@@@`
    }

    const newNoti = await Notification.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receivedId: receivedId,
        noti_content: noti_content,
        noti_options: options
    })

    return newNoti
}

const listNotiByUser = async ({ receivedId, type = 'ALL', isRead = 0 }) => {
    const match = { noti_receivedId: receivedId }
    if (type !== 'ALL') match.noti_type = type
    if (isRead !== 0) match.isRead = isRead

    return await Notification.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                noti_content: 1,
                createdAt: 1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}
