/**
 * Created by siyuangao on 2016-03-20.
 */
/* global testoutput */
const nsbs = dofile('index');

it('Should create a bucket when it doesn\'t exist', function(done) {
    const Database = new nsbs({
        databasePath: testoutput
    });
    Database.newBucket('testBucket').should.be.fulfilled.then((result) => {
        expect(result).to.have.property('name', 'testBucket');
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
