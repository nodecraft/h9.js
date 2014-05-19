h9.js
=====

    npm install h9


h9.js - Node.js Wrapper for the [HostNine API](https://cp.hostnine.com/api/docs/)

This wrapper attemps to normalize the HostNine API that is provided to Resellers. The following coding practices are employed to make this API as flexible as possible.

 * Any domains lookups may use the domain ID OR the domain name
 * Any package lookups may use the package id OR package name. Any time the package is referenced in an object you may directly reference the ID with `package_id`, the package name with `package` or automatically lookup the package with `pack`
 * Most location lookups may use the location ID OR location name. The only exception is for `createAccount` method.

Each callback returns data with the following practices:

 * The `success` attribute is always persistant on all requests
 * The `result` attribute is persistant on most requests. This is passed through based on the API results
 * Any singular data points are assigned to the `data` attribute
 * Any listed array based data will be listed based on the method used. For example getAccounts will return `accounts`.
 * All errors return a `message` attrible useful for user friendly errors.


Code Examples
-------------
```javascript
   var h9 = require('h9')('API-KEY-GOES-HERE');
   
   // list all active accounts 
   h9.getAccounts({status:1},function(err, results){
       if(err){
           console.error(err)
       }else{
           if(results.success){
               console.log('Accounts:', results.accounts);
           }else{
               console.log('Failed to list accounts:', results.result);
           }
       }
   });
   
   // create new account (note this normally takes several seconds to complete) https://cp.hostnine.com/api/docs/accounts.html#createAccount
   h9.createAccount({
       domain: 'exampledomain.com',
       username: 'username',
       password: 'ChangeThisPassword',
       location: '(US) Central)',
       pack_id: 'PackageName',
       contact: 'example@email.com'
   },function(err,results){
        if(results.success){
            console.log('Account Created');
        }else{
            console.error('Failed to create account with error: '+results.result);
        }
   });
   
   
   // view account https://cp.hostnine.com/api/docs/accounts.html#viewAccount
   h9.viewAccount('exampledomain.com',function(err,results){
        if(results.success){
            console.log('Account Created');
        }else{
            console.error('Failed to create account with error: '+results.result);
        }
   });
   
   // edit account https://cp.hostnine.com/api/docs/accounts.html#modifyAccount
   h9.modifyAccount('exampledomain.com',{
       quota: 1024*50
   },function(err,results){
        if(results.success){
            console.log('Account Created');
        }else{
            console.error('Failed to create account with error: '+results.result);
        }
   });
   
   // fix permissions https://cp.hostnine.com/api/docs/scriptstools.html#fixPermissions
   h9.fixPermissions('exampledomain.com',function(err,results){
        if(results.success){
            console.log('Account permissions fixed');
        }else{
            console.error('Failed to fix communications with error: '+results.result);
        }
   });
```

Documentation
--------------------

If you need documentation on what the methods or data points are, I would recommend matching the methods here with the [API Docs](https://cp.hostnine.com/api/docs/). Each page is separate into functions depending on their grouping.

* [Accounts Functions](https://github.com/nodecraft/h9.js/wiki/Accounts-Functions)
* [Locations Functions](https://github.com/nodecraft/h9.js/wiki/Locations-Functions)
* [Migration Functions](https://github.com/nodecraft/h9.js/wiki/Migration-Functions)
* [My Account Functions](https://github.com/nodecraft/h9.js/wiki/My-Account-Functions)
* [Package Function](https://github.com/nodecraft/h9.js/wiki/Package-Function)
* [Scripts & Tools Functions](https://github.com/nodecraft/h9.js/wiki/Scripts-&-Tools-Functions)
