import api from '@/services/api'

const profileQuery = gql`
  query {
    tcProfile(where: { id: "2b394cf6-f589-46bb-993b-efbec6ef069a" }) {
      id
      name
      email
      phoneNumber
      birthDate
      sex
      height
      weight
      birthNumber
      birthDate
      usedBenefits {
        name
        date
      }
      discardedBenefits {
        name
        date
      }
      tcInsuranceCompany {
        id
        name
        code
        benefits {
          name
          description
          subsidy
          minIntervalDays
          type
          url
          condition {
            minAge
            maxAge
            sex
          }
        }
      }
    }
  }
`
const upsertProfileMutation = gql`
  mutation($data: TcProfileInput!) {
    upsertTcProfile(data: $data)
  }
`

export default {
  state: {
    tcProfile: null,
  },
  mutations: {
    setProfile(ctx, tcProfile) {
      ctx.tcProfile = tcProfile
    },
  },
  actions: {
    async init(ctx) {
      const { tcProfile } = await api.query({ query: profileQuery })
      if (!tcProfile) throw new Error('User profile not found!')
      ctx.commit('setProfile', tcProfile)
    },
    async upsertTcProfile(ctx, tcProfile) {
      await api.mutate({ mutation: upsertProfileMutation, variables: { data: tcProfile } })
      ctx.commit('setProfile', tcProfile)
    },
  },
}
