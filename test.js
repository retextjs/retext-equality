/**
 * @typedef {import('./index.js').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import {compareMessage} from 'vfile-sort'
import retextEquality from './index.js'

test('retext-equality', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

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
          'Unexpected potentially insensitive use of `birth defect`, in somes cases `has a disability`, `person with a disability`, `people with disabilities` may be better',
        line: 1,
        name: '1:19-1:31',
        place: {
          start: {line: 1, column: 19, offset: 18},
          end: {line: 1, column: 31, offset: 30}
        },
        reason:
          'Unexpected potentially insensitive use of `birth defect`, in somes cases `has a disability`, `person with a disability`, `people with disabilities` may be better',
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
      '1:1-1:4: Unexpected potentially insensitive use of `her`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
    ])
  })

  await t.test('should support contractions (’ll)', async function () {
    assert.deepEqual(await process('He’ll slips through.'), [
      '1:1-1:6: Unexpected potentially insensitive use of `He’ll`, in somes cases `They`, `It` may be better'
    ])
  })

  await t.test('should support contractions (’s)', async function () {
    assert.deepEqual(await process('She’s incompetent.'), [
      '1:1-1:6: Unexpected potentially insensitive use of `She’s`, in somes cases `They`, `It` may be better'
    ])
  })

  await t.test('should support gender polarising words', async function () {
    assert.deepEqual(await process('Ze frenchmen are comming.'), [
      '1:4-1:13: Unexpected potentially insensitive use of `frenchmen`, in somes cases `french`, `the french` may be better'
    ])
  })

  await t.test('should support case-insensitive pronouns', async function () {
    assert.deepEqual(await process('Her bicycle.'), [
      '1:1-1:4: Unexpected potentially insensitive use of `Her`, when referring to a person, in somes cases `Their`, `Theirs`, `Them` may be better'
    ])
  })

  await t.test('should support case-insensitive pronouns', async function () {
    assert.deepEqual(await process('Frenchmen are coming.'), [
      '1:1-1:10: Unexpected potentially insensitive use of `Frenchmen`, in somes cases `French`, `The french` may be better'
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
          '1:1-1:4: Unexpected potentially insensitive use of `Her`, when referring to a person, in somes cases `Their`, `Theirs`, `Them` may be better',
          '1:9-1:12: Unexpected potentially insensitive use of `his`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
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
      assert.deepEqual(await process('Her or his bicycle.', {noBinary: true}), [
        '1:1-1:4: Unexpected potentially insensitive use of `Her`, when referring to a person, in somes cases `Their`, `Theirs`, `Them` may be better',
        '1:8-1:11: Unexpected potentially insensitive use of `his`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
      ])
    }
  )

  await t.test('should not ignore other close words', async function () {
    assert.deepEqual(await process('Her bike, his bicycle.'), [
      '1:1-1:4: Unexpected potentially insensitive use of `Her`, when referring to a person, in somes cases `Their`, `Theirs`, `Them` may be better',
      '1:11-1:14: Unexpected potentially insensitive use of `his`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
    ])
  })

  await t.test('should support `bipolar` (without dash)', async function () {
    assert.deepEqual(await process('Two bipolar magnets.'), [
      '1:5-1:12: Unexpected potentially insensitive use of `bipolar`, in somes cases `fluctuating`, `person with bipolar disorder` may be better'
    ])
  })

  await t.test('should support `bi-polar` (with dash)', async function () {
    assert.deepEqual(await process('Two bi-polar magnets.'), [
      '1:5-1:13: Unexpected potentially insensitive use of `bi-polar`, in somes cases `fluctuating`, `person with bipolar disorder` may be better'
    ])
  })

  await t.test(
    'should support `Downs Syndrome` (without apostrophe)',
    async function () {
      assert.deepEqual(await process('Downs Syndrome.'), [
        '1:1-1:15: Unexpected potentially insensitive use of `Downs Syndrome`, in somes cases `Down Syndrome` may be better'
      ])
    }
  )

  await t.test(
    'should support `Down’s Syndrome` (apostrophe)',
    async function () {
      assert.deepEqual(await process('Down’s Syndrome.'), [
        '1:1-1:16: Unexpected potentially insensitive use of `Down’s Syndrome`, in somes cases `Down Syndrome` may be better'
      ])
    }
  )

  await t.test('should support ablist language', async function () {
    assert.deepEqual(await process('Eric is mentally ill.'), [
      '1:9-1:21: Unexpected potentially insensitive use of `mentally ill`, in somes cases `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` may be better'
    ])
  })

  await t.test('should skip terms explicitly ignored terms', async function () {
    assert.deepEqual(
      await process(
        'The process running on the remote host will pop a job off the queue.',
        {ignore: ['pop']}
      ),
      [
        '1:35-1:39: Unexpected potentially insensitive use of `host`, in somes cases `presenter`, `entertainer`, `emcee` may be better'
      ]
    )
  })

  await t.test('should support `insane`', async function () {
    assert.deepEqual(await process('This is insane.'), [
      '1:9-1:15: Unexpected potentially insensitive use of `insane`, in somes cases `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` may be better'
    ])
  })

  await t.test('should support `sane` in a sentence', async function () {
    assert.deepEqual(await process('First we check if the value is sane:'), [
      '1:32-1:36: Unexpected potentially insensitive use of `sane`, in somes cases `correct`, `adequate`, `sufficient`, `consistent`, `valid`, `coherent`, `sensible`, `reasonable` may be better'
    ])
  })

  await t.test('should support `sanity check`', async function () {
    assert.deepEqual(await process("Let's do a quick sanity check here."), [
      '1:18-1:30: Unexpected potentially insensitive use of `sanity check`, in somes cases `check`, `assertion`, `validation`, `smoke test` may be better'
    ])
  })

  await t.test('should support `him`', async function () {
    assert.deepEqual(await process('I like him.'), [
      '1:8-1:11: Unexpected potentially insensitive use of `him`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
    ])
  })

  await t.test('should support `manned`', async function () {
    assert.deepEqual(await process('Manned spacecraft.'), [
      '1:1-1:7: Unexpected potentially insensitive use of `Manned`, in somes cases `Staffed`, `Crewed`, `Piloted` may be better'
    ])
  })

  await t.test('should support `moaning`', async function () {
    assert.deepEqual(await process('Moaning, like wormen are always doing.'), [
      '1:1-1:8: Unexpected potentially insensitive use of `Moaning`, in somes cases `Whining`, `Complaining`, `Crying` may be better'
    ])
  })

  await t.test('should support `lame`', async function () {
    assert.deepEqual(await process('He muttered some lame excuse.'), [
      '1:1-1:3: Unexpected potentially insensitive use of `He`, in somes cases `They`, `It` may be better',
      '1:18-1:22: Unexpected potentially insensitive use of `lame`, in somes cases `boring`, `dull` may be better'
    ])
  })

  await t.test('should support `lame` (2)', async function () {
    assert.deepEqual(await process('He muttered some lame excuse.'), [
      '1:1-1:3: Unexpected potentially insensitive use of `He`, in somes cases `They`, `It` may be better',
      '1:18-1:22: Unexpected potentially insensitive use of `lame`, in somes cases `boring`, `dull` may be better'
    ])
  })

  await t.test('should support `journeyman`', async function () {
    assert.deepEqual(await process('A journeyman arrived'), [
      '1:3-1:13: Unexpected potentially insensitive use of `journeyman`, in somes cases `journeyperson` may be better'
    ])
  })

  await t.test('should support `psychotic`', async function () {
    assert.deepEqual(
      await process('I’m not psychotic, I didn’t have amnesia yesterday.'),
      [
        '1:9-1:18: Unexpected potentially insensitive use of `psychotic`, in somes cases `person with a psychotic condition`, `person with psychosis` may be better'
      ]
    )
  })

  await t.test('should support `psycho`', async function () {
    assert.deepEqual(await process('Yeah, you were really psycho to him.'), [
      '1:23-1:29: Unexpected potentially insensitive use of `psycho`, in somes cases `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` may be better',
      '1:33-1:36: Unexpected potentially insensitive use of `him`, when referring to a person, in somes cases `their`, `theirs`, `them` may be better'
    ])
  })

  await t.test('should support `retarded`', async function () {
    assert.deepEqual(await process('I’m so retarded.'), [
      '1:8-1:16: Unexpected potentially insensitive use of `retarded`, in somes cases `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` may be better'
    ])
  })

  await t.test('should support `dumb`', async function () {
    assert.deepEqual(await process('This is dumb!'), [
      '1:9-1:13: Unexpected potentially insensitive use of `dumb`, in somes cases `foolish`, `ludicrous`, `speechless`, `silent` may be better'
    ])
  })

  await t.test('should support `stupid`', async function () {
    assert.deepEqual(await process('The stupid PS3 controller.'), [
      '1:5-1:11: Unexpected potentially insensitive use of `stupid`, in somes cases `foolish`, `ludicrous`, `unintelligent` may be better'
    ])
  })

  await t.test('should support `panic attack`', async function () {
    assert.deepEqual(await process('You almost gave me a panic attack!'), [
      '1:22-1:34: Unexpected potentially insensitive use of `panic attack`, in somes cases `fit of terror`, `scare` may be better'
    ])
  })

  await t.test('should support `anorexic`', async function () {
    assert.deepEqual(await process('You look so anorexic!'), [
      '1:13-1:21: Unexpected potentially insensitive use of `anorexic`, in somes cases `thin`, `slim` may be better'
    ])
  })

  await t.test('should support `O.C.D.`', async function () {
    assert.deepEqual(await process('My O.C.D. is coming out again!'), [
      '1:4-1:10: Unexpected potentially insensitive use of `O.C.D.`, in somes cases `Has an anxiety disorder`, `Obsessive`, `Pedantic`, `Niggly`, `Picky` may be better'
    ])
  })

  await t.test('should support `insomnia`', async function () {
    assert.deepEqual(await process('My insomnia is so bad!'), [
      '1:4-1:12: Unexpected potentially insensitive use of `insomnia`, in somes cases `restlessness`, `sleeplessness` may be better'
    ])
  })

  await t.test('should support `depressed`', async function () {
    assert.deepEqual(await process('Yesterday I was feeling depressed.'), [
      '1:25-1:34: Unexpected potentially insensitive use of `depressed`, in somes cases `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` may be better'
    ])
  })

  await t.test('should support `committed suicide`', async function () {
    assert.deepEqual(
      await process('When condemned by the ruler he committed suicide.'),
      [
        '1:29-1:31: Unexpected potentially insensitive use of `he`, in somes cases `they`, `it` may be better',
        '1:32-1:49: Unexpected potentially insensitive use of `committed suicide`, in somes cases `died by suicide` may be better'
      ]
    )
  })

  await t.test('should support `f*g`', async function () {
    assert.deepEqual(await process('I’ll not dye my hair like some fag.'), [
      '1:32-1:35: Unexpected potentially insensitive use of `fag`, in somes cases `gay` may be better'
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
      [
        '1:6-1:11: Unexpected potentially insensitive use of `he’ll`, in somes cases `they`, `it` may be better'
      ]
    )
  })

  await t.test('should support `shell`', async function () {
    assert.deepEqual(await process('She’s enchanted by the hermits shell.'), [
      '1:1-1:6: Unexpected potentially insensitive use of `She’s`, in somes cases `They`, `It` may be better'
    ])
  })

  await t.test('should support `sh*m*l*`', async function () {
    assert.deepEqual(await process('That’s a shemale.'), [
      '1:10-1:17: Unexpected potentially insensitive use of `shemale`, in somes cases `transgender person`, `person` may be better'
    ])
  })

  await t.test('should support `he-she`', async function () {
    assert.deepEqual(await process('That person is a he-she.'), [
      '1:18-1:24: Unexpected potentially insensitive use of `he-she`, in somes cases `transgender person`, `person` may be better'
    ])
  })

  await t.test('should support `wife-beater`', async function () {
    assert.deepEqual(
      await process(
        'it is commonly known as a tank top or by its pejorative nickname, wife-beater.'
      ),
      [
        '1:67-1:78: Unexpected potentially insensitive use of `wife-beater`, in somes cases `tank top`, `sleeveless undershirt` may be better'
      ]
    )
  })

  await t.test('should support `great again` (1)', async function () {
    assert.deepEqual(await process('We will make this event great again'), [
      '1:9-1:36: Unexpected potentially insensitive use of `make this event great again`, in somes cases `improve` may be better'
    ])
  })

  await t.test('should support `great again` (2)', async function () {
    assert.deepEqual(await process('We will make something great again'), [
      '1:9-1:35: Unexpected potentially insensitive use of `make something great again`, in somes cases `improve` may be better'
    ])
  })

  await t.test('should support `handicapable`', async function () {
    assert.deepEqual(await process("They're handicapable."), [
      '1:9-1:21: Unexpected potentially insensitive use of `handicapable`, in somes cases `has a disability`, `person with a disability`, `people with disabilities` may be better'
    ])
  })

  await t.test('should support `obviously`', async function () {
    assert.deepEqual(
      await process(
        'Now that the child elements are floated, obviously the parent element will collapse.'
      ),
      [
        '1:42-1:51: Unexpected potentially insensitive use of `obviously`, try not to use it'
      ]
    )
  })

  await t.test('should support `of course`', async function () {
    assert.deepEqual(
      await process(
        'Of course the retina images are too large for non-retina screens'
      ),
      [
        '1:1-1:10: Unexpected potentially insensitive use of `Of course`, try not to use it'
      ]
    )
  })

  await t.test('should support `father of`', async function () {
    assert.deepEqual(await process('The father of computers'), [
      '1:5-1:11: Unexpected potentially insensitive use of `father`, in somes cases `parent` may be better',
      '1:5-1:24: Unexpected potentially insensitive use of `father of computers`, in somes cases `founder of` may be better'
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
      '1:7-1:10: Unexpected potentially insensitive use of `ADD`, in somes cases `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` may be better'
    ])
  })

  await t.test('should support `a.d.h.d`', async function () {
    assert.deepEqual(await process('Their A.D.H.D. is playing up'), [
      '1:7-1:15: Unexpected potentially insensitive use of `A.D.H.D.`, in somes cases `Disorganized`, `Distracted`, `Energetic`, `Hyperactive`, `Impetuous`, `Impulsive`, `Inattentive`, `Restless`, `Unfocused` may be better'
    ])
  })

  await t.test('should support `hang`', async function () {
    assert.deepEqual(
      await process(
        'The app hanged when dragging a window between a non-Retina and a Retina display'
      ),
      [
        '1:9-1:15: Unexpected potentially insensitive use of `hanged`, in somes cases `the app froze`, `the app stopped responding`, `the app stopped responding to events`, `the app became unresponsive` may be better'
      ]
    )
  })

  await t.test('should support `whitelist`', async function () {
    assert.deepEqual(await process('The user has been whitelisted.'), [
      '1:19-1:30: Unexpected potentially insensitive use of `whitelisted`, in somes cases `passlisted`, `alrightlisted`, `safelisted`, `allow-listed` may be better'
    ])
  })

  await t.test('should support `preferred pronoun`', async function () {
    assert.deepEqual(await process('Please use your preferred pronoun'), [
      '1:17-1:34: Unexpected potentially insensitive use of `preferred pronoun`, in somes cases `pronoun`, `pronouns` may be better'
    ])
  })

  await t.test('should support `dummy`', async function () {
    assert.deepEqual(
      await process(
        'The value held in the _dummyVariable will be ignored, as will dummy workflow methods.'
      ),
      [
        '1:24-1:37: Unexpected potentially insensitive use of `dummyVariable`, in somes cases `test double`, `placeholder`, `fake`, `stub` may be better',
        '1:63-1:68: Unexpected potentially insensitive use of `dummy`, in somes cases `test double`, `placeholder`, `fake`, `stub` may be better'
      ]
    )
  })
})

/**
 * Helper to get messages from `retextEquality`.
 *
 * @param {string} value
 *   Document to process.
 * @param {Options | undefined} [options]
 *   Configuration (optional).
 * @returns {Promise<ReadonlyArray<string>>}
 *   Sorted and serialized messages.
 */
async function process(value, options) {
  const file = await retext().use(retextEquality, options).process(value)

  return [...file.messages].sort(compareMessage).map(String)
}
