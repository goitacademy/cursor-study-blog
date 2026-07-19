db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'studysprint');

const USER_VALIDATOR = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      name: { bsonType: 'string', description: 'User name is required' },
      email: { bsonType: 'string', description: 'User email is required' },
      password: { bsonType: 'string', description: 'User password is required' },
      role: { enum: ['admin', 'author'], description: 'Role must be admin or author' },
    },
  },
};

const BLOG_VALIDATOR = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['title', 'description', 'category', 'author', 'authorName', 'image'],
    properties: {
      title: { bsonType: 'string', description: 'Blog title is required' },
      description: { bsonType: 'string', description: 'Blog description is required' },
      category: { bsonType: 'string', description: 'Blog category is required' },
      author: { bsonType: 'objectId', description: 'Author ID is required' },
      authorName: { bsonType: 'string', description: 'Author name is required' },
      image: { bsonType: 'string', description: 'Blog image is required' },
    },
  },
};

const COMMENT_VALIDATOR = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'content', 'blog'],
    properties: {
      name: { bsonType: 'string', description: 'Commenter name is required' },
      content: { bsonType: 'string', description: 'Comment content is required' },
      blog: { bsonType: 'objectId', description: 'Blog ID is required' },
    },
  },
};

function ensureCollectionWithValidator(collectionName, validator) {
  const hasCollection = db.getCollectionNames().includes(collectionName);

  if (!hasCollection) {
    db.createCollection(collectionName, { validator: validator });
    print('Created collection: ' + collectionName);
    return;
  }

  db.runCommand({
    collMod: collectionName,
    validator: validator,
  });
  print('Updated validator for collection: ' + collectionName);
}

ensureCollectionWithValidator('users', USER_VALIDATOR);
ensureCollectionWithValidator('blogs', BLOG_VALIDATOR);
ensureCollectionWithValidator('comments', COMMENT_VALIDATOR);

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.blogs.createIndex({ title: 'text', description: 'text' });
db.blogs.createIndex({ category: 1 });
db.blogs.createIndex({ author: 1 });
db.blogs.createIndex({ createdAt: -1 });
db.blogs.createIndex({ author: 1, createdAt: -1 });
db.comments.createIndex({ blog: 1 });
db.comments.createIndex({ createdAt: -1 });
db.comments.createIndex({ blog: 1, createdAt: -1 });

print('Initialized database schema for ' + (process.env.MONGO_INITDB_DATABASE || 'studysprint'));
