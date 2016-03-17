/**
 * Created by siyuangao on 2016-03-16.
 */

it('Should create a nsbs object', function() {
    const nsbs = dofile('index');
    expect(new nsbs()).to.be.an.instanceof(nsbs);
});
