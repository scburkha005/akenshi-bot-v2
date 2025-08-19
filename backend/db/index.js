import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

async function startDB() {
	try {
		await client.connect();

		await client.db('akenshiBotDB').command({ ping: 1 });
		console.log("Successfully connected")
	} catch (err) {
		console.log(err)
	} finally {
		// await client.close();
	}
}

startDB();

export default client;