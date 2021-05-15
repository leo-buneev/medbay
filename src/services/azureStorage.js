import { BlobServiceClient } from '@azure/storage-blob'

const account = 'radssample'

// TODO: to be safer, this SAS should come from server different for each user
const sharedAccessSignature =
  'sp=racwdl&st=2021-05-15T04:55:58Z&se=2021-06-26T04:55:00Z&sv=2020-02-10&sr=c&sig=HVHqWcaEZCwumsBBmUQB%2BZIlN5290q4ADB8tqMdYtzQ%3D'

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net?${sharedAccessSignature}`)

const containerNames = ['medkit']

export default {
  async upload(containerName, filename, content, contentType) {
    if (!containerNames.includes(containerName)) {
      throw new Error('Container name should be one of: ' + containerNames.join(', '))
    }
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(filename)

    await blockBlobClient.upload(content, content.size || content.length, {
      blobHTTPHeaders: {
        blobContentType: contentType || content.type || undefined,
        blobCacheControl: 'max-age=0, no-cache',
      },
    })

    // Storing absolute URLs is better than relative ones - more reliable when you want to send
    // image link to e.g. external system or email
    return getUrl(containerName, filename)
  },
}

function getUrl(containerName, filename) {
  return `https://${account}.blob.core.windows.net/${containerName}/${filename}`
}
