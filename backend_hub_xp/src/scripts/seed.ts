import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

const MONGODB_URI = 'mongodb://localhost:27017/ecommerce';
async function seed() {
  const client = await MongoClient.connect(MONGODB_URI || '');
  const db = client.db();

  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('orders').deleteMany({});

  const categories = Array(5)
    .fill(null)
    .map(() => ({
      name: faker.commerce.department(),
    }));

  const insertedCategories = await db
    .collection('categories')
    .insertMany(categories);
  const categoryIds = Object.values(insertedCategories.insertedIds);

  const products = Array(20)
    .fill(null)
    .map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      categoryIds: faker.helpers.arrayElements(
        categoryIds,
        faker.number.int({ min: 1, max: 3 }),
      ),
      imageUrl: faker.image.url(),
    }));

  const insertedProducts = await db.collection('products').insertMany(products);
  const productIds = Object.values(insertedProducts.insertedIds);

  const orders = Array(10)
    .fill(null)
    .map(() => ({
      date: faker.date.recent(),
      productIds: faker.helpers.arrayElements(
        productIds,
        faker.number.int({ min: 1, max: 5 }),
      ),
      total: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
    }));

  await db.collection('orders').insertMany(orders);

  await client.close();
  console.log('Seed concluído com sucesso!');
}

seed().catch(console.error);
