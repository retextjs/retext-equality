/**
 * @typedef {import('./index.js').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import {compareMessage} from 'vfile-sort'
import retextEquality from './index.js'

test('retext-equality', async function (t) {
  await t.test('should support prototypal words', async function () {
    assert.deepEqual(await process('toString and constructor.'), [])
  })

  await t.test('should emit a message', async function () {
    const file = retext()
      .use(retextEquality)
      .processSync('Their child has a birth defect.')

    assert.deepEqual(
      JSON.parse(JSON.stringify({...file.messages[0], ancestors: []})),
      {
        ancestors: [],
        column: 19,
        fatal: false,
        message:
          '`birth defect` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead',
        line: 1,
        name: '1:19-1:24',
        place: {
          start: {line: 1, column: 19, offset: 18},
          end: {line: 1, column: 24, offset: 23}
        },
        reason:
          '`birth defect` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead',
        ruleId: 'birth-defect',
        source: 'retext-equality',
        actual: 'birth defect',
        expected: [
          'has a disability',
          'person with a disability',
          'people with disabilities'
        ],
        note: 'Assumes/implies that a person with a disability is deficient or inferior to others. When possible, specify the functional ability or its restriction. (source: https://ncdj.org/style-guide/)',
        url: 'https://github.com/retextjs/retext-equality#readme'
      }
    )
  })

  await t.test('should support pronouns', async function () {
    assert.deepEqual(await process('her bicycle.'), [
      '1:1-1:4: `her` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ])
  })

  await t.test('should support contractions (’ll)', async function () {
    assert.deepEqual(await process('He’ll slips through.'), [
      '1:1-1:6: `He’ll` may be insensitive, use `They`, `It` instead'
    ])
  })

  await t.test('should support contractions (’s)', async function () {
    assert.deepEqual(await process('She’s incompetent.'), [
      '1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'
    ])
  })

  await t.test('should support gender polarising words', async function () {
    assert.deepEqual(await process('Ze frenchmen are comming.'), [
      '1:4-1:13: `frenchmen` may be insensitive, use `french`, `the french` instead'
    ])
  })

  await t.test('should support case-insensitive pronouns', async function () {
    assert.deepEqual(await process('Her bicycle.'), [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead'
    ])
  })

  await t.test('should support case-insensitive pronouns', async function () {
    assert.deepEqual(await process('Frenchmen are coming.'), [
      '1:1-1:10: `Frenchmen` may be insensitive, use `French`, `The french` instead'
    ])
  })

  await t.test('should ignore `/` comparison', async function () {
    assert.deepEqual(await process('Her/his bicycle.'), [])
  })

  await t.test('should ignore `and` comparison', async function () {
    assert.deepEqual(await process('Her and his bicycle.'), [])
  })

  await t.test(
    'should not ignore `and` comparison when `noBinary: true`',
    async function () {
      assert.deepEqual(
        await process('Her and his bicycle.', {noBinary: true}),
        [
          '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
          '1:9-1:12: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
        ]
      )
    }
  )

  await t.test('should ignore `or` comparison', async function () {
    assert.deepEqual(await process('Her or his bicycle.'), [])
  })

  await t.test(
    'should not ignore `or` comparison when `noBinary: true`',
    async function () {
      assert.deepEqual(
        await process('Her or his bicycle.', {
          noBinary: true
        }),
        [
          '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
          '1:8-1:11: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
        ]
      )
    }
  )

  await t.test('should not ignore other close words', async function () {
    assert.deepEqual(await process('Her bike, his bicycle.'), [
      '1:1-1:4: `Her` may be insensitive, when referring to a person, use `Their`, `Theirs`, `Them` instead',
      '1:11-1:14: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ])
  })

  await t.test('should support `bipolar` (without dash)', async function () {
    assert.deepEqual(await process('Two bipolar magnets.'), [
      '1:5-1:12: `bipolar` may be insensitive, use `fluctuating`, `person with bipolar disorder` instead'
    ])
  })

  await t.test('should support `bi-polar` (with dash)', async function () {
    assert.deepEqual(await process('Two bi-polar magnets.'), [
      '1:5-1:13: `bi-polar` may be insensitive, use `fluctuating`, `person with bipolar disorder` instead'
    ])
  })

  await t.test(
    'should support `Downs Syndrome` (without apostrophe)',
    async function () {
      assert.deepEqual(await process('Downs Syndrome.'), [
        '1:1-1:6: `Downs Syndrome` may be insensitive, use `Down Syndrome` instead'
      ])
    }
  )

  await t.test(
    'should support `Down’s Syndrome` (apostrophe)',
    async function () {
      assert.deepEqual(await process('Down’s Syndrome.'), [
        '1:1-1:7: `Down’s Syndrome` may be insensitive, use `Down Syndrome` instead'
      ])
    }
  )

  await t.test('should support ablist language', async function () {
    assert.deepEqual(await process('Eric is mentally ill.'), [
      '1:9-1:17: `mentally ill` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'
    ])
  })

  await t.test('should skip terms explicitly ignored terms', async function () {
    assert.deepEqual(
      await process(
        'The process running on the remote host will pop a job off the queue.',
        {ignore: ['pop']}
      ),
      [
        '1:35-1:39: `host` may be insensitive, use `presenter`, `entertainer`, `emcee` instead'
      ]
    )
  })

  await t.test('should support `insane`', async function () {
    assert.deepEqual(await process('This is insane.'), [
      '1:9-1:15: `insane` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead'
    ])
  })

  await t.test('should support `sane` in a sentence', async function () {
    assert.deepEqual(await process('First we check if the value is sane:'), [
      '1:32-1:36: `sane` may be insensitive, use `correct`, `adequate`, `sufficient`, `consistent`, `valid`, `coherent`, `sensible`, `reasonable` instead'
    ])
  })

  await t.test('should support `sanity check`', async function () {
    assert.deepEqual(await process("Let's do a quick sanity check here."), [
      '1:18-1:24: `sanity check` may be insensitive, use `check`, `assertion`, `validation`, `smoke test` instead'
    ])
  })

  await t.test('should support `him`', async function () {
    assert.deepEqual(await process('I like him.'), [
      '1:8-1:11: `him` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ])
  })

  await t.test('should support `manned`', async function () {
    assert.deepEqual(await process('Manned spacecraft.'), [
      '1:1-1:7: `Manned` may be insensitive, use `Staffed`, `Crewed`, `Piloted` instead'
    ])
  })

  await t.test('should support `moaning`', async function () {
    assert.deepEqual(await process('Moaning, like wormen are always doing.'), [
      '1:1-1:8: `Moaning` may be insensitive, use `Whining`, `Complaining`, `Crying` instead'
    ])
  })

  await t.test('should support `lame`', async function () {
    assert.deepEqual(await process('He muttered some lame excuse.'), [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ])
  })

  await t.test('should support `lame` (2)', async function () {
    assert.deepEqual(await process('He muttered some lame excuse.'), [
      '1:1-1:3: `He` may be insensitive, use `They`, `It` instead',
      '1:18-1:22: `lame` may be insensitive, use `boring`, `dull` instead'
    ])
  })

  await t.test('should support `journeyman`', async function () {
    assert.deepEqual(await process('A journeyman arrived'), [
      '1:3-1:13: `journeyman` may be insensitive, use `journeyperson` instead'
    ])
  })

  await t.test('should support `psychotic`', async function () {
    assert.deepEqual(
      await process('I’m not psychotic, I didn’t have amnesia yesterday.'),
      [
        '1:9-1:18: `psychotic` may be insensitive, use `person with a psychotic condition`, `person with psychosis` instead'
      ]
    )
  })

  await t.test('should support `psycho`', async function () {
    assert.deepEqual(await process('Yeah, you were really psycho to him.'), [
      '1:23-1:29: `psycho` may be insensitive, use `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` instead',
      '1:33-1:36: `him` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead'
    ])
  })

  await t.test('should support `retarded`', async function () {
    assert.deepEqual(await process('I’m so retarded.'), [
      '1:8-1:16: `retarded` may be insensitive, use `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` instead'
    ])
  })

  await t.test('should support `dumb`', async function () {
    assert.deepEqual(await process('This is dumb!'), [
      '1:9-1:13: `dumb` may be insensitive, use `foolish`, `ludicrous`, `speechless`, `silent` instead'
    ])
  })

  await t.test('should support `stupid`', async function () {
    assert.deepEqual(await process('The stupid PS3 controller.'), [
      '1:5-1:11: `stupid` may be insensitive, use `foolish`, `ludicrous`, `unintelligent` instead'
    ])
  })

  await t.test('should support `panic attack`', async function () {
    assert.deepEqual(await process('You almost gave me a panic attack!'), [
      '1:22-1:27: `panic attack` may be insensitive, use `fit of terror`, `scare` instead'
    ])
  })

  await t.test('should support `anorexic`', async function () {
    assert.deepEqual(await process('You look so anorexic!'), [
      '1:13-1:21: `anorexic` may be insensitive, use `thin`, `slim` instead'
    ])
  })

  await t.test('should support `O.C.D.`', async function () {
    assert.deepEqual(await process('My O.C.D. is coming out again!'), [
      '1:4-1:10: `O.C.D.` may be insensitive, use `Has an anxiety disorder`, `Obsessive`, `Pedantic`, `Niggly`, `Picky` instead'
    ])
  })

  await t.test('should support `insomnia`', async function () {
    assert.deepEqual(await process('My insomnia is so bad!'), [
      '1:4-1:12: `insomnia` may be insensitive, use `restlessness`, `sleeplessness` instead'
    ])
  })

  await t.test('should support `depressed`', async function () {
    assert.deepEqual(await process('Yesterday I was feeling depressed.'), [
      '1:25-1:34: `depressed` may be insensitive, use `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` instead'
    ])
  })

  await t.test('should support `committed suicide`', async function () {
    assert.deepEqual(
      await process('When condemned by the ruler he committed suicide.'),
      [
        '1:29-1:31: `he` may be insensitive, use `they`, `it` instead',
        '1:32-1:41: `committed suicide` may be insensitive, use `died by suicide` instead'
      ]
    )
  })

  await t.test('should support `f*g`', async function () {
    assert.deepEqual(await process('I’ll not dye my hair like some fag.'), [
      '1:32-1:35: `fag` may be insensitive, use `gay` instead'
    ])
  })

  await t.test('should ignore literals', async function () {
    assert.deepEqual(
      await process('he - A robust HTML entity encoder/decoder.'),
      []
    )
  })

  await t.test('should support `he’ll`, `hell`', async function () {
    assert.deepEqual(
      await process('When he’ll freeze over, hell freezes over.'),
      ['1:6-1:11: `he’ll` may be insensitive, use `they`, `it` instead']
    )
  })

  await t.test('should support `shell`', async function () {
    assert.deepEqual(await process('She’s enchanted by the hermits shell.'), [
      '1:1-1:6: `She’s` may be insensitive, use `They`, `It` instead'
    ])
  })

  await t.test('should support `sh*m*l*`', async function () {
    assert.deepEqual(await process('That’s a shemale.'), [
      '1:10-1:17: `shemale` may be insensitive, use `transgender person`, `person` instead'
    ])
  })

  await t.test('should support `he-she`', async function () {
    assert.deepEqual(await process('That person is a he-she.'), [
      '1:18-1:24: `he-she` may be insensitive, use `transgender person`, `person` instead'
    ])
  })

  await t.test('should support `wife-beater`', async function () {
    assert.deepEqual(
      await process(
        'it is commonly known as a tank top or by its pejorative nickname, wife-beater.'
      ),
      [
        '1:67-1:78: `wife-beater` may be insensitive, use `tank top`, `sleeveless undershirt` instead'
      ]
    )
  })

  await t.test('should support `great again` (1)', async function () {
    assert.deepEqual(await process('We will make this event great again'), [
      '1:9-1:13: `make this event great again` may be insensitive, use `improve` instead'
    ])
  })

  await t.test('should support `great again` (2)', async function () {
    assert.deepEqual(await process('We will make something great again'), [
      '1:9-1:13: `make something great again` may be insensitive, use `improve` instead'
    ])
  })

  await t.test('should support `handicapable`', async function () {
    assert.deepEqual(await process("They're handicapable."), [
      '1:9-1:21: `handicapable` may be insensitive, use `has a disability`, `person with a disability`, `people with disabilities` instead'
    ])
  })

  await t.test('should support `obviously`', async function () {
    assert.deepEqual(
      await process(
        'Now that the child elements are floated, obviously the parent element will collapse.'
      ),
      ['1:42-1:51: `obviously` may be insensitive, try not to use it']
    )
  })

  await t.test('should support `of course`', async function () {
    assert.deepEqual(
      await process(
        'Of course the retina images are too large for non-retina screens'
      ),
      ['1:1-1:3: `Of course` may be insensitive, try not to use it']
    )
  })

  await t.test('should support `father of`', async function () {
    assert.deepEqual(await process('The father of computers'), [
      '1:5-1:11: `father` may be insensitive, use `parent` instead',
      '1:5-1:11: `father of computers` may be insensitive, use `founder of` instead'
    ])
  })

  await t.test(
    'should support `add` (lowercase, does not warn)',
    async function () {
      assert.deepEqual(await process('Could you add the sugar?'), [])
    }
  )

  await t.test('should support `add` (uppercase)', async function () {
    assert.deepEqual(await process('Their ADD is playing up'), [
      '1:7-1:10: `ADD` may be insensitive, use `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` instead'
    ])
  })

  await t.test('should support `a.d.h.d`', async function () {
    assert.deepEqual(await process('Their A.D.H.D. is playing up'), [
      '1:7-1:15: `A.D.H.D.` may be insensitive, use `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` instead'
    ])
  })

  await t.test('should support `hang`', async function () {
    assert.deepEqual(
      await process(
        'The app hanged when dragging a window between a non-Retina and a Retina display'
      ),
      [
        '1:9-1:15: `hanged` may be insensitive, use `the app froze`, `the app stopped responding`, `the app stopped responding to events`, `the app became unresponsive` instead'
      ]
    )
  })

  await t.test('should support `whitelist`', async function () {
    assert.deepEqual(await process('The user has been whitelisted.'), [
      '1:19-1:30: `whitelisted` may be insensitive, use `passlisted`, `alrightlisted`, `safelisted`, `allow-listed` instead'
    ])
  })

  await t.test('should support `preferred pronoun`', async function () {
    assert.deepEqual(await process('Please use your preferred pronoun'), [
      '1:17-1:26: `preferred pronoun` may be insensitive, use `pronoun`, `pronouns` instead'
    ])
  })

  await t.test('should support `dummy`', async function () {
    assert.deepEqual(
      await process(
        'The value held in the _dummyVariable will be ignored, as will dummy workflow methods.'
      ),
      [
        '1:24-1:37: `dummyVariable` may be insensitive, use `test double`, `placeholder`, `fake`, `stub` instead',
        '1:63-1:68: `dummy` may be insensitive, use `test double`, `placeholder`, `fake`, `stub` instead'
      ]
    )
  })
})

/**
 * Helper to get messages from `retextEquality` in `doc`.
 *
 * @param {string} doc
 *   Document to process.
 * @param {Options | undefined} [options]
 *   Configuration.
 * @returns {Promise<ReadonlyArray<string>>}
 *   Sorted and serialized messages.
 */
async function process(doc, options) {
  const file = await retext().use(retextEquality, options).process(doc)

  return [...file.messages].sort(compareMessage).map(String)
}
