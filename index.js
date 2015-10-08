/* jshint node: true */
'use strict';

module.exports = {
    name: 'emberek-selectize',

    included: function(app) {
        this._super.included(app);

        app.import(app.bowerDirectory + '/selectize/dist/js/standalone/selectize.js');
        app.import(app.bowerDirectory + '/selectize/dist/css/selectize.css');
        app.import(app.bowerDirectory + '/selectize/dist/css/selectize.bootstrap3.css');
        app.import('vendor/patch-style.css');
    }
};
