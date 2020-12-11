const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1202_Grado',
  database: 'labomaster'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  res.render('top.ejs')
});

app.get('/borrow', (req, res) => {
  connection.query(
    'select * from kagi where lender is null',
    (error, results) => {
      res.render('borrow.ejs', {numbers: results, type: "鍵", algebra: 1});
    }
  );
});

app.get('/borrow-meter', (req, res) => {
  connection.query(
    'select * from meters where lender is null',
    (error, results) => {
      res.render('borrow.ejs', {numbers: results, type: "行動計", algebra: 2});
    }
  );
});

app.get('/borrow-fitbit', (req, res) => {
  connection.query(
    'select * from fitbit where lender is null',
    (error, results) => {
      res.render('borrow.ejs', {numbers: results, type: "Fitbit", algebra: 3});
    }
  );
});

app.get('/resister/:alg/:id', (req, res) => {
  if (req.params.alg == 1) {
    connection.query(
      'SELECT * FROM kagi WHERE id = ?',
      [req.params.id],
      (error, results) => {
        console.log(results);
        res.render('resister.ejs', {bango: results[0]});
      }
    );

  } else if (req.params.alg == 3) {
    connection.query(
      'SELECT * FROM fitbit WHERE id = ?',
      [req.params.id],
      (error, results) => {
        console.log(results);
        res.render('resister.ejs', {bango: results[0]});
      }
    );

  } else if (req.params.alg == 2) {
    connection.query(
      'SELECT * FROM meters WHERE id = ?',
      [req.params.id],
      (error, results) => {
        console.log(results);
        res.render('resister.ejs', {bango: results[0]});
      }
    );
  }
});

app.post('/update/:id', (req, res) => {
  if (req.body.type == "鍵") {
    connection.query(
      'update kagi set lender = ?, proprietary = ? where id = ?',
      [req.body.bangoLender, req.body.bangoProprietary, req.params.id],
      (error, results) => {
        connection.query(
          'select * from html where id = 1',
          (error, results) => {
            res.render('display.ejs', {status: results[0]});
          }        
        );
      }
    );

  } else if (req.body.type == "Fitbit") {
    connection.query(
      'update fitbit set lender = ?, proprietary = ? where id = ?',
      [req.body.bangoLender, req.body.bangoProprietary, req.params.id],
      (error, results) => {
        connection.query(
          'select * from html where id = 1',
          (error, results) => {
            res.render('display.ejs', {status: results[0]});
          }        
        );
      }
    );

  } else if (req.body.type == "行動計") {
    connection.query(
      'update meters set lender = ?, proprietary = ? where id = ?',
      [req.body.bangoLender, req.body.bangoProprietary, req.params.id],
      (error, results) => {
        connection.query(
          'select * from html where id = 1',
          (error, results) => {
            res.render('display.ejs', {status: results[0]});
          }        
        );
      }
    );
  } 
});

app.get('/return', (req, res) => {
  connection.query(
    'select * from html where id = 3',
    (error, results) => {
      console.log(results);
      res.render('return.ejs', {item: results[0]});
    }
  );
});

app.get('/return-meter', (req, res) => {
  connection.query(
    'select * from html where id = 4',
    (error, results) => {
      console.log(results);
      res.render('return.ejs', {item: results[0]});
    }
  );
});

app.get('/return-fitbit', (req, res) => {
  connection.query(
    'select * from html where id = 5',
    (error, results) => {
      console.log(results);
      res.render('return.ejs', {item: results[0]});
    }
  );
});

app.post('/delete', (req, res) => {
  if (req.body.type == "鍵") {
    connection.query(
      'delete from kagi where id = ?',
      [req.body.id],
      (error, results) => {
        connection.query(
          'insert into kagi (id, item) values (?, "鍵")',
          [req.body.id],
          (error, results) => {
            connection.query(
              'select * from html where id = 2',
              (error, results) => {
                console.log(results);
                res.render('display.ejs', {status: results[0]});
              }
            );
          }
        );
      }
    );
  } else if (req.body.type == "Fitbit") {
    connection.query(
      'delete from fitbit where id = ?',
      [req.body.id],
      (error, results) => {
        connection.query(
          'insert into fitbit (id, item) values (?, "Fitbit")',
          [req.body.id],
          (error, results) => {
            connection.query(
              'select * from html where id = 2',
              (error, results) => {
                console.log(results);
                res.render('display.ejs', {status: results[0]});
              }
            );
          }
        );
      }
    );

  } else if (req.body.type == "行動計") {
    connection.query(
      'delete from meters where id = ?',
      [req.body.id],
      (error, results) => {
        connection.query(
          'insert into meters (id, item) values (?, "行動計")',
          [req.body.id],
          (error, results) => {
            connection.query(
              'select * from html where id = 2',
              (error, results) => {
                console.log(results);
                res.render('display.ejs', {status: results[0]});
              }
            );
          }
        );
      }
    );
  }
});

app.get('/select_number', (req, res) => {
  connection.query(
    'select * from meters where lender is not null',
    (error, results) => {
      res.render('sleep.ejs', {numbers: results});
    }
  );
});

app.get('/resister_sleep/:id', (req, res) => {
  connection.query(
        'insert into times(number, sleep) values (?, localtimestamp)',
        [req.params.id],
        (error, results) => {
          connection.query(
            'select id from times where number = ? and wake is null ',
            [req.params.id],
            (error, results) => {
              console.log(results);
              res.render('wake.ejs', {identification: results[0]});
            }
          );
        }
  );
});

app.get('/resister_wake/:id', (req, res) => {
  connection.query(
    'update times set wake = now() where id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/select_number');
    }
  );
});

app.get('/select_number_miss', (req, res) => {
  connection.query(
    'select * from meters where lender is not null',
    (error, results) => {
      res.render('pre-wake.ejs', {numbers: results});
    }
  );
});

app.get('/select_id/:id', (req, res) => {
  connection.query(
    'select id from times where number = ? and wake is null ',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('wake.ejs', {identification: results[0]});
    }
  );
});

app.listen(3000);