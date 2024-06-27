import { db } from './db.mjs';
import { Meme, Round } from './gameModel.mjs';

export const getRound = (first, second) => {
  return new Promise((resolve, reject) => {
    let parms = [];
    let sql = 'SELECT url, name, answer1, answer2, id FROM memes ORDER BY RANDOM() LIMIT 1';
    if (first !== undefined && second !== undefined){
      sql = 'SELECT url, name, answer1, answer2, id FROM memes WHERE id <> ? AND id <> ? ORDER BY RANDOM() LIMIT 1';
      parms = [first, second];
    } else if (first !== undefined && second === undefined){
      sql = 'SELECT url, name, answer1, answer2, id FROM memes WHERE id <> ? ORDER BY RANDOM() LIMIT 1';
      parms = [first];
    }
    db.all(sql, parms, (err, rows) => {
      if (err)
        reject(err);
      else {
        const meme = new Meme(rows[0].url, rows[0].name, rows[0].answer1, rows[0].answer2, rows[0].id);
        db.all('SELECT * FROM captions WHERE caption <> ? AND caption <> ? ORDER BY RANDOM() LIMIT 5', [meme.answer1, meme.answer2], (err, captions) => {
          if (err)
            reject(err);
          else {
            const cap = captions.map(caption => caption.caption).concat([meme.answer1, meme.answer2]).sort(() => Math.random() - 0.5);
            const round = new Round(meme.url, cap, meme.answer1, meme.answer2, meme.name, meme.imageId);
            resolve(round);
          }
        });
      }
    });
  });
}

export const saveGame = (score, userId, rounds) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games(userid, score, url, correct) VALUES(?, ?, ?, ?), (?, ?, ?, ?), (?,?,?,?)';
    db.run(sql, [userId, score, rounds[0].meme, rounds[0].correct, userId, score, rounds[1].meme, rounds[1].correct, userId, score, rounds[2].meme, rounds[2].correct ], (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
}

export const getUserGames = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE userId = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows);
    });
  });
}
export const validateAnswer = (id, answer) =>{
  return new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM memes WHERE id = ?';
  db.get(sql,[id], (err, row) => {
    if (err)
      reject(err);
    else {
      if (row && (row.answer1 === answer || row.answer2 === answer)) {
        resolve({valid: true, answer1: row.answer1, answer2: row.answer2});
      } else {
        resolve({valid: false, answer1: row.answer1, answer2: row.answer2});
      }
    }
  });
  });
}

export const getLeaderboard = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games ORDER BY score DESC LIMIT 10';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows);
    });
  });
}
export const reset = () => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM games';
    db.run(sql, [], (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
}

