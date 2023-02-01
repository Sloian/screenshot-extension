import { canvasPreview } from './canvasPreview'

let previewUrl = ''

export async function imgPreview(
  image,
  crop,
  scale = 1,
  rotate = 0,
  setImgCrop
) {
  const canvas = document.createElement('canvas')


  canvasPreview(image, canvas, crop, scale, rotate)
  previewUrl = canvas.toDataURL('image/jpeg')

  return setImgCrop(previewUrl)
}
