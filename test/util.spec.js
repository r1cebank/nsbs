/**
 * Created by siyuangao on 2016-03-16.
 */
/* global testoutput */
const nsbs = dofile('index');

it('Should create a nsbs object', function() {
    //  Create a new nsbs object that pass out pre-computed path
    expect(new nsbs({
        databasePath: testoutput
    })).to.be.an.instanceof(nsbs);
});

it('Should create a bucket when it doesn\'t exist', function(done) {
    const Database = new nsbs({
        databasePath: testoutput
    });
    Database.newBucket('testBucket').should.be.fulfilled.then((result) => {
        expect(result[0]).to.have.property('name', 'testBucket');
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

