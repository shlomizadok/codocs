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

const prepareBlockForSaving = (args) => {
  let block = {};
	const { content, contentType, order } = args;
	const doc_id = ObjectifyId(args.doc_id);
	block.contentType = contentType;
	block.content = content;
	block.doc_id = doc_id;
	block.order = order;
	return block;
}

const blockResolvers = {
  Query: {
    async block(_parent, _args, _context, _info) {
			const { Docs, Spaces, Blocks } = await context()
			const block = await Blocks.findOne(ObjectifyId(_args._id))
      if (block)
			  block.doc = await Docs.findOne(block.doc)
			return block;
		}
  },

  Mutation: {
    submitBlock: async (root, args, _context, info) => {
			const { Docs, Blocks } = await context();

      const blockResponse = async (Blocks, Docs, id) => {
				const savedBlock = await Blocks.findOne(ObjectifyId(id) )
				const blockDoc = await Docs.findOne(savedBlock.doc_id)
				savedBlock.doc = blockDoc;
				return savedBlock;
			}

			if (args.input._id) {
				const res = await Blocks.updateOne(
					{ _id: ObjectifyId(args.input._id) },
					{
						$set: {
							"content": args.input.content,
						}
					}
				)
				return blockResponse(Blocks, Docs, args.input._id);
			}
      const block = prepareBlockForSaving(args.input)
			const res = await Blocks.insertOne(block)
			return blockResponse(Blocks, Docs, res.insertedId);
		},
  },
}

module.exports = blockResolvers;