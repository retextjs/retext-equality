# Rules

## Pattern types

###### Basic

**Basic** patterns highlight possible inconsiderate terms and suggest
potentially more considerate alternatives.

###### Or

**Or** patterns highlight possible inconsiderate terms unless every category is
present.
This is used for gendered work titles and the like, where `garbageman and
garbagewoman` is considered OK, and so is `his or her bike`.
These patterns can be turned into **basic** patterns by passing `noBinary:
true`, thus suggesting two alternatives for `him or her`.

**Or** patterns can be joined by `and`, `or`, or a slash (`/`).

## List of Rules

| id | type | not ok | ok |
| - | - | - | - |
| `learning-disabled` | [basic](#basic) | `learning disabled` | `person with learning disabilities` |
| `invalid` | [basic](#basic) | `disabled`, `invalid` | `turned off`, `has a disability`, `person with a disability`, `people with disabilities` |
| `birth-defect` | [basic](#basic) | `birth defect` | `has a disability`, `person with a disability`, `people with disabilities` |
| `suffers-from-disabilities` | [basic](#basic) | `suffers from disabilities`, `suffering from disabilities`, `suffering from a disability`, `afflicted with disabilities`, `afflicted with a disability` | `has a disability`, `person with a disability`, `people with disabilities` |
| `intellectually-disabled-people` | [basic](#basic) | `intellectually disabled people` | `people with intellectual disabilities` |
| `intellectually-disabled` | [basic](#basic) | `intellectually disabled`, `has intellectual issues`, `suffers from intellectual disabilities`, `suffering from intellectual disabilities`, `suffering from an intellectual disability`, `afflicted with intellectual disabilities`, `afflicted with a intellectual disability` | `person with an intellectual disability` |
| `nuts` | [basic](#basic) | `batshit`, `psycho`, `crazy`, `delirious`, `insane`, `insanity`, `loony`, `lunacy`, `lunatic`, `mentally ill`, `psychopathology`, `mental defective`, `moron`, `moronic`, `nuts`, `mental case`, `mental` | `rude`, `malicious`, `mean`, `disgusting`, `incredible`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` |
| `insanely` | [basic](#basic) | `insanely` | `incredibly` |
| `sane` | [basic](#basic) | `sane` | `correct`, `adequate`, `sufficient`, `consistent`, `valid`, `coherent`, `sensible`, `reasonable` |
| `sanity-check` | [basic](#basic) | `sanity check` | `check`, `assertion`, `validation`, `smoke test` |
| `bipolar` | [basic](#basic) | `bipolar` | `fluctuating`, `person with bipolar disorder` |
| `schizo` | [basic](#basic) | `schizophrenic`, `schizo` | `person with schizophrenia` |
| `manic` | [basic](#basic) | `suffers from schizophrenia`, `suffering from schizophrenia`, `afflicted with schizophrenia`, `manic` | `person with schizophrenia` |
| `handicapped-parking` | [basic](#basic) | `handicapped parking` | `accessible parking` |
| `handicapped` | [basic](#basic) | `handicapped` | `person with a handicap`, `accessible` |
| `amputee` | [basic](#basic) | `amputee` | `person with an amputation` |
| `gimp` | [basic](#basic) | `cripple`, `crippled`, `gimp` | `person with a limp` |
| `mongoloid` | [basic](#basic) | `mongoloid` | `person with Down Syndrome` |
| `stroke-victim` | [basic](#basic) | `stroke victim`, `suffering from a stroke`, `victim of a stroke` | `individual who has had a stroke` |
| `multiple-sclerosis-victim` | [basic](#basic) | `suffers from multiple sclerosis`, `suffering from multiple sclerosis`, `victim of multiple sclerosis`, `multiple sclerosis victim`, `afflicted with multiple sclerosis` | `person who has multiple sclerosis` |
| `suffers-from-md` | [basic](#basic) | `suffers from muscular dystrophy`, `afflicted with muscular dystrophy`, `suffers from MD`, `afflicted with MD` | `person who has muscular dystrophy` |
| `family-burden` | [basic](#basic) | `family burden` | `with family support needs` |
| `asylum` | [basic](#basic) | `asylum` | `psychiatric hospital`, `mental health hospital` |
| `bedlam` | [basic](#basic) | `bedlam`, `madhouse`, `loony bin` | `chaos`, `hectic`, `pandemonium` |
| `downs-syndrome` | [basic](#basic) | `downs syndrome` | `Down Syndrome` |
| `retard` | [basic](#basic) | `retard`, `retarded`, `short bus` | `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` |
| `retards` | [basic](#basic) | `retards` | `sillies`, `dullards`, `people with developmental disabilities`, `people with Down’s Syndrome`, `delays`, `holds back` |
| `psychotic` | [basic](#basic) | `psychotic`, `suffers from psychosis`, `suffering from psychosis`, `afflicted with psychosis`, `victim of psychosis` | `person with a psychotic condition`, `person with psychosis` |
| `lame` | [basic](#basic) | `lame` | `boring`, `dull` |
| `aids-victim` | [basic](#basic) | `suffering from aids`, `suffer from aids`, `suffers from aids`, `afflicted with aids`, `victim of aids`, `aids victim` | `person with AIDS` |
| `wheelchair-bound` | [basic](#basic) | `confined to a wheelchair`, `bound to a wheelchair`, `restricted to a wheelchair`, `wheelchair bound` | `uses a wheelchair` |
| `special-olympians` | [basic](#basic) | `special olympians`, `special olympic athletes` | `athletes`, `Special Olympics athletes` |
| `ablebodied` | [basic](#basic) | `ablebodied` | `non-disabled` |
| `addict` | [basic](#basic) | `addict`, `junkie` | `person with a drug addiction`, `person recovering from a drug addiction` |
| `addicts` | [basic](#basic) | `addicts`, `junkies` | `people with a drug addiction`, `people recovering from a drug addiction` |
| `alcoholic` | [basic](#basic) | `alcoholic`, `alcohol abuser` | `someone with an alcohol problem` |
| `deafmute` | [basic](#basic) | `deaf and dumb`, `deafmute` | `deaf` |
| `senile` | [basic](#basic) | `demented`, `senile` | `person with dementia` |
| `depressed` | [basic](#basic) | `depressed` | `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` |
| `dwarf` | [basic](#basic) | `vertically challenged`, `midget`, `small person`, `dwarf` | `person with dwarfism`, `little person`, `little people`, `LP`, `person of short stature` |
| `dyslexic` | [basic](#basic) | `dyslexic` | `person with dyslexia` |
| `epileptic` | [basic](#basic) | `epileptic` | `person with epilepsy` |
| `hearing-impaired` | [basic](#basic) | `hearing impaired`, `hearing impairment` | `hard of hearing`, `partially deaf`, `partial hearing loss`, `deaf` |
| `victim-of-polio` | [basic](#basic) | `infantile paralysis`, `suffers from polio`, `suffering from polio`, `suffering from a polio`, `afflicted with polio`, `afflicted with a polio`, `victim of polio` | `polio`, `person who had polio` |
| `victim-of-an-injury` | [basic](#basic) | `suffer from an injury`, `suffers from an injury`, `suffering from an injury`, `afflicted with an injury`, `victim of an injury` | `sustain an injury`, `receive an injury` |
| `victim-of-injuries` | [basic](#basic) | `suffer from injuries`, `suffers from injuries`, `suffering from injuries`, `afflicted with injuries`, `victim of injuries` | `sustain injuries`, `receive injuries` |
| `paraplegic` | [basic](#basic) | `paraplegic` | `person with paraplegia` |
| `quadriplegic` | [basic](#basic) | `quadriplegic` | `person with quadriplegia` |
| `spaz` | [basic](#basic) | `spaz` | `person with cerebral palsy`, `twitch`, `flinch`, `hectic` |
| `spastic` | [basic](#basic) | `spastic` | `person with cerebral palsy`, `twitch`, `flinch` |
| `stammering` | [basic](#basic) | `stammering` | `stuttering`, `disfluency of speech` |
| `stutterer` | [basic](#basic) | `stutterer` | `person who stutters` |
| `tourettes-syndrome` | [basic](#basic) | `tourettes syndrome`, `tourettes disorder` | `Tourette syndrome` |
| `rehab-center` | [basic](#basic) | `rehab center`, `detox center` | `treatment center` |
| `rehab` | [basic](#basic) | `rehab`, `detox` | `treatment` |
| `sociopath` | [basic](#basic) | `sociopath` | `person with a personality disorder`, `person with psychopathic personality` |
| `sociopaths` | [basic](#basic) | `sociopaths` | `people with psychopathic personalities`, `people with a personality disorder` |
| `dumb` | [basic](#basic) | `dumb` | `foolish`, `ludicrous`, `speechless`, `silent` |
| `wacko` | [basic](#basic) | `simpleton`, `stupid`, `wacko`, `whacko`, `low iq` | `foolish`, `ludicrous`, `unintelligent` |
| `panic-attack` | [basic](#basic) | `panic attack` | `fit of terror`, `scare` |
| `bony` | [basic](#basic) | `anorexic`, `bony` | `thin`, `slim` |
| `ocd` | [basic](#basic) | `neurotic`, `ocd`, `o.c.d`, `o.c.d.` | `has an anxiety disorder`, `obsessive`, `pedantic`, `niggly`, `picky` |
| `insomnia` | [basic](#basic) | `insomnia` | `restlessness`, `sleeplessness` |
| `insomniac` | [basic](#basic) | `insomniac` | `person who has insomnia` |
| `insomniacs` | [basic](#basic) | `insomniacs` | `people who have insomnia` |
| `barren` | [basic](#basic) | `barren` | `empty`, `sterile`, `infertile` |
| `deaf-to` | [basic](#basic) | `blind to`, `blind eye to`, `blinded by`, `deaf to`, `deaf ear to`, `deafened by` | `careless`, `heartless`, `indifferent`, `insensitive` |
| `cretin` | [basic](#basic) | `cretin` | `creep`, `fool` |
| `daft` | [basic](#basic) | `daft` | `absurd`, `foolish` |
| `idiot` | [basic](#basic) | `feebleminded`, `feeble minded`, `idiot`, `imbecile` | `foolish`, `ludicrous`, `silly` |
| `harelipped` | [basic](#basic) | `harelipped`, `cleftlipped` | `person with a cleft-lip and palate` |
| `harelip` | [basic](#basic) | `harelip`, `hare lip` | `cleft-lip and palate` |
| `maniac` | [basic](#basic) | `maniac` | `fanatic`, `zealot`, `enthusiast` |
| `buckteeth` | [basic](#basic) | `bucktoothed`, `buckteeth` | `person with prominent teeth`, `prominent teeth` |
| `special` | [basic](#basic) | `challenged`, `diffability`, `differently abled`, `handicapable`, `special`, `special needs`, `specially abled` | `has a disability`, `person with a disability`, `people with disabilities` |
| `libtard` | [basic](#basic) | `fucktard`, `libtard`, `contard` | `disagreeable`, `uneducated`, `ignorant`, `naive`, `inconsiderate` |
| `add` | [basic](#basic) | `ADD`, `adhd`, `a.d.d.`, `a.d.h.d.` | `disorganized`, `distracted`, `energetic`, `hyperactive`, `impetuous`, `impulsive`, `inattentive`, `restless`, `unfocused` |
| `dummy` | [basic](#basic) | `dummyvariable`, `dummyvalue`, `dummyobject`, `dummy` | `test double`, `placeholder`, `fake`, `stub` |
| `binge` | [basic](#basic) | `binge` | `enthusiastic`, `spree` |
| `obvious` | [basic](#basic) | `obvious`, `obviously` | |
| `just` | [basic](#basic) | `just` | |
| `basically` | [basic](#basic) | `basically` | |
| `simple` | [basic](#basic) | `simple`, `simply` | |
| `easy` | [basic](#basic) | `easy`, `easily` | |
| `of-course` | [basic](#basic) | `of course` | |
| `clearly` | [basic](#basic) | `clearly` | |
| `everyone-knows` | [basic](#basic) | `everyone knows` | |
| `straightforward` | [basic](#basic) | `straight forward`, `straightforward`, `straight forwardly`, `straightforwardly` | |
| `her-him` | [or](#or) | `her` (female), `hers` (female), `him` (male), `his` (male) | `their`, `theirs`, `them` |
| `he-she` | [or](#or) | `she` (female), `he` (male), `she'd` (female), `he'd` (male), `she'll` (female), `he'll` (male), `she's` (female), `he's` (male) | `they`, `it` |
| `herself-himself` | [or](#or) | `herself` (female), `himself` (male) | `themselves`, `theirself`, `self` |
| `boy-girl` | [or](#or) | `girl` (female), `boy` (male) | `kid`, `child`, `youth` |
| `gals-man` | [or](#or) | `women` (female), `girls` (female), `gals` (female), `ladies` (female), `man` (male), `boys` (male), `men` (male), `guys` (male), `dudes` (male), `gents` (male), `gentlemen` (male) | `people`, `persons`, `folks` |
| `gal-guy` | [or](#or) | `woman` (female), `gal` (female), `lady` (female), `babe` (female), `bimbo` (female), `chick` (female), `guy` (male), `lad` (male), `fellow` (male), `dude` (male), `bro` (male), `gentleman` (male) | `person`, `friend`, `pal`, `folk`, `individual` |
| `fatherland-motherland` | [or](#or) | `motherland` (female), `fatherland` (male) | `native land`, `homeland` |
| `father-tongue-mother-tongue` | [or](#or) | `mother tongue` (female), `father tongue` (male) | `native tongue`, `native language` |
| `freshmen-freshwomen` | [or](#or) | `freshwomen` (female), `freshmen` (male) | `first-year students`, `freshers` |
| `garbageman-garbagewoman` | [or](#or) | `garbagewoman` (female), `garbageman` (male) | `garbage collector`, `waste collector`, `trash collector` |
| `garbagemen-garbagewomen` | [or](#or) | `garbagewomen` (female), `garbagemen` (male) | `garbage collectors`, `waste collectors`, `trash collectors` |
| `chairman-chairwoman` | [or](#or) | `chairwoman` (female), `chairman` (male) | `chair`, `head`, `chairperson`, `coordinator`, `committee head`, `moderator`, `presiding officer` |
| `committee-man-committee-woman` | [or](#or) | `committee woman` (female), `committee man` (male) | `committee member` |
| `cowboy-cowgirl` | [or](#or) | `cowgirl` (female), `cowboy` (male) | `cowhand` |
| `cowboys-cowgirls` | [or](#or) | `cowgirls` (female), `cowboys` (male) | `cowhands` |
| `cattleman-cattlewoman` | [or](#or) | `cattlewoman` (female), `cattleman` (male) | `cattle rancher` |
| `cattlemen-cattlewomen` | [or](#or) | `cattlewomen` (female), `cattlemen` (male) | `cattle ranchers` |
| `chairmen-chairwomen` | [or](#or) | `chairwomen` (female), `chairmen` (male) | `chairs`, `chairpersons`, `coordinators` |
| `postman-postwoman` | [or](#or) | `postwoman` (female), `mailwoman` (female), `postman` (male), `mailman` (male) | `mail carrier`, `letter carrier`, `postal worker` |
| `postmen-postwomen` | [or](#or) | `postwomen` (female), `mailwomen` (female), `postmen` (male), `mailmen` (male) | `mail carriers`, `letter carriers`, `postal workers` |
| `chick-cop-policeman` | [or](#or) | `policewoman` (female), `policeman` (male), `chick cop` (female) | `officer`, `police officer` |
| `policemen-policewomen` | [or](#or) | `policewomen` (female), `policemen` (male) | `officers`, `police officers` |
| `steward-stewardess` | [or](#or) | `stewardess` (female), `steward` (male) | `flight attendant` |
| `stewardesses-stewards` | [or](#or) | `stewardesses` (female), `stewards` (male) | `flight attendants` |
| `congressman-congresswoman` | [or](#or) | `congresswoman` (female), `congressman` (male) | `member of congress`, `congress person`, `legislator`, `representative` |
| `congressmen-congresswomen` | [or](#or) | `congresswomen` (female), `congressmen` (male) | `members of congress`, `congress persons`, `legislators`, `representatives` |
| `fireman-firewoman` | [or](#or) | `firewoman` (female), `fireman` (male) | `fire fighter`, `fire officer` |
| `firemen-firewomen` | [or](#or) | `firewomen` (female), `firemen` (male) | `fire fighters` |
| `fisherman-fisherwoman` | [or](#or) | `fisherwoman` (female), `fisherman` (male) | `fisher`, `crew member`, `fisherfolk`, `angler` |
| `fishermen-fisherwomen` | [or](#or) | `fisherwomen` (female), `fishermen` (male) | `fishers` |
| `brotherhood-sisterhood` | [or](#or) | `sisterhood` (female), `brotherhood` (male) | `kinship`, `community` |
| `common-girl-common-man` | [or](#or) | `common girl` (female), `common man` (male) | `common person`, `average person` |
| `salaryman-salarywoman` | [or](#or) | `businesswoman` (female), `salarywoman` (female), `businessman` (male), `salaryman` (male) | `business executive`, `entrepreneur`, `business person`, `professional` |
| `salarymen-salarywomen` | [or](#or) | `businesswomen` (female), `salarywomen` (female), `career girl` (female), `career woman` (female), `businessmen` (male), `salarymen` (male) | `business executives`, `entrepreneurs` |
| `janitor-janitress` | [or](#or) | `cleaning lady` (female), `cleaning girl` (female), `cleaning woman` (female), `janitress` (female), `cleaning man` (male), `cleaning boy` (male), `janitor` (male) | `cleaner` |
| `janitors-janitresses` | [or](#or) | `cleaning ladies` (female), `cleaning girls` (female), `janitresses` (female), `cleaning men` (male), `janitors` (male) | `cleaners`, `housekeeping` |
| `delivery-boy-delivery-girl` | [or](#or) | `delivery girl` (female), `delivery boy` (male) | `courier`, `messenger` |
| `foreman-forewoman` | [or](#or) | `forewoman` (female), `foreman` (male) | `supervisor`, `shift boss` |
| `frontman,-front-man-frontwoman,-front-woman` | [or](#or) | `frontwoman, front woman` (female), `frontman, front man` (male) | `lead`, `front`, `figurehead` |
| `front-men,-frontmen-front-women,-frontwomen` | [or](#or) | `front women, frontwomen` (female), `front men, frontmen` (male) | `figureheads` |
| `foremen-forewomen` | [or](#or) | `forewomen` (female), `foremen` (male) | `supervisors`, `shift bosses` |
| `insurance-man-insurance-woman` | [or](#or) | `insurance woman` (female), `insurance man` (male) | `insurance agent` |
| `insurance-men-insurance-women` | [or](#or) | `insurance women` (female), `insurance men` (male) | `insurance agents` |
| `landlady-landlord` | [or](#or) | `landlady` (female), `landlord` (male) | `proprietor`, `building manager` |
| `landladies-landlords` | [or](#or) | `landladies` (female), `landlords` (male) | `proprietors`, `building managers` |
| `alumna-alumnus` | [or](#or) | `alumna` (female), `alumnus` (male) | `graduate` |
| `alumnae-alumni` | [or](#or) | `alumnae` (female), `alumni` (male) | `graduates` |
| `newsman-newswoman` | [or](#or) | `newswoman` (female), `newspaperwoman` (female), `anchorwoman` (female), `newsman` (male), `newspaperman` (male), `anchorman` (male) | `anchor`, `journalist` |
| `newsmen-newswomen` | [or](#or) | `newswomen` (female), `newspaperwomen` (female), `anchorwomen` (female), `newsmen` (male), `newspapermen` (male), `anchormen` (male) | `anchors`, `journalists` |
| `repairman-repairwoman` | [or](#or) | `repairwoman` (female), `repairman` (male) | `repairer`, `technician` |
| `repairmen-repairwomen` | [or](#or) | `repairwomen` (female), `repairmen` (male) | `technicians` |
| `saleslady-salesman` | [or](#or) | `saleswoman` (female), `sales woman` (female), `saleslady` (female), `salesman` (male), `sales man` (male) | `salesperson`, `sales clerk`, `sales rep`, `sales agent`, `sales attendant`, `seller`, `shop assistant` |
| `salesmen-saleswomen` | [or](#or) | `saleswomen` (female), `sales women` (female), `salesladies` (female), `salesmen` (male), `sales men` (male) | `sales clerks`, `sales reps`, `sales agents`, `sellers` |
| `serviceman-servicewoman` | [or](#or) | `servicewoman` (female), `serviceman` (male) | `soldier`, `service representative` |
| `servicemen-servicewomen` | [or](#or) | `servicewomen` (female), `servicemen` (male) | `soldiers`, `service representatives` |
| `waiter-waitress` | [or](#or) | `waitress` (female), `waiter` (male) | `server` |
| `waiters-waitresses` | [or](#or) | `waitresses` (female), `waiters` (male) | `servers` |
| `workman-workwoman` | [or](#or) | `workwoman` (female), `working woman` (female), `workman` (male), `working man` (male) | `worker`, `wage earner`, `taxpayer` |
| `workmen-workwomen` | [or](#or) | `workwomen` (female), `workmen` (male) | `workers` |
| `actor-actress` | [or](#or) | `actress` (female), `actor` (male) | `performer`, `star`, `artist`, `entertainer` |
| `actors-actresses` | [or](#or) | `actresses` (female), `actors` (male) | `performers`, `stars`, `artists`, `entertainers` |
| `aircrewwoman-airman` | [or](#or) | `aircrewwoman` (female), `aircrew woman` (female), `aircrewman` (male), `airman` (male) | `pilot`, `aviator`, `airstaff` |
| `aircrewwomen-airmen` | [or](#or) | `aircrewwomen` (female), `aircrew women` (female), `aircrewmen` (male), `airmen` (male) | `pilots`, `aviators`, `airstaff` |
| `alderman-alderwoman` | [or](#or) | `alderwoman` (female), `alderman` (male) | `cabinet member` |
| `aldermen-alderwomen` | [or](#or) | `alderwomen` (female), `aldermen` (male) | `cabinet`, `cabinet members`, `alderperson` |
| `assemblyman-assemblywoman` | [or](#or) | `assemblywoman` (female), `assemblyman` (male) | `assembly person`, `assembly worker` |
| `aunt-uncle` | [or](#or) | `kinswoman` (female), `aunt` (female), `kinsman` (male), `uncle` (male) | `relative` |
| `aunts-uncles` | [or](#or) | `kinswomen` (female), `aunts` (female), `kinsmen` (male), `uncles` (male) | `relatives` |
| `boogeyman-boogeywoman` | [or](#or) | `boogeywoman` (female), `boogeyman` (male) | `boogeymonster` |
| `boogieman-boogiewoman` | [or](#or) | `boogiewoman` (female), `boogieman` (male) | `boogeymonster` |
| `bogeyman-bogeywoman` | [or](#or) | `bogeywoman` (female), `bogeyman` (male) | `bogeymonster` |
| `bogieman-bogiewoman` | [or](#or) | `bogiewoman` (female), `bogieman` (male) | `bogeymonster` |
| `boogiemen-boogiewomen` | [or](#or) | `boogiewomen` (female), `boogiemen` (male) | `boogeymonsters` |
| `bogiemen-bogiewomen` | [or](#or) | `bogiewomen` (female), `bogiemen` (male) | `bogeymonsters` |
| `bondsman-bondswoman` | [or](#or) | `bondswoman` (female), `bondsman` (male) | `bonder` |
| `bondsmen-bondswomen` | [or](#or) | `bondswomen` (female), `bondsmen` (male) | `bonders` |
| `husband-wife` | [or](#or) | `wife` (female), `husband` (male) | `partner`, `significant other`, `spouse` |
| `husbands-wives` | [or](#or) | `wives` (female), `husbands` (male) | `partners`, `significant others`, `spouses` |
| `boyfriend-girlfriend` | [or](#or) | `girlfriend` (female), `boyfriend` (male) | `partner`, `friend`, `significant other` |
| `boyfriends-girlfriends` | [or](#or) | `girlfriends` (female), `boyfriends` (male) | `partners`, `friends`, `significant others` |
| `boyhood-girlhood` | [or](#or) | `girlhood` (female), `boyhood` (male) | `childhood` |
| `boyish-girly` | [or](#or) | `girly` (female), `girlish` (female), `boyish` (male) | `childish` |
| `journeyman-journeywoman` | [or](#or) | `journeywoman` (female), `journeyman` (male) | `journeyperson` |
| `journeymen-journeywomen` | [or](#or) | `journeywomen` (female), `journeymen` (male) | `journeypersons` |
| `godfather-godmother` | [or](#or) | `godmother` (female), `patroness` (female), `godfather` (male) | `godparent`, `elder`, `patron` |
| `granddaughter-grandson` | [or](#or) | `granddaughter` (female), `grandson` (male) | `grandchild` |
| `granddaughters-grandsons` | [or](#or) | `granddaughters` (female), `grandsons` (male) | `grandchildren` |
| `forefather-foremother` | [or](#or) | `foremother` (female), `forefather` (male) | `ancestor` |
| `forefathers-foremothers` | [or](#or) | `foremothers` (female), `forefathers` (male) | `ancestors` |
| `gramps-granny` | [or](#or) | `granny` (female), `grandma` (female), `grandmother` (female), `grandpappy` (male), `granddaddy` (male), `gramps` (male), `grandpa` (male), `grandfather` (male) | `grandparent`, `ancestor` |
| `grandfathers-grandmothers` | [or](#or) | `grandmothers` (female), `grandfathers` (male) | `grandparents`, `ancestors` |
| `bride-groom` | [or](#or) | `bride` (female), `groom` (male) | `spouse`, `newlywed` |
| `brother-sister` | [or](#or) | `sister` (female), `brother` (male) | `sibling` |
| `brothers-sisters` | [or](#or) | `sisters` (female), `brothers` (male) | `siblings` |
| `cameraman-camerawoman` | [or](#or) | `camerawoman` (female), `cameraman` (male) | `camera operator`, `camera person` |
| `cameramen-camerawomen` | [or](#or) | `camerawomen` (female), `cameramen` (male) | `camera operators` |
| `caveman-cavewoman` | [or](#or) | `cavewoman` (female), `caveman` (male) | `troglodyte`, `hominidae` |
| `cavemen-cavewomen` | [or](#or) | `cavewomen` (female), `cavemen` (male) | `troglodytae`, `troglodyti`, `troglodytes`, `hominids` |
| `clergyman-clergywoman` | [or](#or) | `clergywoman` (female), `clergyman` (male) | `clergyperson`, `clergy`, `cleric` |
| `clergymen-clergywomen` | [or](#or) | `clergywomen` (female), `clergymen` (male) | `clergies`, `clerics` |
| `councilman-councilwoman` | [or](#or) | `councilwoman` (female), `councilman` (male) | `council member` |
| `councilmen-councilwomen` | [or](#or) | `councilwomen` (female), `councilmen` (male) | `council members` |
| `countryman-countrywoman` | [or](#or) | `countrywoman` (female), `countryman` (male) | `country person` |
| `countrymen-countrywomen` | [or](#or) | `countrywomen` (female), `countrymen` (male) | `country folk` |
| `handyman-handywoman` | [or](#or) | `handywoman` (female), `craftswoman` (female), `handyman` (male), `craftsman` (male) | `artisan`, `craftsperson`, `skilled worker` |
| `host-hostess` | [or](#or) | `hostess` (female), `host` (male) | `presenter`, `entertainer`, `emcee` |
| `hostesses-hosts` | [or](#or) | `hostesses` (female), `hosts` (male) | `presenters`, `entertainers`, `emcees` |
| `handymen-handywomen` | [or](#or) | `handywomen` (female), `craftswomen` (female), `handymen` (male), `craftsmen` (male) | `artisans`, `craftspersons`, `skilled workers` |
| `hangman-hangwoman` | [or](#or) | `hangwoman` (female), `hangman` (male) | `guillotine` |
| `hangmen-hangwomen` | [or](#or) | `hangwomen` (female), `hangmen` (male) | `guillotines` |
| `henchman-henchwoman` | [or](#or) | `henchwoman` (female), `henchman` (male) | `sidekick` |
| `henchmen-henchwomen` | [or](#or) | `henchwomen` (female), `henchmen` (male) | `sidekicks` |
| `hero-heroine` | [or](#or) | `heroine` (female), `hero` (male) | `role-model`, `mentor` |
| `heroes-heroines` | [or](#or) | `heroines` (female), `heroes` (male) | `role-models`, `mentor` |
| `maternal-paternal` | [or](#or) | `maternal` (female), `paternal` (male), `fraternal` (male) | `parental`, `warm`, `intimate` |
| `maternity-paternity` | [or](#or) | `maternity` (female), `paternity` (male) | `parental` |
| `dads-moms` | [or](#or) | `mamas` (female), `mothers` (female), `moms` (female), `mums` (female), `mommas` (female), `mommies` (female), `papas` (male), `fathers` (male), `dads` (male), `daddies` (male) | `parents` |
| `dad-mom` | [or](#or) | `mama` (female), `mother` (female), `mom` (female), `mum` (female), `momma` (female), `mommy` (female), `papa` (male), `father` (male), `dad` (male), `pop` (male), `daddy` (male) | `parent` |
| `daughter-son` | [or](#or) | `daughter` (female), `son` (male) | `child` |
| `daughters-sons` | [or](#or) | `daughters` (female), `sons` (male) | `children` |
| `doorman-doorwoman` | [or](#or) | `doorwoman` (female), `doorman` (male) | `concierge` |
| `doormen-doorwomen` | [or](#or) | `doorwomen` (female), `doormen` (male) | `concierges` |
| `feminin-manly` | [or](#or) | `feminin` (female), `dudely` (male), `manly` (male) | `humanly`, `mature` |
| `females-males` | [or](#or) | `females` (female), `males` (male) | `humans` |
| `king-queen` | [or](#or) | `empress` (female), `queen` (female), `emperor` (male), `king` (male) | `ruler` |
| `kings-queens` | [or](#or) | `empresses` (female), `queens` (female), `emperors` (male), `kings` (male) | `rulers` |
| `kingsize-queensize` | [or](#or) | `queensize` (female), `kingsize` (male) | `jumbo`, `gigantic` |
| `kingmaker-queenmaker` | [or](#or) | `queenmaker` (female), `kingmaker` (male) | `power behind the throne` |
| `layman-laywoman` | [or](#or) | `laywoman` (female), `layman` (male) | `civilian` |
| `laymen-laywomen` | [or](#or) | `laywomen` (female), `laymen` (male) | `civilians` |
| `dame-lord` | [or](#or) | `dame` (female), `lord` (male) | `official`, `owner`, `expert`, `superior`, `chief`, `ruler` |
| `dames-lords` | [or](#or) | `dames` (female), `lords` (male) | `officials`, `chiefs`, `rulers` |
| `manhood-womanhood` | [or](#or) | `womanhood` (female), `masculinity` (male), `manhood` (male) | `adulthood`, `personhood`, `maturity` |
| `femininity-manliness` | [or](#or) | `femininity` (female), `manliness` (male) | `humanity` |
| `marksman-markswoman` | [or](#or) | `markswoman` (female), `marksman` (male) | `shooter` |
| `marksmen-markswomen` | [or](#or) | `markswomen` (female), `marksmen` (male) | `shooters` |
| `middleman-middlewoman` | [or](#or) | `middlewoman` (female), `middleman` (male) | `intermediary`, `go-between` |
| `middlemen-middlewomen` | [or](#or) | `middlewomen` (female), `middlemen` (male) | `intermediaries`, `go-betweens` |
| `milkman-milkwoman` | [or](#or) | `milkwoman` (female), `milkman` (male) | `milk person` |
| `milkmen-milkwomen` | [or](#or) | `milkwomen` (female), `milkmen` (male) | `milk people` |
| `nephew-niece` | [or](#or) | `niece` (female), `nephew` (male) | `nibling`, `sibling’s child` |
| `nephews-nieces` | [or](#or) | `nieces` (female), `nephews` (male) | `niblings`, `sibling’s children` |
| `nobleman-noblewoman` | [or](#or) | `noblewoman` (female), `nobleman` (male) | `noble` |
| `noblemen-noblewomen` | [or](#or) | `noblewomen` (female), `noblemen` (male) | `nobles` |
| `ombudsman-ombudswoman` | [or](#or) | `ombudswoman` (female), `ombudsman` (male) | `notary`, `consumer advocate`, `trouble shooter`, `omsbudperson`, `mediator` |
| `ombudsmen-ombudswomen` | [or](#or) | `ombudswomen` (female), `ombudsmen` (male) | `notaries`, `omsbudpersons`, `omsbudpeople`, `mediators` |
| `prince-princess` | [or](#or) | `princess` (female), `prince` (male) | `heir` |
| `princes-princesses` | [or](#or) | `princesses` (female), `princes` (male) | `heirs` |
| `sandman-sandwoman` | [or](#or) | `sandwoman` (female), `sandman` (male) | `fairy` |
| `sandmen-sandwomen` | [or](#or) | `sandwomen` (female), `sandmen` (male) | `fairies` |
| `showman-showwoman` | [or](#or) | `showwoman` (female), `showman` (male) | `promoter` |
| `showmen-showwomen` | [or](#or) | `showwomen` (female), `show women` (female), `showmen` (male) | `promoters` |
| `spaceman-spacewoman` | [or](#or) | `spacewoman` (female), `spaceman` (male) | `astronaut` |
| `spacemen-spacewomen` | [or](#or) | `spacewomen` (female), `spacemen` (male) | `astronauts` |
| `spokesman-spokeswoman` | [or](#or) | `spokeswoman` (female), `spokesman` (male) | `speaker`, `spokesperson`, `representative` |
| `spokesmen-spokeswomen` | [or](#or) | `spokeswomen` (female), `spokesmen` (male) | `speakers`, `spokespersons` |
| `sportsman-sportswoman` | [or](#or) | `sportswoman` (female), `sportsman` (male) | `athlete`, `sports person` |
| `sportsmen-sportswomen` | [or](#or) | `sportswomen` (female), `sportsmen` (male) | `athletes`, `sports persons` |
| `statesman-stateswoman` | [or](#or) | `stateswoman` (female), `statesman` (male) | `senator` |
| `stepbrother-stepsister` | [or](#or) | `stepsister` (female), `stepbrother` (male) | `step-sibling` |
| `stepbrothers-stepsisters` | [or](#or) | `stepsisters` (female), `stepbrothers` (male) | `step-siblings` |
| `stepdad-stepmom` | [or](#or) | `stepmom` (female), `stepmother` (female), `stepdad` (male), `stepfather` (male) | `step-parent` |
| `stepfathers-stepmothers` | [or](#or) | `stepmothers` (female), `stepfathers` (male) | `step-parents` |
| `superman-superwoman` | [or](#or) | `superwoman` (female), `superman` (male) | `titan` |
| `supermen-superwomen` | [or](#or) | `superwomen` (female), `supermen` (male) | `titans` |
| `unmanly-unwomanly` | [or](#or) | `unwomanly` (female), `unwomenly` (female), `unmanly` (male), `unmenly` (male) | `inhumane` |
| `watchman-watchwoman` | [or](#or) | `watchwoman` (female), `watchman` (male) | `watcher` |
| `watchmen-watchwomen` | [or](#or) | `watchwomen` (female), `watchmen` (male) | `watchers` |
| `weatherman-weatherwoman` | [or](#or) | `weatherwoman` (female), `weatherman` (male) | `weather forecaster`, `meteorologist` |
| `weathermen-weatherwomen` | [or](#or) | `weatherwomen` (female), `weathermen` (male) | `weather forecasters`, `meteorologists` |
| `widow-widower` | [or](#or) | `widow` (female), `widows` (female), `widower` (male), `widowers` (male) | `bereaved` |
| `own-man-own-woman` | [or](#or) | `own woman` (female), `own man` (male) | `own person` |
| `frenchmen` | [basic](#basic) | `frenchmen` | `french`, `the french` |
| `ladylike` | [basic](#basic) | `ladylike` | `courteous`, `cultured` |
| `like-a-man` | [basic](#basic) | `like a man` | `resolutely`, `bravely` |
| `maiden-name` | [basic](#basic) | `maiden name` | `birth name` |
| `maiden-voyage` | [basic](#basic) | `maiden voyage` | `first voyage` |
| `maiden-flight` | [basic](#basic) | `maiden flight` | `first flight` |
| `man-enough` | [basic](#basic) | `man enough` | `strong enough` |
| `oneupmanship` | [basic](#basic) | `oneupmanship` | `upstaging`, `competitiveness` |
| `mrs-` | [basic](#basic) | `miss.`, `mrs.` | `ms.` |
| `manmade` | [basic](#basic) | `manmade` | `manufactured`, `artificial`, `synthetic`, `machine-made`, `constructed` |
| `man-of-action` | [basic](#basic) | `man of action` | `dynamo` |
| `man-of-letters` | [basic](#basic) | `man of letters` | `scholar`, `writer`, `literary figure` |
| `man-of-the-world` | [basic](#basic) | `man of the world` | `sophisticate` |
| `fellowship` | [basic](#basic) | `fellowship` | `camaraderie`, `community`, `organization` |
| `freshman` | [basic](#basic) | `freshman`, `freshwoman` | `first-year student`, `fresher` |
| `workmanship` | [basic](#basic) | `workmanship` | `quality construction`, `expertise` |
| `housewife` | [basic](#basic) | `housewife` | `homemaker`, `homeworker` |
| `housewives` | [basic](#basic) | `housewives` | `homemakers`, `homeworkers` |
| `motherly` | [basic](#basic) | `motherly` | `loving`, `warm`, `nurturing` |
| `manpower` | [basic](#basic) | `manpower` | `human resources`, `workforce`, `personnel`, `staff`, `labor`, `labor force`, `staffing`, `combat personnel` |
| `master-of-ceremonies` | [basic](#basic) | `master of ceremonies` | `emcee`, `moderator`, `convenor` |
| `masterful` | [basic](#basic) | `masterful` | `skilled`, `authoritative`, `commanding` |
| `mastermind` | [basic](#basic) | `mastermind` | `genius`, `creator`, `instigator`, `oversee`, `launch`, `originate` |
| `masterpiece` | [basic](#basic) | `masterpiece` | `work of genius`, `chef d’oeuvre` |
| `masterplan` | [basic](#basic) | `masterplan` | `vision`, `comprehensive plan` |
| `masterstroke` | [basic](#basic) | `masterstroke` | `trump card`, `stroke of genius` |
| `madman` | [basic](#basic) | `madman`, `mad man` | `fanatic`, `zealot`, `enthusiast` |
| `madmen` | [basic](#basic) | `madmen`, `mad men` | `fanatics`, `zealots`, `enthusiasts` |
| `mankind` | [basic](#basic) | `mankind` | `humankind` |
| `manhour` | [basic](#basic) | `manhour`, `man hour` | `staff hour`, `hour of work` |
| `manhours` | [basic](#basic) | `manhours`, `man hours` | `staff hours`, `hours of work`, `hours of labor`, `hours` |
| `manned` | [basic](#basic) | `manned` | `staffed`, `crewed`, `piloted` |
| `unmanned` | [basic](#basic) | `unmanned` | `robotic`, `automated` |
| `moaning` | [basic](#basic) | `bitching`, `moaning` | `whining`, `complaining`, `crying` |
| `moan` | [basic](#basic) | `bitch`, `moan` | `whine`, `complain`, `cry` |
| `wifebeater` | [basic](#basic) | `wife beater`, `wifebeater` | `tank top`, `sleeveless undershirt` |
| `ancient-man` | [basic](#basic) | `ancient man` | `ancient civilization`, `ancient people` |
| `authoress` | [basic](#basic) | `authoress` | `author`, `writer` |
| `average-housewife` | [basic](#basic) | `average housewife` | `average consumer`, `average household`, `average homemaker` |
| `average-man` | [basic](#basic) | `average man` | `average person` |
| `average-working-man` | [basic](#basic) | `average working man` | `average wage earner`, `average taxpayer` |
| `aviatrix` | [basic](#basic) | `aviatrix` | `aviator` |
| `brotherhood-of-man` | [basic](#basic) | `brotherhood of man` | `the human family` |
| `calendar-girl` | [basic](#basic) | `calendar girl` | `model` |
| `call-girl` | [basic](#basic) | `call girl` | `escort`, `prostitute`, `sex worker` |
| `churchman` | [basic](#basic) | `churchman` | `cleric`, `practicing Christian`, `pillar of the Church` |
| `english-master` | [basic](#basic) | `english master` | `english coordinator`, `senior teacher of english` |
| `englishmen` | [basic](#basic) | `englishmen` | `the english` |
| `executrix` | [basic](#basic) | `executrix` | `executor` |
| `father-of-*` | [basic](#basic) | `father of *` | `founder of` |
| `founding-father` | [basic](#basic) | `founding father` | `the founders`, `founding leaders`, `forebears` |
| `housemaid` | [basic](#basic) | `housemaid` | `house worker`, `domestic help` |
| `industrial-man` | [basic](#basic) | `industrial man` | `industrial civilization`, `industrial people` |
| `lady-doctor` | [basic](#basic) | `lady doctor` | `doctor` |
| `leading-lady` | [basic](#basic) | `leading lady` | `lead` |
| `maiden` | [basic](#basic) | `maiden` | `virgin` |
| `maiden-race` | [basic](#basic) | `maiden race` | `first race` |
| `maiden-speech` | [basic](#basic) | `maiden speech` | `first speech` |
| `man-a-desk` | [basic](#basic) | `man a desk` | `staff a desk` |
| `man-in-the-street` | [basic](#basic) | `man in the street` | `ordinary citizen`, `typical person`, `average person` |
| `man-of-the-land` | [basic](#basic) | `man of the land` | `farmer`, `rural worker`, `grazier`, `landowner`, `rural community`, `country people`, `country folk` |
| `mans-best-friend` | [basic](#basic) | `mans best friend` | `a faithful dog` |
| `man-the-booth` | [basic](#basic) | `man the booth` | `staff the booth` |
| `man-the-phones` | [basic](#basic) | `man the phones` | `answer the phones` |
| `mansized-task` | [basic](#basic) | `mansized task`, `man sized task` | `a demanding task`, `a big job` |
| `master-key` | [basic](#basic) | `master key`, `master copy` | `pass key`, `original` |
| `master-plan` | [basic](#basic) | `master plan` | `grand scheme`, `guiding principles` |
| `master-the-art` | [basic](#basic) | `master the art` | `become skilled` |
| `men-of-science` | [basic](#basic) | `men of science` | `scientists` |
| `midwife` | [basic](#basic) | `midwife` | `birthing nurse` |
| `modern-man` | [basic](#basic) | `modern man` | `modern civilization`, `modern people` |
| `no-mans-land` | [basic](#basic) | `no mans land` | `unoccupied territory`, `wasteland`, `deathtrap` |
| `office-girls` | [basic](#basic) | `office girls` | `administrative staff` |
| `poetess` | [basic](#basic) | `poetess` | `poet` |
| `railwayman` | [basic](#basic) | `railwayman` | `railway worker` |
| `sportsmanlike` | [basic](#basic) | `sportsmanlike` | `fair`, `sporting` |
| `sportsmanship` | [basic](#basic) | `sportsmanship` | `fairness`, `good humor`, `sense of fair play` |
| `statesmanlike` | [basic](#basic) | `statesmanlike`, `statesman like` | `diplomatic` |
| `stockman` | [basic](#basic) | `stockman` | `cattle worker`, `farmhand`, `drover` |
| `tradesmans-entrance` | [basic](#basic) | `tradesmans entrance` | `service entrance` |
| `tax-man` | [basic](#basic) | `tax man` | `tax commissioner`, `tax office`, `tax collector` |
| `usherette` | [basic](#basic) | `usherette` | `usher` |
| `woman-lawyer` | [basic](#basic) | `woman lawyer` | `lawyer` |
| `woman-painter` | [basic](#basic) | `woman painter` | `painter` |
| `working-wife` | [basic](#basic) | `working mother`, `working wife` | `wage or salary earning woman`, `two-income family` |
| `homosexual` | [basic](#basic) | `homosexual` | `gay`, `gay man`, `lesbian`, `gay person/people` |
| `homosexual-relations` | [basic](#basic) | `homosexual relations`, `homosexual relationship` | `relationship` |
| `homosexual-couple` | [basic](#basic) | `homosexual couple` | `couple` |
| `sexual-preference` | [basic](#basic) | `sexual preference` | `sexual orientation`, `orientation` |
| `gay-lifestyle` | [basic](#basic) | `gay lifestyle`, `homosexual lifestyle` | `gay lives`, `gay/lesbian lives` |
| `gay-agenda` | [basic](#basic) | `gay agenda`, `homosexual agenda` | `gay issues` |
| `gay-rights` | [basic](#basic) | `special rights`, `gay rights` | `equal rights`, `civil rights for gay people` |
| `fag` | [basic](#basic) | `fag`, `faggot`, `dyke`, `homo`, `sodomite` | `gay` |
| `bi` | [basic](#basic) | `bi` | `bisexual` |
| `homosexual-marriage` | [basic](#basic) | `homosexual marriage` | `gay marriage`, `same-sex marriage` |
| `tranny` | [basic](#basic) | `tranny` | `transgender` |
| `transvestite` | [basic](#basic) | `transvestite` | `cross-dresser` |
| `sexchange` | [basic](#basic) | `sexchange`, `sex change` | `transition`, `gender confirmation surgery` |
| `sex-change-operation` | [basic](#basic) | `sex change operation` | `sex reassignment surgery`, `gender confirmation surgery` |
| `transgenders` | [basic](#basic) | `transgenders` | `transgender people` |
| `transgendered` | [basic](#basic) | `transgendered` | `transgender` |
| `transgenderism` | [basic](#basic) | `transgenderism` | `being transgender`, `the movement for transgender equality` |
| `born-a-man` | [basic](#basic) | `biologically male`, `born a man`, `genetically male` | `assigned male at birth`, `designated male at birth` |
| `born-a-woman` | [basic](#basic) | `biologically female`, `born a woman`, `genetically female` | `assigned female at birth`, `designated female at birth` |
| `bathroom-bill` | [basic](#basic) | `bathroom bill` | `non-discrimination law`, `non-discrimination ordinance` |
| `hermaphroditic` | [basic](#basic) | `hermaphroditic`, `pseudohermaphroditic`, `pseudo hermaphroditic` | `intersex` |
| `hermaphrodite` | [basic](#basic) | `hermaphrodite`, `pseudohermaphrodite`, `pseudo hermaphrodite` | `person who is intersex`, `person`, `intersex person` |
| `heshe` | [basic](#basic) | `shemale`, `she male`, `heshe`, `shehe` | `transgender person`, `person` |
| `gender-pronoun` | [basic](#basic) | `preferred pronoun`, `preferred pronouns`, `gender pronoun`, `gender pronouns` | `pronoun`, `pronouns` |
| `islamist` | [basic](#basic) | `islamist` | `muslim`, `person of Islamic faith`, `fanatic`, `zealot`, `follower of islam`, `follower of the islamic faith` |
| `islamists` | [basic](#basic) | `islamists` | `muslims`, `people of Islamic faith`, `fanatics`, `zealots` |
| `master` | [basic](#basic) | `master` | `primary`, `hub`, `reference` |
| `masters` | [basic](#basic) | `masters` | `primaries`, `hubs`, `references` |
| `eskimo` | [basic](#basic) | `eskimo` | `Inuit` |
| `eskimos` | [basic](#basic) | `eskimos` | `Inuits` |
| `oriental` | [basic](#basic) | `oriental` | `Asian person` |
| `orientals` | [basic](#basic) | `orientals` | `Asian people` |
| `nonwhite` | [basic](#basic) | `nonwhite`, `non white` | `person of color`, `people of color` |
| `ghetto` | [basic](#basic) | `ghetto` | `projects`, `urban` |
| `redskin` | [basic](#basic) | `red indian`, `pocahontas`, `redskin` | `Native American` |
| `redskins` | [basic](#basic) | `red indians`, `redskins` | `Native American People` |
| `totem` | [basic](#basic) | `animal spirit`, `dream catcher`, `spirit animal`, `totem` | `favorite`, `inspiration`, `personal interest`, `personality type` |
| `long-time-no-see` | [basic](#basic) | `long time no hear`, `long time no see` | `I haven’t seen you in a long time`, `it’s been a long time` |
| `indian-country` | [basic](#basic) | `Indian country` | `enemy territory` |
| `off-reserve` | [basic](#basic) | `jump the reservation`, `off reserve`, `off the reservation` | `disobey`, `endure`, `object to`, `oppose`, `resist` |
| `on-the-warpath` | [basic](#basic) | `circle the wagons`, `on the warpath` | `defend` |
| `too-many-chiefs` | [basic](#basic) | `too many chiefs` | `too many chefs in the kitchen`, `too many cooks spoil the broth` |
| `natives-are-restless` | [basic](#basic) | `natives are restless`, `natives are becoming restless`, `natives are getting restless`, `natives are growing restless` | `dissatisfied`, `frustrated` |
| `powwow` | [basic](#basic) | `pow wow`, `powwow` | `conference`, `gathering`, `meeting` |
| `indian-give` | [basic](#basic) | `indian give`, `indian giver` | `go back on one’s offer` |
| `pinoys` | [basic](#basic) | `pinoys`, `pinays` | `Filipinos`, `Filipino people` |
| `towel-heads` | [basic](#basic) | `sand niggers`, `towel heads` | `Arabs`, `Middle Eastern People` |
| `latino` | [basic](#basic) | `latino`, `latina` | `Latinx` |
| `japs` | [basic](#basic) | `japs` | `Japanese person`, `Japanese people` |
| `hymie` | [basic](#basic) | `shlomo`, `shyster`, `hymie` | `Jewish person` |
| `goy` | [basic](#basic) | `goyim`, `goyum`, `goy` | `a person who is not Jewish`, `not Jewish` |
| `spade` | [basic](#basic) | `spade` | `a Black person` |
| `gyp` | [basic](#basic) | `gyppo`, `gypsy`, `Gipsy`, `gyp` | `Nomad`, `Traveler`, `Roma`, `Romani` |
| `blacklist` | [basic](#basic) | `blacklist`, `black list` | `blocklist`, `wronglist`, `banlist`, `deny list` |
| `blacklisted` | [basic](#basic) | `blacklisted` | `blocklisted`, `wronglisted`, `banlisted`, `deny-listed` |
| `blacklisting` | [basic](#basic) | `blacklisting` | `blocklisting`, `wronglisting`, `banlisting`, `deny-listing` |
| `whitelist` | [basic](#basic) | `whitelist`, `white list` | `passlist`, `alrightlist`, `safelist`, `allow list` |
| `whitelisted` | [basic](#basic) | `whitelisted` | `passlisted`, `alrightlisted`, `safelisted`, `allow-listed` |
| `whitelisting` | [basic](#basic) | `whitelisting` | `passlisting`, `alrightlisting`, `safelisting`, `allow-listing` |
| `whitespace` | [basic](#basic) | `whitespace`, `white space` | `space`, `blank` |
| `whitespaces` | [basic](#basic) | `whitespaces`, `white spaces` | `space`, `blank` |
| `savage` | [basic](#basic) | `primitive`, `savage`, `stone age` | `simple`, `indigenous`, `hunter-gatherer` |
| `tribe` | [basic](#basic) | `tribe` | `society`, `community` |
| `sophisticated-culture` | [basic](#basic) | `sophisticated culture` | `complex culture` |
| `sophisticated-technology` | [basic](#basic) | `sophisticated technology` | `complex technology` |
| `bugreport` | [basic](#basic) | `bugreport` | `bug report`, `snapshot` |
| `grandfather-clause` | [basic](#basic) | `grandfather clause`, `grandfather policy` | `legacy policy`, `legacy clause`, `deprecation policy` |
| `grandfathering` | [basic](#basic) | `grandfathering` | `deprecate` |
| `grandfathered` | [basic](#basic) | `grandfathered` | `deprecated` |
| `make-*-great-again` | [basic](#basic) | `make * great again`, `make * * great again`, `make * * * great again`, `make * * * * great again`, `make * * * * * great again` | `improve` |
| `committed-suicide` | [basic](#basic) | `committed suicide`, `completed suicide` | `died by suicide` |
| `commit-suicide` | [basic](#basic) | `commit suicide`, `complete suicide`, `successful suicide` | `die by suicide` |
| `suicide-pact` | [basic](#basic) | `suicide epidemic`, `epidemic of suicides`, `suicide pact` | `rise in suicides` |
| `failed-suicide` | [basic](#basic) | `failed suicide`, `failed attempt`, `suicide failure` | `suicide attempt`, `attempted suicide` |
| `suicide-note` | [basic](#basic) | `suicide note` | `a note from the deceased` |
| `hang` | [basic](#basic) | `hang`, `hanged` | `the app froze`, `the app stopped responding`, `the app stopped responding to events`, `the app became unresponsive` |
