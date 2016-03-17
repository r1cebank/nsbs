/**
 * Created by siyuangao on 2016-03-16.
 */

const Chai         = require('chai');
Chai.use(require('sinon-chai'));
Chai.use(require('chai-properties'));
Chai.use(require('chai-as-promised'));

const _            = require('lodash');
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
    require('./util.spec.js');
});