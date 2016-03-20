/**
 * Created by siyuangao on 2016-03-16.
 */

const Chai         = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-properties'));
Chai.use(require('chai-as-promised'));
Chai.should();

//  const _            = require('lodash');
const Path         = require('path');
const Root         = require('app-root-path');
Root.setPath(Path.resolve(__dirname, '../src'));

/*!
 * Setup global stuff here.
 */
global.dofile      = Root.require;
global.expect      = Chai.expect;
global.Sinon       = require('sinon');

describe('Utils', function() {
    //  Setting a test output directory
    before(function() {
        const mkdir = require('mkdirp');
        global.testoutput = Root.resolve('../testoutput');
        mkdir(global.testoutput);
    });

    require('./util.spec.js');

    //    Remove the directory once test is done
    after(function(done) {
        const fs = require('fs-extra');
        fs.remove(global.testoutput, function() {
            done();
        });
    });
});
