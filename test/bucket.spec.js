/**
 * Created by siyuangao on 2016-03-20.
 */
/* global testoutput */
const nsbs = dofile('index');

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

it('Should not delete the bucket if not exist', function(done) {
    const Database = new nsbs({
        databasePath: testoutput
    });
    Database.removeBucket('testBucket-4').should.be.fulfilled.then((result) => {
        expect(result).to.equal(0);
    }).should.notify(done);
});

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

it('Should return list of collections', function(done) {
    const Database = new nsbs({
        databasePath: testoutput
    });
    const document = {
        name: 'test.png'
    };
    Database.newBucket('testBucket-10').then(() => {
        Database.addItem('testBucket-10', 'files', document).should.be.fulfilled.then(() => {
            Database.listBucket('testBucket-10').should.be.fulfilled.then((result) => {
                expect(result[0]).to.have.property('name', 'files');
            }).should.notify(done);
        });
    });
});
