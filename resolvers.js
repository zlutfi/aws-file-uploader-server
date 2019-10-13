const resolvers = {
  Mutation: {
    //   Create mutation for single file upload to local
    singleUpload: (parent, args) => {
      return args.file.then(file => {
        // Define file
        const { createReadStream, filename, mimetype } = file
        // Define filestream
        const fileStream = createReadStream()
        // Specific upload location
        fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))
        // Return the result
        return file
      })
    },
    // Create mutation for single file upload to s3
    singleUploadStream: async (parent, args) => {
      const file = await args.file
      const { createReadStream, filename, mimetype } = file
      const fileStream = createReadStream()

      // Stream this to S3
      const uploadParams = {
        Bucket: "graphql-react-uploader", // Bucket name here
        Key: filename,
        Body: fileStream,
      }
      const result = await s3.upload(uploadParams).promise()
      // Log thhis result to the console
      console.log(result)

      return file
    },
  },
}
