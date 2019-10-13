const { ApolloServer, gql } = require("apollo-server")
const AWS = require("aws-sdk")
const fs = require("fs")

// Import AWS access credentials from JSON file
AWS.config.loadFromPath("./credentials.json")

// Configure aws-sdk to use Wasabi custom endpoint
const ep = new AWS.Endpoint("s3.wasabisys.com")
const s3 = new AWS.S3({ endpoint: ep })

// Define Type Definitions and Mutation Resolvers
const typeDefs = gql`
  # Type Definitions
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    _: Boolean
  }
  # Mutation resolvers
  type Mutation {
    singleUpload(file: Upload!): File!
    singleUploadStream(file: Upload!): File!
  }
`
// File upload resolvers
const resolvers = {
  Mutation: {
    //   Upload file to local storage
    singleUpload: (parent, args) => {
      return args.file.then(file => {
        const { createReadStream, filename, mimetype } = file
        const fileStream = createReadStream()
        fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))
        return file
      })
    },
    // Async upload file to Wasabi S3
    singleUploadStream: async (parent, args) => {
      const file = await args.file
      const { createReadStream, filename, mimetype } = file
      const fileStream = createReadStream()
      // Define upload parameters
      const uploadParams = {
        Bucket: "graphql-react-uploader",
        Key: filename,
        Body: fileStream,
      }
      //   Await and then log the result
      const result = await s3.upload(uploadParams).promise()
      console.log(result)
      return file
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`\`🚀 Server ready at ${url}`)
})
