export default {
  bmi({ newEntity }) {
    const { height, weight } = newEntity || {}
    if (!height || !weight) return null
    return weight / (height * height)
  },
}
