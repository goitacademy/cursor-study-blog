db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'studysprint');

const username = process.env.MONGO_INITDB_ROOT_USERNAME || 'studysprint';
const password = process.env.MONGO_INITDB_ROOT_PASSWORD || 'studysprint123';
const database = process.env.MONGO_INITDB_DATABASE || 'studysprint';

const userConfig = {
  pwd: password,
  roles: [
    {
      role: 'readWrite',
      db: database,
    },
  ],
};

if (db.getUser(username)) {
  db.updateUser(username, userConfig);
  print('Updated app user: ' + username + ' for database: ' + database);
} else {
  db.createUser({
    user: username,
    ...userConfig,
  });
  print('Created app user: ' + username + ' for database: ' + database);
}

