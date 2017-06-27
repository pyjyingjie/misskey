"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_reaction_1 = require("../../../models/post-reaction");
const post_1 = require("../../../models/post");
const post_watching_1 = require("../../../models/post-watching");
const notify_1 = require("../../../common/notify");
const watch_post_1 = require("../../../common/watch-post");
const event_1 = require("../../../event");
/**
 * React to a post
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'post_id' parameter
    const [postId, postIdErr] = cafy_1.default(params.post_id).id().$;
    if (postIdErr)
        return rej('invalid post_id param');
    // Get 'reaction' parameter
    const [reaction, reactionErr] = cafy_1.default(params.reaction).string().or([
        'like',
        'love',
        'laugh',
        'hmm',
        'surprise',
        'congrats',
        'angry',
        'confused',
        'pudding'
    ]).$;
    if (reactionErr)
        return rej('invalid reaction param');
    // Fetch reactee
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    // Myself
    if (post.user_id.equals(user._id)) {
        return rej('cannot react to my post');
    }
    // if already reacted
    const exist = await post_reaction_1.default.findOne({
        post_id: post._id,
        user_id: user._id,
        deleted_at: { $exists: false }
    });
    if (exist !== null) {
        return rej('already reacted');
    }
    // Create reaction
    await post_reaction_1.default.insert({
        created_at: new Date(),
        post_id: post._id,
        user_id: user._id,
        reaction: reaction
    });
    // Send response
    res();
    const inc = {};
    inc[`reaction_counts.${reaction}`] = 1;
    // Increment reactions count
    await post_1.default.update({ _id: post._id }, {
        $inc: inc
    });
    event_1.publishPostStream(post._id, 'reacted');
    // Notify
    notify_1.default(post.user_id, user._id, 'reaction', {
        post_id: post._id,
        reaction: reaction
    });
    // Fetch watchers
    post_watching_1.default
        .find({
        post_id: post._id,
        user_id: { $ne: user._id },
        // 削除されたドキュメントは除く
        deleted_at: { $exists: false }
    }, {
        fields: {
            user_id: true
        }
    })
        .then(watchers => {
        watchers.forEach(watcher => {
            notify_1.default(watcher.user_id, user._id, 'reaction', {
                post_id: post._id,
                reaction: reaction
            });
        });
    });
    // この投稿をWatchする
    // TODO: ユーザーが「リアクションしたときに自動でWatchする」設定を
    //       オフにしていた場合はしない
    watch_post_1.default(user._id, post);
});
