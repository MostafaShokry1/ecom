import { uploadImage } from '../../../utils/image.js'
import imageModel from '../models/image.model.js'

export const makeImage = async (path) => {
	const { imageName, imageUrl } = await uploadImage(path)
	return await imageModel.create({ name: imageName, path: imageUrl })
}
