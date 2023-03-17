import { User } from './models/User';

const user = new User({id: 1, name: 'nn', age: 7});

// console.log(user.get('name'));
user.on('save', () => {
  console.log(user);
});

// user.fetch()
user.save()

// user.set({name: 'new Naam'})

// user.trigger('change');
