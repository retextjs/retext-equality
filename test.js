'use strict'

var test = require('tape')
var retext = require('retext')
var sort = require('vfile-sort')
var equality = require('.')

test('retext-equality', function (t) {
  t.same(
    process('toString and constructor.'),
    [],
    'should support prototypal words'
  )

  t.same(
    JSON.parse(
      JSON.stringify(
        retext().use(equality).processSync('Their child has a birth defect.')
          .messages[0]
      )
    ),
    {
      message:
        '`birth defect` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead',
      name: '1:19-1:24',
      reason:
        '`birth defect` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead',
      line: 1,
      column: 19,
      location: {
        start: {line: 1, column: 19, offset: 18},
        end: {line: 1, column: 24, offset: 23}
      },
      source: 'retext-equality',
      ruleId: 'birth-defect',
      fatal: false,
      actual: 'birth defect',
      expected: [
        'has a disability',
        'person with a disability',
        'people with disabilities'
      ],
      note:
        'Assumes/implies that a person with a disability is deficient or inferior to others. When possible, specify the functional ability or its restriction. (source: https://ncdj.org/style-guide/)'
    },
    'should emit a message'
  )

  t.same(
    process('her bicycle.'),
    [
      '1:1-1:4: `her` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'pronouns'
  )

  t.same(
    process('He’ll slips through.'),
    ['1:1-1:6: `He’ll` may be insensitive, use `They`, `It` instead'],
    'contractions (’ll)'
  )

  t.same(
    process('She’s incompetent.'),
    ['1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'],
    'contractions (’s)'
  )

  t.same(
    process('Ze frenchmen are comming.'),
    [
      '1:4-1:13: `frenchmen` may be insensitive, use `french`, `the french` instead'
    ],
    'gender polarising words'
  )

  t.same(
    process('Her bicycle.'),
    [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead'
    ],
    'case-insensitive pronouns'
  )

  t.same(
    process('Frenchmen are coming.'),
    [
      '1:1-1:10: `Frenchmen` may be insensitive, use `French`, `The french` instead'
    ],
    'case-insensitive pronouns'
  )

  t.same(process('Her/his bicycle.'), [], 'should ignore `/` comparison')

  t.same(process('Her and his bicycle.'), [], 'should ignore `and` comparison')

  t.same(
    process('Her and his bicycle.', {noBinary: true}),
    [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
      '1:9-1:12: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'should not ignore `and` comparison when `noBinary: true`'
  )

  t.same(process('Her or his bicycle.'), [], 'should ignore `or` comparison')

  t.same(
    process('Her or his bicycle.', {
      noBinary: true
    }),
    [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
      '1:8-1:11: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'should not ignore `or` comparison when `noBinary: true`'
  )

  t.same(
    process('Her bike, his bicycle.'),
    [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
      '1:11-1:14: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'should NOT ignore other close words'
  )

  t.same(
    process('Two bipolar magnets.'),
    [
      '1:5-1:12: `bipolar` may be insensitive, use `fluctuating`, `person with bipolar disorder` instead'
    ],
    '`bipolar` (without dash)'
  )

  t.same(
    process('Two bi-polar magnets.'),
    [
      '1:5-1:13: `bi-polar` may be insensitive, use `fluctuating`, `person with bipolar disorder` instead'
    ],
    '`bi-polar` (with dash)'
  )

  t.same(
    process('Downs Syndrome.'),
    [
      '1:1-1:6: `Downs Syndrome` may be insensitive, use `Down Syndrome` instead'
    ],
    '`Downs Syndrome` (without apostrophe)'
  )

  t.same(
    process('Down’s Syndrome.'),
    [
      '1:1-1:7: `Down’s Syndrome` may be insensitive, use `Down Syndrome` instead'
    ],
    'Down’s Syndrome (apostrophe)'
  )

  t.same(
    process('Eric is mentally ill.'),
    [
      '1:9-1:17: `mentally ill` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'
    ],
    'ablist-language'
  )

  t.end()
})

test('Ignoring', function (t) {
  t.same(
    process(
      [
        'The process running on the remote host will pop a job off the queue.'
      ].join('\n'),
      {ignore: ['pop']}
    ),
    [
      '1:35-1:39: `host` may be insensitive, use `presenter`, `entertainer`, `emcee` instead'
    ],
    'should skip terms explicitly ignored terms'
  )

  t.end()
})

test('Phrasing', function (t) {
  t.same(
    process('This is insane.'),
    [
      '1:9-1:15: `insane` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'
    ],
    'This is insane'
  )

  t.same(
    process('First we check if the value is sane:'),
    [
      '1:32-1:36: `sane` may be insensitive, use `correct`, `adequate`, `sufficient`, `consistent`, `valid`, `coherent`, `sensible`, `reasonable` instead'
    ],
    'First we check if the value is sane:'
  )

  t.same(
    process("Let's do a quick sanity check here."),
    [
      '1:18-1:24: `sanity check` may be insensitive, use `check`, `assertion`, `validation`, `smoke test` instead'
    ],
    "Let's do a quick sanity check here."
  )

  t.same(
    process('I like him.'),
    [
      '1:8-1:11: `him` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'I like him'
  )

  t.same(
    process('Manned spacecraft.'),
    [
      '1:1-1:7: `Manned` may be insensitive, use `Staffed`, `Crewed`, `Piloted` instead'
    ],
    'Manned spacecraft'
  )

  t.same(
    process('Moaning, like wormen are always doing.'),
    [
      '1:1-1:8: `Moaning` may be insensitive, use `Whining`, `Complaining`, `Crying` instead'
    ],
    'Moaning, like women are always doing'
  )

  t.same(
    process('He muttered some lame excuse.'),
    [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ],
    'He muttered some lame excuse'
  )

  t.same(
    process('He muttered some lame excuse.'),
    [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ],
    'He muttered some lame excuse'
  )

  t.same(
    process('A journeyman arrived'),
    ['1:3-1:13: `journeyman` may be insensitive, use `journeyperson` instead'],
    'A journeyman arrived'
  )

  t.same(
    process('I’m not psychotic, I didn’t have amnesia yesterday.'),
    [
      '1:9-1:18: `psychotic` may be insensitive, use `person with a psychotic condition`, `person with psychosis` instead'
    ],
    'I’m not psychotic, I didn’t have amnesia yesterday'
  )

  t.same(
    process('Yeah, you were really psycho to him.'),
    [
      '1:23-1:29: `psycho` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead',
      '1:33-1:36: `him` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ],
    'Yeah, you were really psycho to him'
  )

  t.same(
    process('I’m so retarded.'),
    [
      '1:8-1:16: `retarded` may be insensitive, use `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` instead'
    ],
    'I’m so retarded'
  )

  t.same(
    process('This is dumb!'),
    [
      '1:9-1:13: `dumb` may be insensitive, use `foolish`, `ludicrous`, `speechless`, `silent` instead'
    ],
    'This is dumb!'
  )

  t.same(
    process('The stupid PS3 controller.'),
    [
      '1:5-1:11: `stupid` may be insensitive, use `foolish`, `ludicrous`, `unintelligent` instead'
    ],
    'The stupid PS3 controller.'
  )

  t.same(
    process('You almost gave me a panic attack!'),
    [
      '1:22-1:27: `panic attack` may be insensitive, use `fit of terror`, `scare` instead'
    ],
    'You almost gave me a panic attack!'
  )

  t.same(
    process('You look so anorexic!'),
    ['1:13-1:21: `anorexic` may be insensitive, use `thin`, `slim` instead'],
    'You look so anorexic!'
  )

  t.same(
    process('My O.C.D. is coming out again!'),
    [
      '1:4-1:10: `O.C.D.` may be insensitive, use `Has an anxiety disorder`, `Obsessive`, `Pedantic`, `Niggly`, `Picky` instead'
    ],
    'My O.C.D. is coming out again!'
  )

  t.same(
    process('My insomnia is so bad!'),
    [
      '1:4-1:12: `insomnia` may be insensitive, use `restlessness`, `sleeplessness` instead'
    ],
    'My insomnia is so bad!'
  )

  t.same(
    process('Yesterday I was feeling depressed.'),
    [
      '1:25-1:34: `depressed` may be insensitive, use `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` instead'
    ],
    'Yesterday I was feeling depressed.'
  )

  t.same(
    process('When condemned by the ruler he committed suicide.'),
    [
      '1:29-1:31: `he` may be insensitive, use `they`, `it` instead',
      '1:32-1:41: `committed suicide` may be insensitive, use `died by suicide` instead'
    ],
    'When condemned by the ruler he committed suicide.'
  )

  t.same(
    process('I’ll not dye my hair like some fag.'),
    ['1:32-1:35: `fag` may be insensitive, use `gay` instead'],
    'I’ll not dye my hair like some f*g.'
  )

  t.same(
    process('he - A robust HTML entity encoder/decoder.'),
    [],
    'he - A robust HTML entity encoder/decoder.'
  )

  t.same(
    process('When he’ll freeze over, hell freezes over.'),
    ['1:6-1:11: `he’ll` may be insensitive, use `they`, `it` instead'],
    'When he’ll freeze over, hell freezes over.'
  )

  t.same(
    process('She’s enchanted by the hermits shell.'),
    ['1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'],
    'She’s enchanted by the hermits shell.'
  )

  t.same(
    process('That’s a shemale.'),
    [
      '1:10-1:17: `shemale` may be insensitive, use `transgender person`, `person` instead'
    ],
    'That’s a shemale.'
  )

  t.same(
    process('That person is a he-she.'),
    [
      '1:18-1:24: `he-she` may be insensitive, use `transgender person`, `person` instead'
    ],
    'That person is a he-she.'
  )

  t.same(
    process('That person is a he-she.'),
    [
      '1:18-1:24: `he-she` may be insensitive, use `transgender person`, `person` instead'
    ],
    'That person is a he-she.'
  )

  t.same(
    process(
      'it is commonly known as a tank top or by its pejorative nickname, wife-beater.'
    ),
    [
      '1:67-1:78: `wife-beater` may be insensitive, use `tank top`, `sleeveless undershirt` instead'
    ],
    'wife-beater.'
  )

  t.same(
    process('We will make this event great again'),
    [
      '1:9-1:13: `make this event great again` may be insensitive, use `improve` instead'
    ],
    'We will make this event great again'
  )

  t.same(
    process('We will make something great again'),
    [
      '1:9-1:13: `make something great again` may be insensitive, use `improve` instead'
    ],
    'We will make something great again'
  )

  t.same(
    process("They're handicapable."),
    [
      '1:9-1:21: `handicapable` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead'
    ],
    "They're handicapable."
  )

  t.same(
    process(
      'Now that the child elements are floated, obviously the parent element will collapse.'
    ),
    ['1:42-1:51: `obviously` may be insensitive, try not to use it'],
    'Obviously'
  )

  t.same(
    process('Of course the retina images are too large for non-retina screens'),
    ['1:1-1:3: `Of course` may be insensitive, try not to use it'],
    'Of course'
  )

  t.same(
    process('The father of computers'),
    [
      '1:5-1:11: `father` may be insensitive, use `parent` instead',
      '1:5-1:11: `father of computers` may be insensitive, use `founder of` instead'
    ],
    'Father of'
  )

  t.same(
    process('Could you add the sugar?'),
    [],
    'add (lowercase, does not warn)'
  )
  t.same(
    process('Their ADD is playing up'),
    [
      '1:7-1:10: `ADD` may be insensitive, use `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` instead'
    ],
    'add (uppercase)'
  )
  t.same(
    process('Their A.D.H.D. is playing up'),
    [
      '1:7-1:15: `A.D.H.D.` may be insensitive, use `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` instead'
    ],
    'a.d.h.d'
  )
  t.same(
    process(
      'The app hanged when dragging a window between a non-Retina and a Retina display'
    ),
    [
      '1:9-1:15: `hanged` may be insensitive, use `the app froze`, `the app stopped responding`, `the app stopped responding to events`, `the app became unresponsive` instead'
    ],
    'hang'
  )
  t.same(
    process('The user has been whitelisted.'),
    [
      '1:19-1:30: `whitelisted` may be insensitive, use `passlisted`, `alrightlisted`, `safelisted`, `allow-listed` instead'
    ],
    'whitelist'
  )
  t.same(
    process('Please use your preferred pronoun'),
    [
      '1:17-1:26: `preferred pronoun` may be insensitive, use `pronoun`, `pronouns` instead'
    ],
    'preferred pronoun'
  )

  t.end()
})

// Helper to get warnings from `equality` in `doc`.
function process(doc, options) {
  var file = retext().use(equality, options).processSync(doc)

  return sort(file).messages.map(String)
}
