const { createConnection } = require('typeorm');

async function testConnection() {
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    
    // Using the updated port 5431 for host connection
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5431, // Updated port to match docker-compose.yml
      username: 'foodhub',
      password: 'foodhub_password',
      database: 'foodhub',
      entities: [],
      synchronize: false,
      logging: true,
    });
    
    console.log('Successfully connected to PostgreSQL database!');
    console.log('Connection details:', {
      type: connection.options.type,
      host: connection.options.host,
      port: connection.options.port,
      database: connection.options.database,
      username: connection.options.username,
    });
    
    await connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

testConnection();
