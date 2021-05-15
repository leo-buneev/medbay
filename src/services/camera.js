import { Plugins, CameraResultType } from '@capacitor/core'

const { Camera } = Plugins

export default {
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    })
    return image.base64String
  },
}
