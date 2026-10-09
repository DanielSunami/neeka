const crypto = require('crypto')
const bcrypt = require('bcryptjs')

// faz o trim de todos os campos possíveis
function bodyTrim(req, res, next) {
	Object.keys(req.body).map(k =>
		req.body[k] = (typeof req.body[k] == 'string')
		  ? req.body[k].trim()
		  : req.body[k]
	)

	return next();
}

function generateKey() {
	return crypto.randomBytes(8)
	  .toString('hex')
	  .toUpperCase()
	  .split('')
	  .map((v, i) => (((i + 1) % 4 === 0) && (i < 15)) ? `${v}-` : v)
	  .join('')
}

// https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

// remove keys from obj that aren't in 'validKeys'
function removeInvalidKeys(obj, validKeys) {
	Object.keys(obj).forEach((key) => validKeys.includes(key) || delete obj[key]);	
}

function randomId() {
	return crypto.randomBytes(16).toString('hex');
}

function hashPassword(senha) {
	return bcrypt.hashSync(senha, 10);
}

function checkPassword(senha, hash) {
	if (!senha || !hash) return false;
	return bcrypt.compareSync(senha, hash);
}

function today(){
	return new Date(new Date().toDateString());
}

module.exports = {
	bodyTrim,
	generateKey,
	randomId,
	requireUncached,
	removeInvalidKeys,
	hashPassword,
	checkPassword,
	today
}
