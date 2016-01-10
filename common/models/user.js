var slug = require('slug');

module.exports = function(User) {

  User.observe('before save', function(ctx, next) {
    var data = ctx.instance || ctx.data;
    data.username = slug(data.username);
    next();
  });

  User.prototype.rotate = function() {
    //in some lottery app this "random" field could be a way how we pick users
    this.random = Math.random();
    return this.save();
  };

  User.inputValidator = function(email) {
    return User.findOne({
      where: {email: email},
      fields: {id: true}
    }).then(function(user) {
      return {'unique': !user};
    });
  };

};
