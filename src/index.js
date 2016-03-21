/**
 * Created by siyuangao on 2016-03-16.
 */
'use strict';
//  const  _           = require('lodash');
const Debug         = require('debug')('nsbs:index');
const Engine        = require('tingodb')();
const Mkdir         = require('mkdirp');
const Promise       = require('bluebird');
const Path          = require('path');
const fs            = require('fs-extra');


class nsbs {
    constructor(config) {
        //  File location of the database
        this.databasePath = config.databasePath;

        //  Create the database directory, if not exist
        Mkdir(this.databasePath);

        //  Initialize the database file
        this.rootDB = new Engine.Db(this.databasePath, {});
        //  Initialize the index file
        this.databaseIndex = this.rootDB.collection('index');
        Debug('new databases stored in: ' + this.databasePath);
    }
    /*
     *  Methods needed
     *  1. Check if bucket exist ✓
     *  2. New Bucket ✓
     *  3. Add item to Bucket
     *  4. Remove item to Bucket
     *  5. Update item in Bucket
     *  6. Remove Bucket ✓
     *  7. Get item from Bucket
     */
    addItem(bucket, collection, item) {
        Debug('Adding to: ' + bucket, '/' + collection);
        const bucketPath = Path.resolve(this.databasePath, `./${bucket}`);
        if (arguments.length < 3) {
            throw new Error('Function should be called with 3 arguments.');
        }
        return new Promise((resolve, reject) => {
            this.existBucket(bucket).then((result) => {
                if (result) {
                    const root = new Engine.Db(bucketPath, {});
                    const collectionRoot = root.collection(collection);
                    collectionRoot.insert(item, (insertError, insertedDocument) => {
                        resolve(insertedDocument);
                    });
                } else {
                    reject(new Error(`${bucket} does not exist.`));
                }
            });
        });
    }
    existBucket(name) {
        return new Promise((resolve) => {
            this.databaseIndex.findOne({name}, (findError, existingBucket) => {
                if (existingBucket) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
    newBucket(name) {
        const bucketPath = Path.resolve(this.databasePath, `./${name}`);
        Debug('creating a new bucket with name: ' + name);
        return new Promise((resolve, reject) => {
            this.databaseIndex.findOne({name}, (findError, existingDocument) => {
                // if (findError) reject(findError); // This really was not going to be set
                if (existingDocument) {
                    reject(new Error('Bucket already exists!'));
                } else {
                    const data = {
                        name: name,
                        items: 0
                    };
                    this.databaseIndex.insert(data, (insertError, insertedDocument) => {
                        // if (insertError) reject(insertError); // This really was not going to be set
                        //  Create the folder once bucket is inserted
                        Mkdir(bucketPath);
                        const bucket = {
                            name: name,
                            path: bucketPath,
                            root: new Engine.Db(bucketPath, {})
                        };
                        resolve(bucket, insertedDocument);
                    });
                }
            });
        });
    }
    removeBucket(name) {
        Debug('Removing bucket called: ' + name);
        const bucketPath = Path.resolve(this.databasePath, `./${name}`);
        return new Promise((resolve) => {
            this.databaseIndex.remove({name}, (error, result) => {
                fs.remove(bucketPath, function() {
                    resolve(result);
                });
            });
        });
    }
}

module.exports = nsbs;
