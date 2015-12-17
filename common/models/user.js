module.exports = function(User) {
  User.prototype.rotate = function() {
    //in some lottery app this "random" field could be a way how we pick users
    this.random = Math.random();
    return this.save();
  };
};
