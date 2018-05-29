/**
 * Permissions
 * @readonly
 * @enum {number}
 */
const PERMISSION = {
	"ADMIN":          0,
	"ALTER_USERS":    1,
	"CREATE_USERS":   2,
	"DELETE_USERS":   3,
	"READ_DB_CONF":   4,
	"WRITE_DB_CONF":  5,
	"READ_SETTINGS":  6,
	"WRITE_SETTINGS": 7
}

/**
 * @constructs PermissionGroup
 * @param {number[]} permissions - this needed permissions
 */
function PermissionGroup(permissions) {
	this.permissions = permissions;
	this.qtd = permissions.length;
	this.allow = function(test){
		var cont = 0;
		for(var i in this.permissions) {
			for(var x in test) {
				if(this.permissions[i] == test[x]) cont++;
			}
			
			if( cont == this.qtd && parseInt(i)+1 == this.qtd ) return true;
		}
		return false;
	}
}