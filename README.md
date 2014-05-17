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

My Account Functions
--------------------

If you need documentation on what the methods or data points are, I would recommend matching the methods here with the [API Docs](https://cp.hostnine.com/api/docs/)


### h9.viewMyAccount(callback) ###
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `messages`

### h9.getMessages(data, callback) ###
* `data` - *(optional) Object*
    * `page` - *(optional) Integer of current page*
    * `perPage` - *(optional) Integer of number results per page*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `messages`

### h9.viewMessage(messageId, callback) ###
* `messageId` - *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `data`

### javascript h9.getNewsPosts(limit, callback) ###
* `limit` - *(optional) Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `posts`

### h9.viewNewsPost(postID, callback) ###
* `postID`  - *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `data`


Accounts Functions
--------------------

### h9.getAccounts(filters, callback) ###
* `filters` - *(optional) Object*
    * `search` - *(optional) String*
    * `status` - *(optional) Integer*
    * `pack_id` - *(optional) Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `data`
        * `meta`
            * `filters`
            * `filtersstr`
            * `sort`
            * `sortstr`
        * `accounts`

### h9.createAccount(data, callback) ###
* `data` - *Object*
    * `domain` - *String*
    * `username - *String*`
    * `password - *String*`
    * `location - *String*`
    * `pack - *String* OR *Integer*`
    * `contact` - *(optional) String*
    * `skeleton` - *(optional) String*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.viewAccount(domain, callback) ###
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`
        * `data`

### h9.modifyAccount(domain, data, callback) ###
* `domain` - *String* OR *Integer*
* `data` - *Object*
    * `domain` - *(optional) String*
    * `username - *(optional) String*`
    * `password - *(optional) String*`
    * `location - *(optional) String*`
    * `pack - *(optional) String* OR *Integer*`
    * `quota - *(optional) Integer*`
    * `bandwidth - *(optional) Integer*`
    * `theme - *(optional) String*`
    * `ns1 - *(optional) String*`
    * `nss - *(optional) String*`
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.changeAccountPassword(domain, password, callback) ###
* `domain` - *String* OR *Integer*
* `password` - *String*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.changeAccountPackage(domain, package, callback) ###
* `domain` - *String* OR *Integer*
* `package` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.suspendAccount(domain, reason, callback) ###
* `domain` - *String* OR *Integer*
* `reason` - *String*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.unsuspendAccount(domain, callback) ###
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

### h9.terminateAccount(domain, callback) ###
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `results`

Accounts Functions
--------------------

### h9.getLocations(callback) ###
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `locations`

### h9.getNetworkStatus(callback) ###
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `locations`

Package Function
--------------------

### h9.getPackages(callback) ###
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `packages`

Migration Functions
--------------------

### h9.getMigrations(callback) ###
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `migrations`

### h9.addMigration(domain, location, callback) ###
* `domain` - *String* OR *Integer*
* `location` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `result`

Screens & Tools Functions
--------------------

### h9.fixPermissions(domain, callback) ###
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `result`

### h9.checkFirewallBan(ip, domain, callback) ###
* `ip` - *String*
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `result`

### h9.removeFirewallBan(ip, domain, callback) ###
* `ip` - *String*
* `domain` - *String* OR *Integer*
* `callback` - *Object*
    * `err` - *Error Object*
    * `results` - *Object*
        * `success`
        * `result`
