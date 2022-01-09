const { MongoClient, ObjectId } = require('mongodb');
const context = async () => {
	let db;
	try {
		const dbClient = new MongoClient(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		await dbClient.connect()
		db = dbClient.db(process.env.MONGODB_DB_NAME) // database name
		return {
			Docs: db.collection('docs'),
			Spaces: db.collection('spaces'),
			Blocks: db.collection('blocks')
		}
	} catch (e) {
		console.log('--->error while connecting via graphql context (db)', e)
	}
}

const ObjectifyId = (id) => {
	return new ObjectId(id);
}
const prepDocForSaving = (args) => {
	let doc = {};
	const { title, content } = args.input;
	const space_id = ObjectifyId(args.input.space_id);
	doc.title = title;
	doc.content = content;
	doc.space_id = space_id;
	return doc;
}

const docResolvers = {
	Query: {
		docs: async (_parent, _args, _context, _info) => {
			const { Docs, Spaces, Blocks } = await context()
			const docs = await Docs.find({}).toArray();
			return (docs.map(async (doc) => {
				doc.space = await Spaces.findOne(doc.space);
				doc.blocks = await Blocks.find({}).toArray();
				return doc;
			}))
		},
		async doc(_parent, _args, _context, _info) {
			const { Docs, Spaces, Blocks } = await context()
			const doc = await Docs.findOne(ObjectifyId(_args._id))
			doc.space = await Spaces.findOne(doc.space_id);
			doc.blocks = await Blocks.find({ doc_id: doc._id }).toArray();
			return doc;
		}
	},

	Mutation: {
		submitDoc: async (root, args, _context, info) => {
			const { Docs, Spaces } = await context();
			const docResponse = async (Docs, Spaces, id) => {
				const savedDoc = await Docs.findOne(ObjectifyId(id) )
				const docSpace = await Spaces.findOne(savedDoc.space_id)
				savedDoc.space = docSpace;
				return savedDoc;
			}

			if (args.input._id) {
				const res = await Docs.updateOne(
					{ _id: ObjectifyId(args.input._id) },
					{
						$set: {
							"title": args.input.title,
							"content": args.input.content,
						}
					}
				)
				return docResponse(Docs, Spaces, args.input._id);
			}
			const doc = prepDocForSaving(args);
			const res = await Docs.insertOne(doc)
			return docResponse(Docs, Spaces, res.insertedId);
		},
	},
}

module.exports = docResolvers;