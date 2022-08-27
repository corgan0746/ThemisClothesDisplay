const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const db = require('../db/index')

passport.use( new LocalStrategy(
  function (username, password, done){

    if(!(username && password)){
      return done(null, false)
    }

    db.verifyUser(username, async (err, user) => {
      
      console.log('passport executed');
      console.log(user);

      const matchedPassword = password ===  user.password;

      console.log('This is the error' + err);

      if(err) {
        return done(err);
      }
      if(!user){
        return done(null, false);
      }
      if(!matchedPassword) {
        return done(null, false );
      }
      return done(null, user);
    })
  }
));

// Serialize a user
passport.serializeUser((user, done) => {
  console.log('user Serialized');
  
done(null, user.id);

});


// Deserialize a user
passport.deserializeUser((user, done) => {
  console.log('user Deserialized');
  
  db.getUserById(user, (err, user) => {
    if(err){
      return done(err);
    }
    return done(null, user);
  })
})
