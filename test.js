'use strict';

var test = require('tape');
var retext = require('retext');
var bail = require('bail');
var sort = require('vfile-sort');
var equality = require('./');

test('retext-equality', function (t) {
  var doc;

  t.plan(25);

  t.same(process('toString and constructor.'), []);

  doc = 'Their child has a birth defect.';

  retext().use(equality).process(doc, function (err, file) {
    t.ifError(err);

    t.same(
      file.messages[0].note,
      'If possible, describe exacly what this is. (source: http://ncdj.org/style-guide/)',
      'should patch `description` when applicable'
    );
  });

  t.same(
    process('her bicycle.'),
    ['1:1-1:4: `her` may be insensitive, use `their`, `theirs`, `them` instead'],
    'pronouns'
  );

  t.same(
    process('He’ll slips through.'),
    ['1:1-1:6: `He’ll` may be insensitive, use `They`, `It` instead'],
    'contractions (’ll)'
  );

  t.same(
    process('She’s incompetent.'),
    ['1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'],
    'contractions (’s)'
  );

  t.same(
    process('Ze frenchmen are comming.'),
    ['1:4-1:13: `frenchmen` may be insensitive, use `french` instead'],
    'gender polarising words'
  );

  t.same(
    process('Her bicycle.'),
    ['1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs`, `Them` instead'],
    'case-insensitive pronouns'
  );

  t.same(
    process('Frenchmen are comming.'),
    ['1:1-1:10: `Frenchmen` may be insensitive, use `French` instead'],
    'case-insensitive pronouns'
  );

  t.same(
    process('Her/his bicycle.'),
    [],
    'should ignore `/` comparison'
  );

  t.same(
    process('Her and his bicycle.'),
    [],
    'should ignore `and` comparison'
  );

  t.same(
    process('Her and his bicycle.', {noBinary: true}),
    [
      '1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs`, `Them` instead',
      '1:9-1:12: `his` may be insensitive, use `their`, `theirs`, `them` instead'
    ],
    'should not ignore `and` comparison when `noBinary: true`'
  );

  t.same(
    process('Her or his bicycle.'),
    [],
    'should ignore `or` comparison'
  );

  t.same(
    process('Her or his bicycle.', {
      noBinary: true
    }),
    [
      '1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs`, `Them` instead',
      '1:8-1:11: `his` may be insensitive, use `their`, `theirs`, `them` instead'
    ],
    'should not ignore `or` comparison when `noBinary: true`'
  );

  t.same(
    process('Her bike, his bicycle.'),
    [
      '1:1-1:4: `Her` may be insensitive, use `Their`, `Theirs`, `Them` instead',
      '1:11-1:14: `his` may be insensitive, use `their`, `theirs`, `them` instead'
    ],
    'should NOT ignore other close words'
  );

  t.same(
    process('Two bipolar magnets.'),
    ['1:5-1:12: `bipolar` may be insensitive, use `fluctuating`, `person with schizophrenia`, `person with bipolar disorder` instead'],
    '`bipolar` (without dash)'
  );

  t.same(
    process('Two bi-polar magnets.'),
    ['1:5-1:13: `bi-polar` may be insensitive, use `fluctuating`, `person with schizophrenia`, `person with bipolar disorder` instead'],
    '`bi-polar` (with dash)'
  );

  t.same(
    process('Downs Syndrome.'),
    ['1:1-1:6: `Downs Syndrome` may be insensitive, use `Down Syndrome` instead'],
    '`Downs Syndrome` (without apostrophe)'
  );

  t.same(
    process('Down’s Syndrome.'),
    ['1:1-1:7: `Down’s Syndrome` may be insensitive, use `Down Syndrome` instead'],
    'Down’s Syndrome (apostrophe)'
  );

  t.same(
    process('Eric is mentally ill.'),
    ['1:9-1:17: `mentally ill` may be insensitive, use `rude`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'],
    'ablist-language'
  );

  t.same(
    process('Sam set up the network as master and slave.'),
    ['1:27-1:33: `master` / `slave` may be insensitive, use `primary` / `replica` instead'],
    'relational insensitivities'
  );

  t.same(
    process('Master and slave can be quite hurtful.'),
    ['1:1-1:7: `Master` / `slave` may be insensitive, use `Primary` / `Replica` instead'],
    'relational insensitivities (case #1)'
  );

  t.same(
    process('master and Slave can be quite hurtful.'),
    ['1:1-1:7: `master` / `Slave` may be insensitive, use `primary` / `replica` instead'],
    'relational insensitivities (case #2)'
  );

  t.same(
    process('Slaves. Master.'),
    ['1:1-1:7: `Slaves` / `Master` may be insensitive, use `Replica` / `Primary` instead'],
    'relation order'
  );

  t.same(
    process('All changes are written to the master server. The slaves are read-only copies of master.'),
    ['1:32-1:38: `master` / `slaves` may be insensitive, use `primary` / `replica` instead'],
    'relation across sentences'
  );
});

test('Ignoring', function (t) {
  t.plan(1);

  t.same(
    process([
      'The process running on the remote host ' +
      'will pop a job off the queue.'
    ].join('\n'), {
      ignore: ['pop']
    }),
    [
      '1:35-1:39: `host` may be insensitive, use `presenter`, ' +
      '`entertainer` instead'
    ],
    'should skip terms explicitly ignored terms'
  );
});

