import { createServerlessHandler } from 'rads-server'
import entities from './entities/entities'
// import features from './features'

JSON.parseSafe = function(arg1, ...args) {
  try {
    if (!arg1) return null
    if (!_.isString(arg1)) return arg1
    return JSON.parse(arg1, ...args)
  } catch (e) {
    console.warn('Error while parsing JSON', e)
    return null
  }
}

export default createServerlessHandler({
  entities,
  // features: [],
  cosmosDb: getCosmosDbOptions(),
})

function getCosmosDbOptions() {
  return {
    masterKey: 'n3XfNWetkYl8cpy3PD7CM0vmi3iLNbZZE4NRpSB9p16l6xox2lP6RFjnxIDuXHsgY4iyAIyWo1vGF2isBCfoVw==',
    accountId: 'cosmograph-test',
    databaseId: 'cosmograph-test',
    collectionId: 'cosmograph-test',

    // masterKey: '8Zjo9SQYez57q2ji7zpNmpXBCZnNmzOHOsHuSe93P4t79cdgS3nHtD2A8uBeI3YhtuhlABzqJPHKblwhUCfuxA==',
    // accountId: 'tc-incenter2-server-db',
    // databaseId: 'i2',
    // collectionId: 'main',
  }
}
