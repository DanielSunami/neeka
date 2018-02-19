var nodemailer = require('nodemailer'),
	smtpOptions = {
		pool: true,
		host: NEEKA.smtp_host,
		port: NEEKA.smtp_port,
		secure: NEEKA.smtp_secure,
		auth: {
			user: NEEKA.smtp_user,
			pass: NEEKA.smtp_pass
		}
	};

/*
var
chunk = JSON.stringify({tipo: 'confirm', dest: 'danielsunami@gmail.com', data: JSON.stringify({nome: 'Daniel Santana'})});
*/
transporter = nodemailer.createTransport(smtpOptions, { from: NEEKA.name+' <'+NEEKA.smtp_user+'>'} );
var templates = {
	sys: function(obj){
		return {
			to: obj.dest,
			subject: NEEKA.name+' - Sys',
			text: obj.msg
		}
	},
	forgot: function(obj){
		return {
			to: obj.dest,
			subject: NEEKA.name+' - Recuperação de senha',
			text: 'Olá, '+obj.nome+',\n\nPara criar outra senha acesso o link abaixo:\n '+NEEKA.url+'/forgot/'+obj.id,
			html: '<p>Olá, '+obj.nome+',</p><p>Para criar outra senha acesso o link abaixo:<br/><a href=http://"'+NEEKA.url+'/forgot/'+obj.id+'">http://'+NEEKA.url+'/forgot/'+obj.id+'</a></p>'
		}
	}
};

module.exports.sendMail = function (tipo, obj){
	transporter.sendMail(templates[tipo](obj), function (error, info){
		if (error) {
			console.log('Error occurred');
			console.log(error.message);
		}

		console.log('Message sent successfully!');
	});
}