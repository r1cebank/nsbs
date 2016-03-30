# nsbs
[![Code Climate](https://codeclimate.com/github/r1cebank/nsbs/badges/gpa.svg)](https://codeclimate.com/github/r1cebank/nsbs)
[![Test Coverage](https://codeclimate.com/github/r1cebank/nsbs/badges/coverage.svg)](https://codeclimate.com/github/r1cebank/nsbs/coverage)
[![Circle CI](https://circleci.com/gh/r1cebank/nsbs.svg?style=svg)](https://circleci.com/gh/r1cebank/nsbs)
[![Dependencies] (https://david-dm.org/r1cebank/nsbs.svg)](https://david-dm.org/r1cebank/nsbs.svg)
[![Inline docs](http://inch-ci.org/github/r1cebank/nsbs.svg?branch=master)](http://inch-ci.org/github/r1cebank/nsbs)

Node bucket-like storage

0. [Install](#install)
1. [Usage](#usage)
  0. [Importing](#importing)
  1. [Create nsbs object](#create-nsbs-object)
  2. [Create new bucket](#create-new-bucket)
  3. [Check bucket existance](#bucket-exist)
  4. [Remove bucket](#remove-bucket)
  5. [Adding items](#adding-items)
  6. [List collection](#list-collection)
  7. [Getting item](#gettng-item)
  8. [List items](#list-items)
  9. [List buckets](#list-buckets)
  10. [Update items](#update-items)
  11. [Delete item](#delete-item)
2. [About nsbs](#about)
3. [Next Steps](#next-steps)
4. [Test](#test)
5. [License](#license)

## Install

To start using nsbs, simply run

```npm i -S nsbs```

(* **i** is a shorthand for install and **S** is shorthand for save) 

## Usage

> To use this module, make sure you have node.js v4.0+ installed on your maching, to manage your node versions better, try [n](https://github.com/tj/n) the node module management tool.

### Importing
```javascript
// ES6
import nsbs from 'nsbs';
// ES5
var nsbs = require('nsbs');
```
### Create nsbs object
A **nsbs** object is needed to start storing and retreiving data with nsbs. You can have as many nsbs object you want. (* just make sure they point to differnet directories)

```javascript
const database = new nsbs(options)
```
#### options
* databasePath: absolute path for the database (required)

### Create new bucket
Before you add item to the database, you need to have at least one bucket created

```javascript
database.newBucket(bucket)
```
This returns a promise resolve with [Object] that include the information of the created bucket

#### bucket
The name of your bucket (required)

### Remove bucket
When you want to destroy everything inside a bucket, you can choose to remove the bucket from the database

```javascript
database.removeBucket(bucket)
```
This returns a promise resolve with integer, if integer == 0 it means the deletion failed, if integer is >= 1, it means the deletion has succeeded.

#### bucket
The name of your bucket (required)

### Bucket Exist
If you want to check if a bucket exist in the system, you can use this to check

```javascript
database.existBucket(bucket)
```
This returns a promise resolve with a Boolean, true for exist and false for not exist.

#### bucket
The name of your bucket (required)


### Adding items
**nsbs** is a bucket-like storage. Which means when you store an object, it needs to go to a group, and that group belongs to a bucket. When you add a item to the bucket, you must specify a collection that item belongs to. When the collection does not exist, it will be automatically created.

```javascript
database.addItem(bucket, collection, object)
```
This returns a promise that resolve a [Object] which is the document that have been inserted to the db.

#### bucket
The bucket you want to store this item's collection (required)

#### collection
The collection you want to store the item (required)

#### object
The object you are storing (required)

#### Example
```javascript
database.addItem('app-1', 'files', {filename: 'file.png'})
```

### List collection
Sometimes its a nice idea to list all the collection in a bucket, you can do it using:

```javascript
database.listCollection(bucket)
```
This returns a promise resolves with an array of collections.

#### bucket
The name of your bucket (required)

### Getting item
When you want to retrieve an item from a collection

```javascript
database.getItem(bucket, collection, query)
```
This returns a promise that will resolve either [Object] if your query is matched with an item in the collection or null of no item is matched

#### bucket
The name of your bucket (required)

#### collection
The name of your collection (required)

#### query
The query object for this collection (required)

#### example

```javascript
database.getItem('app-1', 'files', '{name: 'file.png'}')
```

### List items
When you want to retrieve all the items with in the collection, you can:

```javascript
database.listItems(bucket, collection)
```
This returns a promise what resolve with a array of objects in that collection, if the collection does not exist or there is no object in the collection, it will resolve with empty array.

#### bucket
The name of your bucket (required)

#### collection
The name of your collection (required)


### List buckets
You can list all the buckets in the database using:

```javascript
database.listBuckets()
```
This returns a promise that resolves an array which include all the buckets in the system. If no buckets are created, it will resolve into empty array.

### Update item
When you want to update an existing item:

```javascript
database.updateItem(bucket, collection, query, newDocument)
```
This will return a promise which will resolve into an array of document thats been updated.

* note that this update is using a upsert method, if item does not exist, it will simply insert the item into the collection.

#### bucket
The name of your bucket (required)

#### collection
The name of your collection (required)

#### query
The query object for this collection (required)

#### newDocument
The object for the new document that will replace the one you are updating

#### example

```javascript
database.updateItem('app-1', 'files', {name: test.png}, {name: test.png, path: '/new/file/path.png'})
```

### Delete item
You can delete existing object from the collection using:

```javascript
database.deleteItem(bucket, collection, query)
```
This returns a promise which resolves into an integer that indicate the number of document got deleted by this query.

#### bucket
The name of your bucket (required)

#### collection
The name of your collection (required)

#### query
The query object for this collection (required)

## About

**nsbs** is build to replace the mess in the current build of [yaas](https://github.com/r1cebank/yaas) the asset server. Currently it is using [Tingodb](https://github.com/sergeyksv/tingodb) as its datastorage engine. nsbs will create a layer on top of Tingodb and expose some very simple APIs to be used in a server environment.

**nsbs** is not a replacement for anything, most of the time it is better to use [Tingodb](https://github.com/sergeyksv/tingodb) or Mongodb my itself. I created **nsbs** for the purpose of rewritting yaas completely. And **nsbs** will be used to demonstrate how build anthing as a plugin for the new yaas platform.

## Next steps
**nsbs** is quite useless at this stage, since you will be better off just use the native [Tingodb](https://github.com/sergeyksv/tingodb) module or Mongodb, but later I will fully decouple the storage engine from nsbs so you can use the **nsbs** with any storage engine. This is mainly because I want to offer a a lot of freedom to [ayase.js](https://github.com/r1cebank/ayase.js)'s users.

## Test
All the test written for Mocha testing framework with assertion library such as [Chai](chaijs.com) and [chai-as-promised](https://github.com/domenic/chai-as-promised). You can run these test by executing:

```gulp test```

Test coverage can be generated by running:

```gulp coverage```

## License
MIT License

Copyright (c) 2016 Siyuan Gao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.