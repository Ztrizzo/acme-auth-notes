const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note}} = require('./db');
const path = require('path');

app.engine('html', require('ejs').renderFile);



app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.render(path.join(__dirname, 'index.html'), {GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID}));

app.post('/api/auth', async(req, res, next)=> {
  try {
    res.send({ token: await User.authenticate(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth', async(req, res, next)=> {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/notes', async(req, res, next) => {
  try{
    const user = await User.byToken(req.headers.authorization);
    const notes = await Note.findAll({
      where:{
        userId: user.id
      }
    })
    res.send(notes);
  }
  catch(ex){
    next(ex);
  }
})

app.delete('/api/notes', async(req, res, next) => {
  try{
    const user = await User.byToken(req.headers.authorization);
    const note = await Note.findByPk(req.body.noteId);
    await note.destroy();
    const notes = await Note.findAll({
        where:{
          userId: user.id
        }
      }
    )
    res.send(notes);
  }
  catch(ex){
    next(ex);
  }
})

app.put('/api/notes', async(req, res, next) => {
  try{
    const user = await User.byToken(req.headers.authorization);
    const note = await Note.findByPk(req.body.noteId);
    note.txt = req.body.txt;
    await note.validate();
    await note.save();

    const notes = await Note.findAll({
      where:{
        userId: user.id
      }
    })
    res.send(notes);

  }
  catch(ex){
    next(ex);
  }
})

app.post('/api/notes', async(req, res, next) => {
  try{
    const user = await User.byToken(req.headers.authorization);
    await Note.create({txt: req.body.txt, userId: user.id})
    const notes = await Note.findAll({
      where:{
        userId: user.id
      }
    })
    res.send(notes);
  }
  catch(ex){
    next(ex);
  }
})

app.get('/api/purchases', async(req, res, next)=> {
  try {
    const user = await User.byToken(req.headers.authorization);
    res.send('TODO Send the purchases for this user');
  }
  catch(ex){
    next(ex);
  }
});

app.get('/github/callback', async(req, res, next)=> {
  try{
    const token = await User.authenticate(req.query);
    // res.send('this is a test');
    res.send(
      `
      <html>
        <body>
          ${token}
          <script>
            window.localStorage.setItem('token', '${token}');
            window.document.location = '/';
          </script>
        </body>
      </html>
      `
    )
    // window.localStorage.setItem('token', '${token});
    // ${/*window.document.location = '/';*/''}
  }
  catch(ex){
    next(ex);
  }
})

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
