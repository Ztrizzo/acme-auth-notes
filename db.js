const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { STRING, TEXT } = Sequelize;
const faker = require('faker');
const axios = require('axios');

const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});

const Note = conn.define('note', {
  txt: TEXT
})

User.hasMany(Note);
Note.belongsTo(User);

User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    const hashed = await bcrypt.hash(user.password, 3);
    user.password = hashed;
  }
});

User.byToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(payload.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if(user){
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

User.authenticate = async({ username, password, code })=> {
  if(code){
    let response = await axios.post(GITHUB_TOKEN_URL, {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    },{
      headers:{
        accept: 'application/json'
      }
    });
    
    const { data } = response;
    if(data.error){
      const error = new Error(data.error_description);
      error.status = 401;
      throw error;
    }
    const { access_token } = data;
    response = await axios.get(GITHUB_USER_URL, {
      headers: {
        Authorization: `token ${access_token}`
      }
    })

    const gitHubInfo = response.data;
    let user = await User.findOne({
      where: {username: gitHubInfo.login}
    })
    if(!user){
      user = await User.create({ username: gitHubInfo.login })
    }
    
    return jwt.sign({id: user.id}, process.env.JWT);
    
  }
  else{
    const user = await User.findOne({
      where: {
        username
      }
    });
    if(user && await bcrypt.compare(password, user.password) ){
      return jwt.sign({ id: user.id}, process.env.JWT); 
    }
    const error = Error('bad credentials!!!!!!');
    error.status = 401;
    throw error;
  }



};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );

  for(let i = 0; i < 10; i ++){
    await Note.create({txt: `moe: ${faker.lorem.sentence(8)}`, userId: moe.id})
    await Note.create({txt: `lucy: ${faker.lorem.sentence(8)}`, userId: lucy.id})
    await Note.create({txt: `larry: ${faker.lorem.sentence(8)}`, userId: larry.id})
  }

  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Note
  }
};
