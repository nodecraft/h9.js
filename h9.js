'use strict';

/*
	Hostnine API documentation at https://cp.hostnine.com/api/docs/
*/

var request =  require('request'),
	querystring =  require('querystring');

module.exports = function(apiKey){
	var url = "https://cp.hostnine.com/api/",
		helpers = {
			request: function(module, data, callback){
				// default callback when no data exists
				if(callback === undefined && data !== undefined){
					callback = data;
					data = {};
				}
				data.module = module;
				data.api_key = apiKey;
				request({
					url: url + '?' + querystring.stringify(data),
					json: true
				},function(err, req, body){
					if(err){
						callback({
							type: 'request',
							error: err
						});
					}else{
						// all requests come back as 200. Any other status would be a result of their API being down
						if(req.statusCode === 200 && body !== null){
							// normalize by removing HTML and extra spaces.
							if(body.result){
								body.result = body.result.replace(/<[^>]*>?/gm, ' ').replace(/ +(?= )/g,'').trim();
							}
							if(body.success){
								body.success = helpers.parseBoolean(body.success);
							}
							// There is no better way to detect these issues
							switch(body.result){
								case "Invalid Reseller Central API Module selected.":
									callback({
										type: 'module',
										error: {
											message: 'Invalid module requested'
										}
									});
								break;
								case "Invalid Reseller Central API Key provided.":
								case "No Reseller Central API Key provided.":
									callback({
										type: 'apikey',
										error: {
											message: 'Invalid API Key provided'
										}
									});
								break;
								default:
									callback(null, body);
							}
						}else{
							callback({
								type: 'response',
								error:{
									message: 'Invalid response received',
									code: req.statusCode,
									body: body
								}
							});
						}
					}
				});
			},
			prepareFilter: function(input, data){
				var results = '';
				for(var filter in input){
					if( data == undefined || data.indexOf(filter) !== -1){
						results += '%' + filter + ':' + input[filter];
					}
				}
				return results;
			},
			stripNumberKeys: function(data){
				var out = {};
				for(var key in data){
					if(!this.isNumeric(key)){
						out[key] = data[key];
					}
				}
				return out;
			},
			parseBoolean: function(string){
				switch(string.toLowerCase()){
					case "true":
						return true;
					case "false":
					case null:
						return false;
					default:
						return Boolean(string);
				}
			},
			isNumeric: function(check){
				return !isNaN(parseInt(check));
			},
			// prevent references when extracting data while removing success and result data
			clone: function(data){
				data = JSON.parse(JSON.stringify(data));
				delete data.success;
				delete data.result;
				return data
			}
		};

	return {
		/*
	 		My Account Functions
		*/

		// https://cp.hostnine.com/api/docs/myaccount.html#viewMyAccount
		viewMyAccount: function(callback){
			helpers.request('viewMyAccount',function(err,results){
				if(err){
					callback(err);
				}else{
					var finalResults = helpers.stripNumberKeys(results);
					delete finalResults.success;
					callback(null, {
						success: results.success,
						data: finalResults
					});
				}
			});
		},

		// https://cp.hostnine.com/api/docs/myaccount.html#getMessages
		getMessages: function(data, callback){
			if(callback === undefined){
				callback = data;
				data = {};
			}
			helpers.request('getMessages', data, function(err,results){
				if(err){
					callback(err);
				}else{
					callback(null,{
						success: results.success,
						result: results.result,
						messages: results.sql
					});
				}
			});
		},

		// https://cp.hostnine.com/api/docs/myaccount.html#viewMessage
		viewMessage: function(messageId, callback){
			var data = {message_id: messageId};
			helpers.request('viewMessage',data,function(err, results){
				if(err){
					callback(err);
				}else{
					callback(null, {
						success: results.success,
						result: results.result,
						data: helpers.clone(results)
					});
				}
			});
		},


		// https://cp.hostnine.com/api/docs/myaccount.html#getNewsPosts
		getNewsPosts: function(limit, callback){
			var data = {};
			if(callback === undefined){
				callback = limit;
			}else{
				data.limit = limit;
			}
			helpers.request('getNewsPosts', data, function(err,results){
				if(err){
					callback(err);
				}else{
					callback(null, {
						success: results.success,
						result: results.result,
						posts: results.sql
					});
				}
			});
		},


		// https://cp.hostnine.com/api/docs/myaccount.html#viewNewsPost
		viewNewsPost: function(postId, callback){
			var data = {news_id: postId};
			helpers.request('viewNewsPost', data, function(err,results){
				if(err){
					callback(err);
				}else{
					callback(null, {
						success: results.success,
						result: results.result,
						data: helpers.clone(results)
					});
				}
			});
		},


		/*
	 		Account Functions
		*/

		// https://cp.hostnine.com/api/docs/accounts.html#getAccounts
		getAccounts: function(filters, callback){
			var data = {};
			if(callback === undefined){
				callback = filters;
			}else{
				// only when filters are set
				data.filters = helpers.prepareFilter(filters,["search", "status", "pack_id"]);
			}
			helpers.request('getAccounts', data, function(err,results){
				if(err){
					callback(err);
				}else{
					var finalResults = {
						success: results.success,
						result: results.result,
						data: {
							meta: {
								filters: results.filters,
								filtersstr: results.filtersstr,
								sort: results.sort,
								sortstr: results.sortstr,
							},
							total_accounts: results.accounts
						},
						accounts: []
					};
					for(var i in results.sql){
						finalResults['accounts'].push(helpers.stripNumberKeys(results.sql[i]));
					}
					callback(null, finalResults);
				}
			})
		},

		// https://cp.hostnine.com/api/docs/accounts.html#createAccount
		createAccount: function(data, callback){
			if(data.pack){
				if(helpers.isNumeric(data.pack)){
					data.pack_id = data.pack
				}else{
					data.package = data.pack;
				}
				delete data.pack;
			}
			helpers.request('createAccount', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#viewAccount
		viewAccount: function(domain, callback){
			var data ={};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('viewAccount', data , function(err, results){
				if(err){
					callback(err);
				}else{
					var finalResults = helpers.stripNumberKeys(results);
					delete finalResults.success;
					delete finalResults.result;
					callback(null,{
						success: results.success,
						result: results.result,
						data: finalResults
					});
				}
			});
		},

		// https://cp.hostnine.com/api/docs/accounts.html#modifyAccount
		modifyAccount: function(domain, data, callback){
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			if(data.pack){
				if(helpers.isNumeric(data.pack)){
					data.pack_id = data.pack
				}else{
					data.package = data.pack;
				}
				delete data.pack;
			}
			helpers.request('modifyAccount', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#changeAccountPassword
		changeAccountPassword: function(domain, password, callback){
			var data = {password:password};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('changeAccountPassword', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#changeAccountPackage
		changeAccountPackage: function(domain, pack, callback){
			var data = {};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			if(helpers.isNumeric(data.pack)){
				data.pack_id = pack
			}else{
				data.package = pack;
			}
			helpers.request('changeAccountPackage', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#suspendAccount
		suspendAccount: function(domain, reason, callback){
			var data = {reason:reason};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('suspendAccount', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#unsuspendAccount
		unsuspendAccount: function(domain, callback){
			var data = {};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('unsuspendAccount', data, callback);
		},

		// https://cp.hostnine.com/api/docs/accounts.html#terminateAccount
		terminateAccount: function(domain, callback){
			var data = {};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('terminateAccount', data, callback);
		},



		/*
	 		Location Functions
		*/

		// https://cp.hostnine.com/api/docs/locations.html#getLocations
		getLocations: function(callback){
			helpers.request('getLocations', function(err, results){
				if(err){
					callback(err);
				}else{
					callback(null,{
						success: results.success,
						locations: results.sql
					});
				}
			});
		},

		// https://cp.hostnine.com/api/docs/locations.html#getNetworkStatus
		getNetworkStatus: function(callback){
			helpers.request('getNetworkStatus', function(err, results){
				if(err){
					callback(err);
				}else{
					callback(null,{
						success: results.success,
						locations: results.sql
					});
				}
			});
		},



		/*
	 		Package Function
		*/

		// https://cp.hostnine.com/api/docs/packages.html#getPackages
		getPackages: function(callback){
			helpers.request('getPackages', function(err, results){
				if(err){
					callback(err);
				}else{
					callback(null,{
						success: results.success,
						packages: results.sql
					});
				}
			});
		},



		/*
	 		Migration Functions
		*/

		// https://cp.hostnine.com/api/docs/migrations.html#getMigrations
		getMigrations: function(callback){
			helpers.request('getMigrations', function(err,results){
				if(err){
					callback(err);
				}else{
					// fixes API quirk where results.sql isn't set when no migrations are present
					var migrations = [];
					if(results.sql){
						migrations = results.sql
					}
					callback(null,{
						success: results.success,
						migrations: migrations
					});
				}
			});
		},

		// https://cp.hostnine.com/api/docs/migrations.html#addMigration
		addMigration: function(domain, location, callback){
			var data = {};
			if(helpers.isNumeric(domain)){
				data.domain_id = domain
			}else{
				data.domain = domain;
			}
			if(helpers.isNumeric(location)){
				data.location_id = location
			}else{
				data.location = location;
			}
			helpers.request('addMigration', data, callback);
		},



		/*
	 		Scripts & Tools Functions
		*/

		// https://cp.hostnine.com/api/docs/migrations.html#fixPermissions
		fixPermissions: function(domain, callback){
			var data = {};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('fixPermissions', data, callback);
		},

		// https://cp.hostnine.com/api/docs/migrations.html#checkFirewallBan
		checkFirewallBan: function(ip, domain, callback){
			var data = {ip: ip};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('checkFirewallBan', data, callback);
		},

		// https://cp.hostnine.com/api/docs/migrations.html#removeFirewallBan
		removeFirewallBan: function(ip, domain, callback){
			var data = {ip: ip};
			if(helpers.isNumeric(domain)){
				data.domain_id  = domain
			}else{
				data.domain = domain;
			}
			helpers.request('removeFirewallBan', data, callback);
		}

	};
};