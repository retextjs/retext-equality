'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var equality = require('./');

/*
 * Methods.
 */

var dequal = assert.deepEqual;

/*
 * Helpers.
 */

/**
 * Helper to get warnings from `equality` in `doc`.
 */
function process(doc) {
    var messages;

    retext().use(equality).process(doc, function (err, file) {
        assert.ifError(err);

        messages = file.messages;
    });

    return messages.map(String);
}

/*
 * Tests.
 */

describe('retext-equality', function () {
    it('should warn about gender polarisign words', function () {
        dequal(process('her bicycle.'), [
            '1:1-1:4: `her` may be insensitive, use `their`, `theirs` instead'
        ]);

        dequal(process('Ze frenchmen are comming.'), [
            '1:4-1:13: `frenchmen` may be insensitive, use `french` instead'
        ]);
    });

    it('should warn case-insensitive', function () {
        dequal(process('Her bicycle.'), [
            '1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs` instead'
        ]);

        dequal(process('Frenchmen are comming.'), [
            '1:1-1:10: `Frenchmen` may be insensitive, use `French` instead'
        ]);
    });

    it('should ignore `/` comparison', function () {
        var messages = process('Her/his bicycle.');

        dequal(messages, []);
    });

    it('should ignore `and` comparison', function () {
        var messages = process('Her and his bicycle.');

        dequal(messages, []);
    });

    it('should ignore `or` comparison', function () {
        var messages = process('Her or his bicycle.');

        dequal(messages, []);
    });

    it('should NOT ignore other close words', function () {
        var messages = process('Her bike, his bicycle.');

        dequal(messages, [
            '1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs` instead',
            '1:11-1:14: `his` may be insensitive, use `their`, `theirs` instead'
        ]);
    });

    it('should warn about disability-inconsiderate words', function () {
        dequal(process('Eric is mentally ill.'), [
            '1:9-1:17: `mentally ill` may be insensitive, use `person with mental illness` instead'
        ]);

        dequal(process('Eric is Mentally ill.'), [
            '1:9-1:17: `Mentally ill` may be insensitive, use `Person with mental illness` instead'
        ]);
    });

    it('should warn about relational insensitivities', function () {
        var messages = process('Sam set up the network as master and slave.');

        dequal(messages, [
            '1:27-1:33: `master` / `slave` may be insensitive, use `primary` / `replica` instead'
        ]);
    });

    it('should warn about relational insensitivities supporting case', function () {
        dequal(process('Master and slave can be quite hurtful.'), [
            '1:1-1:7: `Master` / `slave` may be insensitive, use `Primary` / `Replica` instead'
        ]);

        dequal(process('master and Slave can be quite hurtful.'), [
            '1:1-1:7: `master` / `Slave` may be insensitive, use `primary` / `replica` instead'
        ]);
    });

    it('should re-order relationals based on which came first', function () {
        dequal(process('Slaves. Master.'), [
            '1:1-1:7: `Slaves` / `Master` may be insensitive, use `Replica` / `Primary` instead'
        ]);
    });

    it('should warn about relationals across sentences', function () {
        var messages = process('All changes are written to the master server. The slaves are read-only copies of master.');

        dequal(messages, [
            '1:32-1:38: `master` / `slaves` may be insensitive, use `primary` / `replica` instead'
        ]);
    });
});
