/**
 * Created by siyuangao on 2016-03-20.
 */
/* global testoutput */
const nsbs = dofile('index');

describe('Bucket new', function() {
    it('Should create a bucket when it doesn\'t exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.newBucket('testBucket-1').should.be.fulfilled.then((result) => {
            expect(result).to.have.property('name', 'testBucket-1');
        }).should.notify(done);
    });

    it('Should not create a bucket when it exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.newBucket('testBucket-2').then(() => {
            Database.newBucket('testBucket-2').should.be.rejectedWith(Error, 'Bucket already exists!').and.notify(done);
        });
    });

    it('Should correctly delete the bucket', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.newBucket('testBucket-3').then(() => {
            Database.removeBucket('testBucket-3').should.be.fulfilled.then((result) => {
                expect(result).to.equal(1);
                Database.databaseIndex.findOne({name: 'testBucket-3'}, function(findError, existingDocument) {
                    expect(existingDocument).to.be.null;
                    done();
                });
            });
        });
    });
});

describe('Bucket remove', function() {
    it('Should not delete the bucket if not exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.removeBucket('testBucket-4').should.be.fulfilled.then((result) => {
            expect(result).to.equal(0);
        }).should.notify(done);
    });
});

describe('Bucket exist', function() {
    it('Should find bucket if exists', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.newBucket('testBucket-5').then(() => {
            Database.existBucket('testBucket-5').should.be.fulfilled.then((result) => {
                expect(result).to.equal(true);
            }).should.notify(done);
        });
    });

    it('Should not find bucket if doesn\'t exists', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.existBucket('testBucket-6').should.be.fulfilled.then((result) => {
            expect(result).to.equal(false);
        }).should.notify(done);
    });
});

describe('Add item', function() {
    it('Should not insert item if bucket doesn\'t exists', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.addItem('testBucket-7', 'files', {}).should.be.rejectedWith(Error, 'testBucket-7 does not exist.').and.notify(done);
    });

    it('Should fail when number of supplied argument is incorrect', function() {
        const Database = new nsbs({
            databasePath: testoutput
        });
        expect(Database.addItem.bind(Database /* No Argument supplied */)).to.throw(Error, 'Function should be called with 3 arguments.');
    });

    it('Should fail supplied _index as collection', function() {
        const Database = new nsbs({
            databasePath: testoutput
        });
        expect(Database.addItem.bind(Database, 'testbucket-8', '_index', {})).to.throw(Error, 'Collection can not be named _index.');
    });

    it('Should insert item if bucket exists', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-9').then(() => {
            Database.addItem('testBucket-9', 'files', document).should.be.fulfilled.then((result) => {
                expect(result[0]).to.equal(document);
            }).should.notify(done);
        });
    });
});

describe('Bucket list', function() {
    it('Should return list of collections', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-10').then(() => {
            Database.addItem('testBucket-10', 'files', document).should.be.fulfilled.then(() => {
                Database.listCollection('testBucket-10').should.be.fulfilled.then((result) => {
                    expect(result[0]).to.have.property('name', 'files');
                }).should.notify(done);
            });
        });
    });
});

describe('Get item', function() {
    it('Should get item if query is correct', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-11').then(() => {
            Database.addItem('testBucket-11', 'files', document).then(() => {
                Database.getItem('testBucket-11', 'files', {name: 'test.png'}).should.be.fulfilled.then((result) => {
                    expect(result).to.deep.equal(document);
                }).should.notify(done);
            });
        });
    });
    it('Should not get item if query is incorrect', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-12').then(() => {
            Database.addItem('testBucket-12', 'files', document).then(() => {
                Database.getItem('testBucket-12', 'files', {name: 'test2.png'}).should.be.fulfilled.then((result) => {
                    expect(result).to.equal(null);
                }).should.notify(done);
            });
        });
    });
    it('Should fail is bucket does not exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.getItem('testBucket-13', 'files', {name: 'test2.png'}).should.be.rejectedWith(Error, 'testBucket-13 does not exist.').and.notify(done);
    });
});

describe('List items', function() {
    it('Should not list if bucket does not exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.listItems('testBucket-14', 'files').should.be.rejectedWith(Error, 'testBucket-14 does not exist.').and.notify(done);
    });
    it('Should return empty array if collection is empty', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.newBucket('testBucket-15').then(() => {
            Database.listItems('testBucket-15', 'testCollection').should.be.fulfilled.then((documents) => {
                expect(documents).to.deep.equal([]);
            }).should.notify(done);
        });
    });
    it('Should return array with items', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-16').then(() => {
            Database.addItem('testBucket-16', 'files', document).then(() => {
                Database.listItems('testBucket-16', 'files').should.be.fulfilled.then((documents) => {
                    expect(documents).to.deep.equal([document]);
                }).should.notify(done);
            });
        });
    });
});

describe('List Buckets', function() {
    it('Should list all buckets in database index', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.listBuckets().should.be.fulfilled.then((buckets) => {
            expect(buckets.length).to.deep.equal(9);
        }).should.notify(done);
    });
});

describe('Update Item', function() {
    it('Should update item if bucket and item exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        const newDocument = {
            name: 'newTest.png'
        };
        Database.newBucket('testBucket-17').then(() => {
            Database.addItem('testBucket-17', 'files', document).then(() => {
                Database.updateItem('testBucket-17', 'files', document, newDocument).then(() => {
                    Database.listItems('testBucket-17', 'files').should.be.fulfilled.then((documents) => {
                        expect(documents).to.deep.equal([newDocument]);
                    }).should.notify(done);
                });
            });
        });
    });
    it('Should upsert item if item does not exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        const document = {
            name: 'test.png'
        };
        Database.newBucket('testBucket-18').then(() => {
            Database.updateItem('testBucket-18', 'files', document, document).then(() => {
                Database.listItems('testBucket-18', 'files').should.be.fulfilled.then((documents) => {
                    expect(documents[0].name).to.equal(document.name);
                }).should.notify(done);
            });
        });
    });
    it('Should fail if bucket does not exist', function(done) {
        const Database = new nsbs({
            databasePath: testoutput
        });
        Database.updateItem('testBucket-19', 'files', {}, {}).should.be.rejectedWith(Error, 'testBucket-19 does not exist.').and.notify(done);
    });
});
