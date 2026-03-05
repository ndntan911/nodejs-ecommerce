const Comment = require('../models/comment.model')

class CommentService {
    static async createComment({ productId, userId, content, parentId }) {
        const newComment = new Comment({ comment_productId: productId, comment_userId: userId, comment_content: content, comment_parentId: parentId })

        let rightValue
        if (parentId) {
            const parentComment = await Comment.findById(parentId)
            rightValue = parentComment.comment_right

            await Comment.updateMany({
                comment_productId: productId,
                comment_right: { $gte: parentComment.comment_right }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: productId,
                comment_left: { $gt: parentComment.comment_right }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: productId
            }, "comment_right", { sort: { comment_right: -1 } })
            rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1
        }

        newComment.comment_left = rightValue
        newComment.comment_right = rightValue + 1
        await newComment.save()

        return newComment
    }

    static async getCommentsByParentId({ productId, parentId, limit = 50, offset = 0 }) {
        if (parentId) {
            const parentComment = await Comment.findById(parentId)
            const comments = await Comment.find({
                comment_productId: productId,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right }
            }).select("comment_content comment_left comment_right comment_parentId").sort({ comment_left: 1 }).limit(limit).skip(offset)
            return comments
        } else {
            const comments = await Comment.find({
                comment_productId: productId,
                comment_parentId: null
            }).select("comment_content comment_left comment_right comment_parentId").sort({ comment_left: 1 }).limit(limit).skip(offset)
            return comments
        }
    }

    static async deleteComment({ commentId, productId }) {
        const comment = await Comment.findOne({
            _id: commentId,
            comment_productId: productId
        })
        if (!comment) throw new Error('Comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        const width = rightValue - leftValue + 1

        await Comment.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        await Comment.updateMany({
            comment_productId: productId,
            comment_left: { $gt: rightValue },
        }, {
            $inc: { comment_left: -width }
        })

        await Comment.updateMany({
            comment_productId: productId,
            comment_right: { $gt: rightValue },
        }, {
            $inc: { comment_right: -width }
        })

        return true
    }
}

module.exports = CommentService