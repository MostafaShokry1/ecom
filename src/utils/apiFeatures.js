export class ApiFeatures {
	constructor(query, reqQuery) {
		this.query = query
		this.reqQuery = reqQuery
	}

	paginate(pageSize = 5) {
		let page = +this.reqQuery?.page || 1
		if (page < 1) page = 1
		this.query = this.query.skip((page - 1) * pageSize).limit(pageSize)
		return this
	}

	filter() {
		const filterFields = { ...this.reqQuery }
		const exclusionList = ['page', 'sort', 'keyword', 'fields', 'dir']
		exclusionList.forEach((item) => {
			delete filterFields[item]
		})
		const filterFieldsString = JSON.stringify(filterFields)
		const modifiedFilterFieldsString = filterFieldsString.replace(
			/(lt|lte|gt|gte)/g,
			(match) => `$${match}`
		)
		const modifiedFilterFields = JSON.parse(modifiedFilterFieldsString)
		this.query.find(modifiedFilterFields)
		return this
	}

	sort() {
		if (!this.reqQuery.sort) return this
		this.query.sort(this.reqQuery.sort)
		return this
	}

	search(fieldsToSearch) {
		if (!this.reqQuery.keyword) return this
		const regex = new RegExp(this.reqQuery.keyword, 'i')
		let regexQuery = fieldsToSearch.map((field) => {
			return { [field]: regex }
		})
		regexQuery = { $or: regexQuery }
		this.query.find(regexQuery)
		return this
	}

	fields() {
		if (!this.reqQuery.fields) return this
		this.query.select(this.reqQuery.fields.split(','))
		return this
	}
}
