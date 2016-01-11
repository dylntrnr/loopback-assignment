var slug = require('slug');

module.exports = function(User) {

  User.observe('before save', function(ctx, next) {
    var data = ctx.instance || ctx.data;
    data.username = slug(data.username);
    data.booksCounter = data.booksCounter || 0;
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

  User.beforeRemote('prototype.__link__libraries', function(ctx, library, next) {
    var user = ctx.req.remotingContext.instance;
    user.booksCounter +=1;
    next();
  });
  User.beforeRemote('prototype.__unlink__libraries', function(ctx, library, next) {
    var user = ctx.req.remotingContext.instance;
    user.booksCounter -=1;
    next();
  });
};
