import rads from 'rads'
// import $store from '@/store'

const origin = window.origin
const uri = origin + '/api/api'

const client = rads.create({
  uri,
  headers() {
    const headers = {}
    // if ($store.state?.accessToken) headers.authorization = `Bearer ${$store.state.accessToken}`
    // if ($store.state?.tcUser?.id) headers['sap-dev-x-ms-client-principal-id'] = $store.state.tcUser?.id
    return headers
  },
})

export default client
