const { MongoClient, ObjectId } = require('mongodb');
const context = async () => {
	let db;
	try {
		const dbClient = new MongoClient(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		await dbClient.connect()
		db = dbClient.db('near') // database name
		return { Users: db.collection('users') }
	} catch (e) {
		console.log('--->error while connecting via graphql context (db)', e)
	}
}

const ObjectifyId = (id) => {
	return new ObjectId(id);
}

const userResolvers = {
	Query: {
		users: async (_parent, _args, _context, _info) => {
			const { Users } = await context()
			return (Users.find({}).toArray())
		},
		async user(_parent, _args, _context, _info) {
			const data = await context()
			return data.findOne(ObjectifyId(_args._id))
		}
	},
	Mutation: {
		submitUser: async (root, args, _context, info) => {
			const { Users } = await context();
			if (args.input.externalId) {
				console.log("Updating User");
				const res = await Users.findOneAndUpdate(
					{ externalId: args.input.externalId, externalProvider: "Google" },
					{
						$set: {
							"name": args.input.name,
							"picture": args.input.picture,
						}
					}
				)
				if (res.value === null) {
					await Users.insertOne(args.input)
				}
				return (await Users.findOne({ externalId: args.input.externalId, externalProvider: "Google" }))
			}
			const res = await Users.insertOne(args.input)
			return (await Users.findOne({ _id: res.insertedId }))
		},
	},
}

module.exports = userResolvers;