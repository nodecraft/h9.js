h9.js
=====

h9.js - Node.js Wrapper for the [HostNine API](https://cp.hostnine.com/api/docs/)

This wrapper attemps to normalize the HostNine API that is provided to Resellers. The following coding practices are employed to make this API as flexible as possible.

 * Any domains looksups may use the domain ID or the domain name
 * Any package lookups may use the package id OR package name. Any time the package is referenced in an object you may directly reference the ID with `package_id`, the package name with `package` or automatically lookup the package with `pack`
 * Most location lookups may use the location ID or location name. The only exception is for `createAccount` method.

Each callback returns data with the following practices:

 * The `success` attribute is always persistant on all requests
 * The `result` attribute is persistant on most requests. This is passed through based on the APi results
 * Any singular data points are assigned to the `data` attribute
 * Any listed array based data will be listed based on the method used. For example getAccounts will return `accounts`.
 * All errors return a `message` attrible useful for user friendly errors.


Code Examples
-------------
```javascript
   var h9 = require('h9');
   
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
   
   // create new account, (note this normally takes several seconds to complete) https://cp.hostnine.com/api/docs/accounts.html#createAccount
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

Methods
------------

### My Account Functions ###

```javascript
    h9.viewMyAccount(callback)
```

`callback` with success and data object

```javascript    
    h9.getMessages(data,callback)
```
`data` (optional) Object `{page:1,perPage:50}`
`callback` with success and messages object

```javascript    
    h9.getMessages(messageId,callback)
```
`messageId` unique message ID
`callback` with success and data object

```javascript
    h9.getNewsPosts(limit,callback)
```
`limit` (optional) limit number of posts
`callback` with success and posts object

```javascript
    h9.viewNewsPost(postID,callback)
```
`postID` unique news post ID
`callback` with success and data object

### Accounts Functions ###

```javascript
    h9.getAccounts(filters,callback)
```
`filters` optional filters `{search: 'Search Terms', status: 1, pack_id: 1234}`
`callback` with success, result, meta, total_accoutns, and accounts objects

```javascript
    h9.createAccount(data,callback)
```
`data` as an object containing `domain`, `username`, `password`, `location`, `pack` and optionally `contact` and `skeleton` 
`callback` with success, result, meta, total_accoutns, and accounts objects

```javascript
    h9.viewAccount(domain,callback)
```
`domain` string or ID of domain to view
`callback` with success, result, and data
