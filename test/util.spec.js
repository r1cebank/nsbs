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