test('Phrasing', function (t) {
  t.same(
    process('This is insane.'),
    ['1:9-1:15: `insane` may be insensitive, use `rude`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'],
    'This is insane'
  );

  t.same(process('I like him.'), [
    '1:8-1:11: `him` may be insensitive, use `their`, `theirs`, `them` instead'],
    'I like him'
  );

  t.same(
    process('Manned spacecraft.'),
    ['1:1-1:7: `Manned` may be insensitive, use `Staffed`, `Crewed`, `Piloted` instead'],
    'Manned spacecraft'
  );

  t.same(
    process('Moaning, like wormen are always doing.'),
    ['1:1-1:8: `Moaning` may be insensitive, use `Whining`, `Complaining`, `Crying` instead'],
    'Moaning, like women are always doing'
  );

  t.same(
    process('He muttered some lame excuse.'),
    [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ],
    'He muttered some lame excuse'
  );

  t.same(
    process('He muttered some lame excuse.'),
    [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ],
    'He muttered some lame excuse'
  );

  t.same(
    process('I’m not psychotic, I didn’t have amnesia yesterday.'),
    ['1:9-1:18: `psychotic` may be insensitive, use `person with a psychotic condition`, `person with psychosis` instead'],
    'I’m not psychotic, I didn’t have amnesia yesterday'
  );

  t.same(
    process('Yeah, you were really psycho to him.'),
    [
      '1:23-1:29: `psycho` may be insensitive, use `rude`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead',
      '1:33-1:36: `him` may be insensitive, use `their`, `theirs`, `them` instead'
    ],
    'Yeah, you were really psycho to him'
  );

  t.same(
    process('I’m so retarded.'),
    ['1:8-1:16: `retarded` may be insensitive, use `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` instead'],
    'I’m so retarded'
  );

  t.same(
    process('This is dumb!'),
    ['1:9-1:13: `dumb` may be insensitive, use `foolish`, `ludicrous`, `speechless`, `silent` instead'],
    'This is dumb!'
  );

  t.same(
    process('The stupid PS3 controller.'),
    ['1:5-1:11: `stupid` may be insensitive, use `foolish`, `ludicrous`, `unintelligent` instead'],
    'The stupid PS3 controller.'
  );

  t.same(
    process('You almost gave me a panic attack!'),
    ['1:22-1:27: `panic attack` may be insensitive, use `fit of terror`, `scare` instead'],
    'You almost gave me a panic attack!'
  );

  t.same(
    process('You look so anorexic!'),
    ['1:13-1:21: `anorexic` may be insensitive, use `thin`, `slim` instead'],
    'You look so anorexic!'
  );

  t.same(
    process('My O.C.D. is coming out again!'),
    ['1:4-1:10: `O.C.D.` may be insensitive, use `Obsessive`, `Pedantic`, `Niggly`, `Picky` instead'],
    'My O.C.D. is coming out again!'
  );

  t.same(
    process('My insomnia is so bad!'),
    ['1:4-1:12: `insomnia` may be insensitive, use `restlessness`, `sleeplessness` instead'],
    'My insomnia is so bad!'
  );

  t.same(
    process('Yesterday I was feeling depressed.'),
    ['1:25-1:34: `depressed` may be insensitive, use `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` instead'],
    'Yesterday I was feeling depressed.'
  );

  t.same(
    process('When condemned by the ruler he committed suicide.'),
    [
      '1:29-1:31: `he` may be insensitive, use `they`, `it` instead',
      '1:32-1:41: `committed suicide` may be insensitive, use `died by suicide` instead'
    ],
    'When condemned by the ruler he committed suicide.'
  );

  t.same(
    process('I’ll not dye my hair like some fag.'),
    ['1:32-1:35: `fag` may be insensitive, use `gay` instead'],
    'I’ll not dye my hair like some f*g.'
  );

  t.same(
    process('he - A robust HTML entity encoder/decoder.'),
    [],
    'he - A robust HTML entity encoder/decoder.'
  );

  t.same(
    process('When he’ll freeze over, hell freezes over.'),
    ['1:6-1:11: `he’ll` may be insensitive, use `they`, `it` instead'],
    'When he’ll freeze over, hell freezes over.'
  );

  t.same(
    process('She’s enchanted by the hermits shell.'),
    ['1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'],
    'She’s enchanted by the hermits shell.'
  );

  t.same(
    process('That’s a shemale.'),
    ['1:10-1:17: `shemale` may be insensitive, use `transgender person`, `person` instead'],
    'That’s a shemale.'
  );

  t.same(
    process('That person is a he-she.'),
    ['1:18-1:24: `he-she` may be insensitive, use `transgender person`, `person` instead'],
    'That person is a he-she.'
  );

  t.same(
    process('That person is a he-she.'),
    ['1:18-1:24: `he-she` may be insensitive, use `transgender person`, `person` instead'],
    'That person is a he-she.'
  );

  t.same(
    process('it is commonly known as a tank top or by its pejorative nickname, wife-beater.'),
    ['1:67-1:78: `wife-beater` may be insensitive, use `tank top`, `sleeveless undershirt` instead'],
    'wife-beater.'
  );

  t.end();
});

/* Helpers. */

/* Helper to get warnings from `equality` in `doc`. */
function process(doc, options) {
  var messages;

  retext()
    .use(equality, options)
    .process(doc, function (err, file) {
      bail(err);
      sort(file);
      messages = file.messages;
    });

  return messages.map(String);
}
