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
		return { Spaces: db.collection('spaces'), Docs: db.collection('docs') }
	} catch (e) {
		console.log('--->error while connecting via graphql context (db)', e)
	}
}

const ObjectifyId = (id) => {
	return new ObjectId(id);
}

const spaceResolvers = {
	Query: {
		spaces: async (_parent, _args, _context, _info) => {
			const { Spaces, Docs } = await context()
			const spaces = await Spaces.find({}).toArray();			
			return (spaces.map(async (space) => {
				const docs = await Docs.find({space_id: space._id}).toArray();
				space.docs = docs;
				return space
			}))
		},
		space: async (_parent, _args, _context, _info) => {
			const { Spaces, Docs } = await context()
			const id = ObjectifyId(_args._id);
			const space =  await Spaces.findOne(id);
			const docs = await Docs.find({space_id: id}).toArray();
			space.docs = docs;
			return space;
		}
	},
	Mutation: {
		submitSpace: async (root, args, _context, info) => {
			const { Spaces } = await context();
			if (args.input._id) {				
				const res = await Spaces.updateOne(
					{ _id: ObjectifyId(args.input._id) },
					{
						$set: {
							"name": args.input.name,
							"public": args.input.public,
						}
					}
				)
				return (await Spaces.findOne({ _id: ObjectifyId(args.input._id) }))
			}
			const res = await Spaces.insertOne(args.input)
			return (await Spaces.findOne({ _id: res.insertedId }))
		},
	},
}

module.exports = spaceResolvers;