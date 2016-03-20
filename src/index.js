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
     *  1. Check if bucket exist
     *  2. New Bucket
     *  3. Add item to Bucket
     *  4. Remove item to Bucket
     *  5. Update item in Bucket
     *  6. Remove Bucket
     */
    newBucket(name) {
        Debug('creating a new bucket with name: ' + name);
        return new Promise((resolve, reject) => {
            this.databaseIndex.findOne({name}, (findError, existingDocument) => {
                if (findError) reject(findError);
                if (existingDocument) {
                    reject(new Error('Bucket already exists!'));
                } else {
                    const data = {
                        name: name,
                        items: 0
                    };
                    this.databaseIndex.insert(data, (insertError, insertedDocument) => {
                        if (insertError) reject(insertError);
                        resolve(insertedDocument);
                        //  Create the folder once bucket is inserted
                        Mkdir(Path.resolve(this.databasePath, `./${name}`));
                    });
                }
            });
        });
    }
}

module.exports = nsbs;
