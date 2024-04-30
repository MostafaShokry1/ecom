import mongoose from 'mongoose'

const imageOnProductSchema = new mongoose.Schema({
	image_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'image',
	},
	product_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'product',
	},
})

imageOnProductSchema.pre(/find/, function (next) {
	this.populate('image_id')
	next()
})

imageOnProductSchema.pre(/delete/i, async function (next) {
	const toBeDeletedIOP = await imageOnProductModel.findOne(this._conditions)
	if (!toBeDeletedIOP) return next()
	await mongoose.model('image').findByIdAndDelete(toBeDeletedIOP.image_id._id)
})

const imageOnProductModel = mongoose.model(
	'imageOnProduct',
	imageOnProductSchema
)

export default imageOnProductModel
