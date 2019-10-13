const typeDefs = gql`
type File {
    filename: String!
    mimetype: String!
    encoding: String!
}

type Query {
    _ : Boolean // Added here to satisfy requirements of having at least on query defined
}

type Mutation {
    singleUpload(file: Upload!) File!,
    singleUploadStream(file: upload!): File!
}
`
