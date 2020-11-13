class PoApi
{
	constructor(http) {
        this.http = http;
        this.URLS = {
            PONT_GRATIS: 'https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/pontGratisAzi',
            PONT_PREMIUM_FOTBAL: 'https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/fotbalAzi',
            PONT_PREMIUM_TENIS: 'https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/tenisAzi',
        }
    }
    
    fetchPontGratuit() {
        return this.get(this.URLS.PONT_GRATIS);
    }

    fetchPontPremiumFotbal() {

    }

    fetchPontPremiumTenis() {

    }

	get(url, api_parameter) {
		const http = this.http;

		return new Promise(function(resolve, reject) {
			const api_url =  + api_parameter;

			const api_call = http.get(api_url, function(api_res) { 
				let body_chunks = [];
			  	api_res.on('data', function(chunk) {
					body_chunks.push(chunk);
			  	});

			  	api_res.on('end', function() {
					let body = Buffer.concat(body_chunks);
					body = JSON.parse(body);

					if('error' in body)
						reject(body.error);
					else
						resolve(body);
			  	});
			});

			api_call.on('error', function(e) { 
				reject(e.message);
			});
		});
	}
}

module.exports = PoApi;