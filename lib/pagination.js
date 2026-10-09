function pagination(req, res, next) {
	const itens = parseInt(req.query.itens, 10);
	const page = parseInt(req.query.page, 10);
	req.itens = itens > 0 ? itens : 5;
	req.page = page > 1 ? page - 1 : 0;
	req.offset = req.page * req.itens;
	next();
}

module.exports = pagination;
