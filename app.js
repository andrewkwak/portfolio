const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/home', function(request, response){
  response.render('index');
});

app.get('/about', function(request, response){
  response.render('about');
})

app.get('/portfolio', function(request, response){
  response.render('portfolio');
})
///////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/board', function(request, response){
  //process.env.DATABASE_URL
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('select * from messages', function(err, result){
      response.render('board', {titles: result.rows});
      done();
      pg.end();
    })
  })
})

app.get('/board/:id', function(request, response){
  pg.connect('postgres://localhost:5432/bulletinboard', function(err, client, done){
    let user_id = request.params.id;
    client.query(`select * from messages where id='${user_id}'`, function(err, result){
      response.render('message', { post: result.rows[0] });
      done();
      pg.end();
    });
  });
});

app.post('/board', function(request, response){
  pg.connect('postgres://localhost:5432/bulletinboard', function(err, client, done){
    client.query(`insert into messages (title, body) values ('${request.body.title}', '${request.body.body}');`, function(err, result){
    if(request.body.title !== ""){
      response.redirect('/board');
      done();
      pg.end();
    }
    })
  })
})

app.get('*', function(request, response){
  response.redirect('/home')
})

//////////////////////////////////////////////////////////////////////////////////////////


app.listen(port, function(){
  console.log("Now listening in Port 3000");
})
