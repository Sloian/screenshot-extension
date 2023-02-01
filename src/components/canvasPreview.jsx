
const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext('2d')


  console.log("тут")
  console.log(image.children[0].getContext('2d'))
  console.log(image.children)
  // console.log(image.children[1].getContext('2d'))
  console.log(ctx)

  console.log(canvas)


  if (!ctx) {
    throw new Error('No 2d context')
  }

  console.log(image.children[1])
  const scaleX = image.children[1].naturalWidth / image.children[1].width
  const scaleY = image.children[1].naturalHeight / image.children[1].height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY
  const rotateRads = rotate * TO_RADIANS
  const centerX = image.children[1].naturalWidth / 2
  const centerY = image.children[1].naturalHeight / 2

  ctx.save()
  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.rotate(rotateRads)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(image.children[1], 0, 0)
  ctx.drawImage(image.children[0], 0, 0)

  console.log(ctx)

  ctx.restore()
}
