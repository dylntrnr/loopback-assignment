module.exports = function(Book) {

  Book.observe('before create', function(ctx, book, next) {

    console.log('testing remote');
    next();
  });
};
