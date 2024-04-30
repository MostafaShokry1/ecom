import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import categoryModel from '../models/category.model.js'
import subcategoryModel from '../models/subcategory.model.js'

export const getSubcategory = catchAsyncError(async (req, res) => {
	const { subcategorySlug, categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug })
	if (!category) res.status(404).json({ message: 'Category not found' })
	const subcategory = await subcategoryModel.findOne({
		slug: subcategorySlug,
		category_id: category._id,
	})
	res.json({ subcategory })
})

export const getSubcategories = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug })
	if (!category) res.status(404).json({ message: 'Category not found' })
	const apiFeatures = new ApiFeatures(
		subcategoryModel.find({ category_id: category._id }),
		req.query
	).paginate(10)
	const subcategories = await apiFeatures.query
	res.json({ subcategories })
})

export const addSubcategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug })
	if (!category) res.status(404).json({ message: 'Category not found' })
	const subcategory = await subcategoryModel.create({
		...req.body,
		category_id: category._id,
	})
	res.status(201).json({ subcategory })
})

export const updateSubcategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug })
	if (!category) res.status(404).json({ message: 'Category not found' })
	const { subcategorySlug } = req.params
	const subcategory = await subcategoryModel.findOneAndUpdate(
		{ slug: subcategorySlug, category_id: category._id },
		req.body
	)
	res.status(201).json({ subcategory })
})

export const deleteSubcategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug })
	if (!category) res.status(404).json({ message: 'Category not found' })
	const { subcategorySlug } = req.params
	const subcategory = await subcategoryModel.findOneAndDelete({
		slug: subcategorySlug,
		category_id: category._id,
	})
	res.json({ subcategory })
})
