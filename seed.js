
const db = require('./server/db');
const Author = require('./server/db/models/author');


const authors = [{
  name: 'Cody',
  image: '/images/cody.jpg'
}];

const seed = () =>
  Promise.all(authors.map(author => Author.create(author))
);

const main = () => {
  console.log('Syncing db...');
  db.sync({ force: true })
    .then(() => {
      console.log('Seeding databse...');
      return seed();
    })
    .catch(err => {
      console.log('Error while seeding');
      console.log(err.stack);
    })
    .then(() => {
      db.close();
      return null;
    });
};

main();