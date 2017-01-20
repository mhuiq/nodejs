/**
 * Created by Mark on 17/1/18.
 */
function Token (valid_time) {
    this.cur_token = '';
    this.old_token = '';
    this.update_time = '';
    this.last_update_time = '';
    this.valid_time = valid_time;
    this.isAuthed = false;
};
Token.prototype.refreshToken = function (cur_token, update_time) {
    if (this.cur_token != '') {
        this.old_token = this.cur_token;
    }
    this.cur_token = cur_token;
    this.last_update_time = this.update_time;
    this.update_time = update_time;
};
Token.prototype.getCurToken = function () {
    return this.cur_token;
};
Token.prototype.getOldToken = function () {
    return this.old_token;
};
// 判断当前旧的tocken是否过期
Token.prototype.isTransition = function () {
    return (this.last_update_time + this.valid_time) > Date.now();
}
function createNewToken (valid_time) {
    return new Token(valid_time);
};

exports.createNewToken = createNewToken;
