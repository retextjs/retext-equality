# Rules

## Pattern types

###### Simple

Simple-patterns highlight possible inconsiderate terms and suggest
potentially more considerate alternatives.

###### Or

Or-patterns highlight possible inconsiderate terms unless every
category is present.  This is used for gendered work titles and the
like, where `garbageman and garbagewoman` is considered OK, and so is
`his or her bike`.  These patterns can be turned into “simple” patterns
by passing `noBinary: true`, thus suggesting two alternatives for
`him or her`.

Or-patterns can be joined by `and`, `or`, or a slash (`/`).

###### And

And-patterns highlight possible inconsiderate terms if every category is
present.  This is used for one case: `master` and `slave`.

And-patterns operate on a per-paragraph level.

## List of Rules

| id | type | not ok | ok |
| --- | ---- | ------ | --- |
| `learning-disabled` | [simple](#simple) | `learning disabled` | `person with learning disabilities` |
| `disabled` | [simple](#simple) | `disabled` | `turned off`, `person with a disability`, `people with disabilities` |
| `birth-defect` | [simple](#simple) | `birth defect` | `person with a disability`, `people with disabilities` |
| `suffers-from-disabilities` | [simple](#simple) | `suffers from disabilities`, `suffering from disabilities`, `suffering from a disability`, `afflicted with disabilities`, `afflicted with a disability` | `person with a disability`, `people with disabilities` |
| `intellectually-disabled-people` | [simple](#simple) | `intellectually disabled people` | `people with intellectual disabilities` |
| `intellectually-disabled` | [simple](#simple) | `intellectually disabled`, `suffers from intellectual disabilities`, `suffering from intellectual disabilities`, `suffering from an intellectual disability`, `afflicted with intellectual disabilities`, `afflicted with a intellectual disability` | `person with an intellectual disability` |
| `nuts` | [simple](#simple) | `batshit`, `psycho`, `crazy`, `insane`, `insanity`, `loony`, `lunacy`, `lunatic`, `mentally ill`, `psychopathology`, `mental defective`, `moron`, `moronic`, `nuts` | `rude`, `mean`, `disgusting`, `vile`, `person with symptoms of mental illness`, `person with mental illness`, `person with symptoms of a mental disorder`, `person with a mental disorder` |
| `schizo` | [simple](#simple) | `bipolar`, `schizophrenic`, `schizo`, `suffers from schizophrenia`, `suffering from schizophrenia`, `afflicted with schizophrenia` | `fluctuating`, `person with schizophrenia`, `person with bipolar disorder` |
| `handicapped-parking` | [simple](#simple) | `handicapped parking` | `accessible parking` |
| `handicapped` | [simple](#simple) | `handicapped` | `person with a handicap` |
| `amputee` | [simple](#simple) | `amputee` | `person with an amputation` |
| `cripple` | [simple](#simple) | `cripple`, `crippled` | `person with a limp` |
| `mongoloid` | [simple](#simple) | `mongoloid` | `person with Down Syndrome` |
| `stroke-victim` | [simple](#simple) | `stroke victim`, `suffering from a stroke`, `victim of a stroke` | `individual who has had a stroke` |
| `multiple-sclerosis-victim` | [simple](#simple) | `suffers from multiple sclerosis`, `suffering from multiple sclerosis`, `victim of multiple sclerosis`, `multiple sclerosis victim`, `afflicted with multiple sclerosis` | `person who has multiple sclerosis` |
| `family-burden` | [simple](#simple) | `family burden` | `with family support needs` |
| `asylum` | [simple](#simple) | `asylum` | `psychiatric hospital`, `mental health hospital` |
| `bedlam` | [simple](#simple) | `bedlam`, `madhouse`, `loony bin` | `chaos`, `hectic`, `pandemonium` |
| `downs-syndrome` | [simple](#simple) | `downs syndrome` | `Down Syndrome` |
| `retard` | [simple](#simple) | `retard`, `retarded` | `silly`, `dullard`, `person with Down Syndrome`, `person with developmental disabilities`, `delay`, `hold back` |
| `retards` | [simple](#simple) | `retards` | `sillies`, `dullards`, `people with developmental disabilities`, `people with Down’s Syndrome`, `delays`, `holds back` |
| `psychotic` | [simple](#simple) | `psychotic`, `suffers from psychosis`, `suffering from psychosis`, `afflicted with psychosis`, `victim of psychosis` | `person with a psychotic condition`, `person with psychosis` |
| `lame` | [simple](#simple) | `lame` | `boring`, `dull` |
| `aids-victim` | [simple](#simple) | `suffering from aids`, `suffer from aids`, `suffers from aids`, `afflicted with aids`, `victim of aids`, `aids victim` | `person with AIDS` |
| `wheelchair-bound` | [simple](#simple) | `confined to a wheelchair`, `bound to a wheelchair`, `restricted to a wheelchair`, `wheelchair bound` | `uses a wheelchair` |
| `special-olympians` | [simple](#simple) | `special olympians`, `special olympic athletes` | `athletes`, `Special Olympics athletes` |
| `ablebodied` | [simple](#simple) | `ablebodied` | `non-disabled` |
| `addict` | [simple](#simple) | `addict` | `person with a drug addiction`, `person recovering from a drug addiction` |
| `addicts` | [simple](#simple) | `addicts` | `people with a drug addiction`, `people recovering from a drug addiction` |
| `alcoholic` | [simple](#simple) | `alcoholic` | `someone with an alcohol problem` |
| `autistic` | [simple](#simple) | `autistic` | `person with autism spectrum disorder` |
| `deafmute` | [simple](#simple) | `deaf and dumb`, `deafmute` | `deaf` |
| `senile` | [simple](#simple) | `demented`, `senile` | `person with dementia` |
| `depressed` | [simple](#simple) | `depressed` | `sad`, `blue`, `bummed out`, `person with seasonal affective disorder`, `person with psychotic depression`, `person with postpartum depression` |
| `midget` | [simple](#simple) | `vertically challenged`, `midget` | `person with dwarfism` |
| `dyslexic` | [simple](#simple) | `dyslexic` | `person with dyslexia` |
| `epileptic` | [simple](#simple) | `epileptic` | `person with epilepsy` |
| `hearing-impaired` | [simple](#simple) | `hearing impaired`, `hearing impairment` | `hard of hearing`, `partially deaf`, `partial hearing loss`, `deaf` |
| `victim-of-polio` | [simple](#simple) | `infantile paralysis`, `suffers from polio`, `suffering from polio`, `suffering from a polio`, `afflicted with polio`, `afflicted with a polio`, `victim of polio` | `polio`, `person who had polio` |
| `victim-of-an-injury` | [simple](#simple) | `suffer from an injury`, `suffers from an injury`, `suffering from an injury`, `afflicted with an injury`, `victim of an injury` | `sustain an injury`, `receive an injury` |
| `victim-of-injuries` | [simple](#simple) | `suffer from injuries`, `suffers from injuries`, `suffering from injuries`, `afflicted with injuries`, `victim of injuries` | `sustain injuries`, `receive injuries` |
| `paraplegic` | [simple](#simple) | `paraplegic` | `person with paraplegia` |
| `quadriplegic` | [simple](#simple) | `quadriplegic` | `person with quadriplegia` |
| `spaz` | [simple](#simple) | `spaz` | `person with cerebral palsy`, `twitch`, `flinch`, `hectic` |
| `spastic` | [simple](#simple) | `spastic` | `person with cerebral palsy`, `twitch`, `flinch` |
| `stammering` | [simple](#simple) | `stammering` | `stuttering` |
| `stutterer` | [simple](#simple) | `stutterer` | `person who stutters` |
| `tourettes-syndrome` | [simple](#simple) | `tourettes syndrome`, `tourettes disorder` | `Tourette syndrome` |
| `rehab-center` | [simple](#simple) | `rehab center`, `detox center` | `treatment center` |
| `rehab` | [simple](#simple) | `rehab`, `detox` | `treatment` |
| `sociopath` | [simple](#simple) | `sociopath` | `person with a personality disorder`, `person with psychopathic personality` |
| `sociopaths` | [simple](#simple) | `sociopaths` | `people with psychopathic personalities`, `people with a personality disorder` |
| `dumb` | [simple](#simple) | `dumb` | `foolish`, `ludicrous`, `speechless`, `silent` |
| `wacko` | [simple](#simple) | `simpleton`, `stupid`, `wacko`, `whacko` | `foolish`, `ludicrous`, `unintelligent` |
| `panic-attack` | [simple](#simple) | `panic attack` | `fit of terror`, `scare` |
| `anorexic` | [simple](#simple) | `anorexic` | `thin`, `slim` |
| `ocd` | [simple](#simple) | `ocd`, `o.c.d`, `o.c.d.` | `obsessive`, `pedantic`, `niggly`, `picky` |
| `insomnia` | [simple](#simple) | `insomnia` | `restlessness`, `sleeplessness` |
| `insomniac` | [simple](#simple) | `insomniac` | `person who has insomnia` |
| `insomniacs` | [simple](#simple) | `insomniacs` | `people who have insomnia` |
| `barren` | [simple](#simple) | `barren` | `empty`, `sterile`, `infertile` |
| `deaf-to` | [simple](#simple) | `blind to`, `blind eye to`, `blinded by`, `deaf to`, `deaf ear to`, `deafened by` | `careless`, `heartless`, `indifferent`, `insensitive` |
| `cretin` | [simple](#simple) | `cretin` | `creep`, `fool` |
| `daft` | [simple](#simple) | `daft` | `absurd`, `foolish` |
| `idiot` | [simple](#simple) | `feebleminded`, `feeble minded`, `idiot`, `imbecile` | `foolish`, `ludicrous`, `silly` |
| `harelipped` | [simple](#simple) | `harelipped`, `cleftlipped` | `person with a cleft-lip and palate` |
| `harelip` | [simple](#simple) | `harelip` | `cleft-lip and palate` |
| `maniac` | [simple](#simple) | `maniac` | `fanatic`, `zealot`, `enthusiast` |
| `her-him` | [or](#or) | `her` (female), `hers` (female), `him` (male), `his` (male) | `their`, `theirs`, `them` |
| `he-she` | [or](#or) | `she` (female), `he` (male), `she'd` (female), `he'd` (male), `she'll` (female), `he'll` (male), `she's` (female), `he's` (male) | `they`, `it` |
| `herself-himself` | [or](#or) | `herself` (female), `himself` (male) | `themselves`, `theirself`, `self` |
| `boy-girl` | [or](#or) | `girl` (female), `boy` (male) | `kid`, `child` |
| `gals-men` | [or](#or) | `women` (female), `girls` (female), `gals` (female), `ladies` (female), `men` (male), `guys` (male), `dudes` (male), `gents` (male), `gentlemen` (male) | `people`, `persons`, `folks` |
| `gal-guy` | [or](#or) | `woman` (female), `gal` (female), `lady` (female), `babe` (female), `bimbo` (female), `chick` (female), `guy` (male), `lad` (male), `fellow` (male), `dude` (male), `bro` (male), `gentleman` (male) | `person`, `friend`, `pal`, `folk`, `individual` |
| `fatherland-motherland` | [or](#or) | `motherland` (female), `fatherland` (male) | `native land` |
| `father-tongue-mother-tongue` | [or](#or) | `mother tongue` (female), `father tongue` (male) | `native tongue`, `native language` |
| `freshmen-freshwomen` | [or](#or) | `freshwomen` (female), `freshmen` (male) | `first-year students`, `freshers` |
| `garbageman-garbagewoman` | [or](#or) | `garbagewoman` (female), `garbageman` (male) | `garbage collector`, `waste collector`, `trash collector` |
| `garbagemen-garbagewomen` | [or](#or) | `garbagewomen` (female), `garbagemen` (male) | `garbage collectors`, `waste collectors`, `trash collectors` |
| `chairman-chairwoman` | [or](#or) | `chairwoman` (female), `chairman` (male) | `chair`, `chairperson`, `coordinator` |
| `committee-man-committee-woman` | [or](#or) | `committee woman` (female), `committee man` (male) | `committee member` |
| `cowboy-cowgirl` | [or](#or) | `cowgirl` (female), `cowboy` (male) | `cowhand` |
| `cowboys-cowgirls` | [or](#or) | `cowgirls` (female), `cowboys` (male) | `cowhands` |
| `cattleman-cattlewoman` | [or](#or) | `cattlewoman` (female), `cattleman` (male) | `cattle rancher` |
| `cattlemen-cattlewomen` | [or](#or) | `cattlewomen` (female), `cattlemen` (male) | `cattle ranchers` |
| `chairmen-chairwomen` | [or](#or) | `chairwomen` (female), `chairmen` (male) | `chairs`, `chairpersons`, `coordinators` |
| `postman-postwoman` | [or](#or) | `postwoman` (female), `mailwoman` (female), `postman` (male), `mailman` (male) | `mail carrier`, `letter carrier`, `postal worker` |
| `postmen-postwomen` | [or](#or) | `postwomen` (female), `mailwomen` (female), `postmen` (male), `mailmen` (male) | `mail carriers`, `letter carriers`, `postal workers` |
| `policeman-policewoman` | [or](#or) | `policewoman` (female), `policeman` (male) | `officer`, `police officer` |
| `policemen-policewomen` | [or](#or) | `policewomen` (female), `policemen` (male) | `officers`, `police officers` |
| `steward-stewardess` | [or](#or) | `stewardess` (female), `steward` (male) | `flight attendant` |
| `stewardesses-stewards` | [or](#or) | `stewardesses` (female), `stewards` (male) | `flight attendants` |
| `congressman-congresswoman` | [or](#or) | `congresswoman` (female), `congressman` (male) | `member of congress`, `congress person`, `legislator`, `representative` |
| `congressmen-congresswomen` | [or](#or) | `congresswomen` (female), `congressmen` (male) | `members of congress`, `congress persons`, `legislators`, `representatives` |
| `fireman-firewoman` | [or](#or) | `firewoman` (female), `fireman` (male) | `fire fighter` |
| `firemen-firewomen` | [or](#or) | `firewomen` (female), `firemen` (male) | `fire fighters` |
| `fisherman-fisherwoman` | [or](#or) | `fisherwoman` (female), `fisherman` (male) | `fisher`, `crew member` |
| `fishermen-fisherwomen` | [or](#or) | `fisherwomen` (female), `fishermen` (male) | `fishers` |
| `brotherhood-sisterhood` | [or](#or) | `sisterhood` (female), `brotherhood` (male) | `kinship`, `community` |
| `common-girl-common-man` | [or](#or) | `common girl` (female), `common man` (male) | `common person`, `average person` |
| `salaryman-salarywoman` | [or](#or) | `businesswoman` (female), `salarywoman` (female), `businessman` (male), `salaryman` (male) | `business executive`, `entrepreneur`, `business person`, `professional` |
| `salarymen-salarywomen` | [or](#or) | `businesswomen` (female), `salarywomen` (female), `career girl` (female), `career woman` (female), `businessmen` (male), `salarymen` (male) | `business executives`, `entrepreneurs` |
| `janitor-janitress` | [or](#or) | `cleaning lady` (female), `cleaning girl` (female), `cleaning woman` (female), `janitress` (female), `cleaning man` (male), `cleaning boy` (male), `janitor` (male) | `cleaner` |
| `janitors-janitresses` | [or](#or) | `cleaning ladies` (female), `cleaning girls` (female), `janitresses` (female), `cleaning men` (male), `janitors` (male) | `cleaners` |
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
| `saleslady-salesman` | [or](#or) | `saleswoman` (female), `sales woman` (female), `saleslady` (female), `salesman` (male), `sales man` (male) | `salesperson`, `sales clerk`, `sales rep`, `sales agent`, `seller` |
| `salesmen-saleswomen` | [or](#or) | `saleswomen` (female), `sales women` (female), `salesladies` (female), `salesmen` (male), `sales men` (male) | `sales clerks`, `sales reps`, `sales agents`, `sellers` |
| `serviceman-servicewoman` | [or](#or) | `servicewoman` (female), `serviceman` (male) | `soldier`, `service representative` |
| `servicemen-servicewomen` | [or](#or) | `servicewomen` (female), `servicemen` (male) | `soldiers`, `service representatives` |
| `waiter-waitress` | [or](#or) | `waitress` (female), `waiter` (male) | `server` |
| `waiters-waitresses` | [or](#or) | `waitresses` (female), `waiters` (male) | `servers` |
| `workman-workwoman` | [or](#or) | `workwoman` (female), `working woman` (female), `workman` (male), `working man` (male) | `worker`, `wage earner`, `taxpayer` |
| `workmen-workwomen` | [or](#or) | `workwomen` (female), `workmen` (male) | `workers` |
| `actor-actress` | [or](#or) | `actress` (female), `actor` (male) | `performer`, `star`, `artist` |
| `actors-actresses` | [or](#or) | `actresses` (female), `actors` (male) | `performers`, `stars`, `artists` |
| `aircrewwoman-airman` | [or](#or) | `aircrewwoman` (female), `aircrew woman` (female), `aircrewman` (male), `airman` (male) | `pilot`, `aviator`, `airstaff` |
| `aircrewwomen-airmen` | [or](#or) | `aircrewwomen` (female), `aircrew women` (female), `aircrewmen` (male), `airmen` (male) | `pilots`, `aviators`, `airstaff` |
| `alderman-alderwoman` | [or](#or) | `alderwoman` (female), `alderman` (male) | `cabinet member` |
| `aldermen-alderwomen` | [or](#or) | `alderwomen` (female), `aldermen` (male) | `cabinet`, `cabinet members` |
| `assemblyman-assemblywoman` | [or](#or) | `assemblywoman` (female), `assemblyman` (male) | `assembly person`, `assembly worker` |
| `aunt-uncle` | [or](#or) | `kinswoman` (female), `aunt` (female), `kinsman` (male), `uncle` (male) | `relative` |
| `aunts-uncles` | [or](#or) | `kinswomen` (female), `aunts` (female), `kinsmen` (male), `uncles` (male) | `relatives` |
| `boogeyman-boogeywoman` | [or](#or) | `boogeywoman` (female), `boogeyman` (male) | `boogey` |
| `boogieman-boogiewoman` | [or](#or) | `boogiewoman` (female), `boogieman` (male) | `boogie` |
| `bogeyman-bogeywoman` | [or](#or) | `bogeywoman` (female), `bogeyman` (male) | `bogey` |
| `bogieman-bogiewoman` | [or](#or) | `bogiewoman` (female), `bogieman` (male) | `bogie` |
| `boogiemen-boogiewomen` | [or](#or) | `boogiewomen` (female), `boogiemen` (male) | `boogies` |
| `bogiemen-bogiewomen` | [or](#or) | `bogiewomen` (female), `bogiemen` (male) | `bogies` |
| `bondsman-bondswoman` | [or](#or) | `bondswoman` (female), `bondsman` (male) | `bonder` |
| `bondsmen-bondswomen` | [or](#or) | `bondswomen` (female), `bondsmen` (male) | `bonders` |
| `husband-wife` | [or](#or) | `wife` (female), `husband` (male) | `partner`, `significant other`, `spouse` |
| `husbands-wives` | [or](#or) | `wives` (female), `husbands` (male) | `partners`, `significant others`, `spouses` |
| `boyfriend-girlfriend` | [or](#or) | `girlfriend` (female), `boyfriend` (male) | `partner`, `friend`, `significant other` |
| `boyfriends-girlfriends` | [or](#or) | `girlfriends` (female), `boyfriends` (male) | `partners`, `friends`, `significant others` |
| `boyhood-girlhood` | [or](#or) | `girlhood` (female), `boyhood` (male) | `childhood` |
| `boyish-girly` | [or](#or) | `girly` (female), `girlish` (female), `boyish` (male) | `childish` |
| `journeyman-journeywoman` | [or](#or) | `journeywoman` (female), `journeyman` (male) | `traveler` |
| `journeymen-journeywomen` | [or](#or) | `journeywomen` (female), `journeymen` (male) | `travelers` |
| `godfather-godmother` | [or](#or) | `godmother` (female), `patroness` (female), `godfather` (male) | `godparent`, `elder`, `patron` |
| `granddaughter-grandson` | [or](#or) | `granddaughter` (female), `grandson` (male) | `grandchild` |
| `granddaughters-grandsons` | [or](#or) | `granddaughters` (female), `grandsons` (male) | `grandchildren` |
| `forefather-foremother` | [or](#or) | `foremother` (female), `forefather` (male) | `ancestor` |
| `forefathers-foremothers` | [or](#or) | `foremothers` (female), `forefathers` (male) | `ancestors` |
| `gramps-granny` | [or](#or) | `granny` (female), `grandma` (female), `grandmother` (female), `grandpappy` (male), `granddaddy` (male), `gramps` (male), `grandpa` (male), `grandfather` (male) | `grandparent`, `ancestor` |
| `grandfathers-grandmothers` | [or](#or) | `grandmothers` (female), `grandfathers` (male) | `grandparents`, `ancestors` |
| `bride-groom` | [or](#or) | `bride` (female), `groom` (male) | `spouse` |
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
| `host-hostess` | [or](#or) | `hostess` (female), `host` (male) | `presenter`, `entertainer` |
| `hostesses-hosts` | [or](#or) | `hostesses` (female), `hosts` (male) | `presenters`, `entertainers` |
| `handymen-handywomen` | [or](#or) | `handywomen` (female), `craftswomen` (female), `handymen` (male), `craftsmen` (male) | `artisans`, `craftspersons`, `skilled workers` |
| `hangman-hangwoman` | [or](#or) | `hangwoman` (female), `hangman` (male) | `guillotine` |
| `hangmen-hangwomen` | [or](#or) | `hangwomen` (female), `hangmen` (male) | `guillotines` |
| `henchman-henchwoman` | [or](#or) | `henchwoman` (female), `henchman` (male) | `sidekick` |
| `henchmen-henchwomen` | [or](#or) | `henchwomen` (female), `henchmen` (male) | `sidekicks` |
| `hero-heroine` | [or](#or) | `heroine` (female), `hero` (male) | `role-model` |
| `heroes-heroines` | [or](#or) | `heroines` (female), `heroes` (male) | `role-models` |
| `maternal-paternal` | [or](#or) | `maternal` (female), `paternal` (male), `fraternal` (male) | `parental`, `warm`, `intimate` |
| `maternity-paternity` | [or](#or) | `maternity` (female), `paternity` (male) | `parental` |
| `dads-moms` | [or](#or) | `mamas` (female), `mothers` (female), `moms` (female), `mums` (female), `mommas` (female), `mommies` (female), `papas` (male), `fathers` (male), `dads` (male), `daddies` (male) | `parents` |
| `dad-mom` | [or](#or) | `mama` (female), `mother` (female), `mom` (female), `mum` (female), `momma` (female), `mommy` (female), `papa` (male), `father` (male), `dad` (male), `pop` (male), `daddy` (male) | `parent` |
| `daughter-son` | [or](#or) | `daughter` (female), `son` (male) | `child` |
| `daughters-sons` | [or](#or) | `daughters` (female), `sons` (male) | `children` |
| `doorman-doorwoman` | [or](#or) | `doorwoman` (female), `doorman` (male) | `convierge` |
| `doormen-doorwomen` | [or](#or) | `doorwomen` (female), `doormen` (male) | `convierges` |
| `feminin-manly` | [or](#or) | `feminin` (female), `dudely` (male), `manly` (male) | `humanly`, `mature` |
| `females-males` | [or](#or) | `females` (female), `males` (male) | `humans` |
| `king-queen` | [or](#or) | `empress` (female), `queen` (female), `emperor` (male), `king` (male) | `ruler` |
| `kings-queens` | [or](#or) | `empresses` (female), `queens` (female), `emperors` (male), `kings` (male) | `rulers` |
| `kingsize-queensize` | [or](#or) | `queensize` (female), `kingsize` (male) | `jumbo`, `gigantic` |
| `kingmaker-queenmaker` | [or](#or) | `queenmaker` (female), `kingmaker` (male) | `power behind the throne` |
| `layman-laywoman` | [or](#or) | `laywoman` (female), `layman` (male) | `civilian` |
| `laymen-laywomen` | [or](#or) | `laywomen` (female), `laymen` (male) | `civilians` |
| `dame-lord` | [or](#or) | `dame` (female), `lord` (male) | `official`, `owner`, `expert`, `superior`, `chief`, `ruler` |
| `dames-lords` | [or](#or) | `dames` (female), `lords` (male) | `officials`, `masters`, `chiefs`, `rulers` |
| `manhood-womanhood` | [or](#or) | `womanhood` (female), `masculinity` (male), `manhood` (male) | `adulthood`, `personhood` |
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
| `ombudsman-ombudswoman` | [or](#or) | `ombudswoman` (female), `ombudsman` (male) | `notary`, `consumer advocate`, `trouble shooter` |
| `ombudsmen-ombudswomen` | [or](#or) | `ombudswomen` (female), `ombudsmen` (male) | `notaries` |
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
| `frenchmen` | [simple](#simple) | `frenchmen` | `french` |
| `ladylike` | [simple](#simple) | `ladylike` | `courteous`, `cultured` |
| `like-a-man` | [simple](#simple) | `like a man` | `resolutely`, `bravely` |
| `maiden-name` | [simple](#simple) | `maiden name` | `birth name` |
| `maiden-voyage` | [simple](#simple) | `maiden voyage` | `first voyage` |
| `man-enough` | [simple](#simple) | `man enough` | `strong enough` |
| `oneupmanship` | [simple](#simple) | `oneupmanship` | `upstaging`, `competitiveness` |
| `mrs-` | [simple](#simple) | `miss.`, `mrs.` | `ms.` |
| `manmade` | [simple](#simple) | `manmade` | `manufactured`, `artificial`, `synthetic`, `machine-made` |
| `man-of-action` | [simple](#simple) | `man of action` | `dynamo` |
| `man-of-letters` | [simple](#simple) | `man of letters` | `scholar`, `writer`, `literary figure` |
| `man-of-the-world` | [simple](#simple) | `man of the world` | `sophisticate` |
| `fellowship` | [simple](#simple) | `fellowship` | `camaraderie` |
| `freshman` | [simple](#simple) | `freshman`, `freshwoman` | `first-year student`, `fresher` |
| `workmanship` | [simple](#simple) | `workmanship` | `quality construction`, `expertise` |
| `housewife` | [simple](#simple) | `housewife` | `homemaker`, `homeworker` |
| `housewives` | [simple](#simple) | `housewives` | `homemakers`, `homeworkers` |
| `motherly` | [simple](#simple) | `motherly` | `loving`, `warm`, `nurturing` |
| `manpower` | [simple](#simple) | `manpower` | `human resources` |
| `master-of-ceremonies` | [simple](#simple) | `master of ceremonies` | `emcee`, `moderator`, `convenor` |
| `masterful` | [simple](#simple) | `masterful` | `skilled`, `authoritative`, `commanding` |
| `mastermind` | [simple](#simple) | `mastermind` | `genius`, `creator`, `instigator`, `oversee`, `launch`, `originate` |
| `masterpiece` | [simple](#simple) | `masterpiece` | `work of genius`, `chef d’oeuvre` |
| `masterplan` | [simple](#simple) | `masterplan` | `vision`, `comprehensive plan` |
| `masterstroke` | [simple](#simple) | `masterstroke` | `trump card`, `stroke of genius` |
| `madman` | [simple](#simple) | `madman`, `mad man` | `fanatic`, `zealot`, `enthusiast` |
| `madmen` | [simple](#simple) | `madmen`, `mad men` | `maniacs` |
| `mankind` | [simple](#simple) | `mankind` | `humankind` |
| `manhour` | [simple](#simple) | `manhour`, `man hour` | `staff hour`, `hour of work` |
| `manhours` | [simple](#simple) | `manhours`, `man hours` | `staff hours`, `hours of work` |
| `manned` | [simple](#simple) | `manned` | `staffed`, `crewed`, `piloted` |
| `unmanned` | [simple](#simple) | `unmanned` | `robotic`, `automated` |
| `moaning` | [simple](#simple) | `bitching`, `moaning` | `whining`, `complaining`, `crying` |
| `moan` | [simple](#simple) | `bitch`, `moan` | `whine`, `complain`, `cry` |
| `wifebeater` | [simple](#simple) | `wife beater`, `wifebeater` | `tank top`, `sleeveless undershirt` |
| `homosexual` | [simple](#simple) | `homosexual` | `gay`, `gay man`, `lesbian`, `gay person/people` |
| `homosexual-relations` | [simple](#simple) | `homosexual relations`, `homosexual relationship` | `relationship` |
| `homosexual-couple` | [simple](#simple) | `homosexual couple` | `couple` |
| `sexual-preference` | [simple](#simple) | `sexual preference` | `sexual orientation`, `orientation` |
| `gay-lifestyle` | [simple](#simple) | `gay lifestyle`, `homosexual lifestyle` | `gay lives`, `gay/lesbian lives` |
| `gay-agenda` | [simple](#simple) | `gay agenda`, `homosexual agenda` | `gay issues` |
| `gay-rights` | [simple](#simple) | `special rights`, `gay rights` | `equal rights`, `civil rights for gay people` |
| `fag` | [simple](#simple) | `fag`, `faggot`, `dyke`, `homo`, `sodomite` | `gay` |
| `bi` | [simple](#simple) | `bi` | `bisexual` |
| `homosexual-marriage` | [simple](#simple) | `homosexual marriage` | `gay marriage`, `same-sex marriage` |
| `tranny` | [simple](#simple) | `tranny` | `transgender` |
| `transvestite` | [simple](#simple) | `transvestite` | `cross-dresser` |
| `sexchange` | [simple](#simple) | `sexchange`, `sex change` | `transition` |
| `sex-change-operation` | [simple](#simple) | `sex change operation` | `sex reassignment surgery` |
| `transgenders` | [simple](#simple) | `transgenders` | `transgender people` |
| `transgendered` | [simple](#simple) | `transgendered` | `trangender` |
| `transgenderism` | [simple](#simple) | `transgenderism` | `being trangender`, `the movement for transgender equality` |
| `born-a-man` | [simple](#simple) | `biologically male`, `born a man`, `genetically male` | `assigned male at birth`, `designated male at birth` |
| `born-a-woman` | [simple](#simple) | `biologically female`, `born a woman`, `genetically female` | `assigned female at birth`, `designated female at birth` |
| `bathroom-bill` | [simple](#simple) | `bathroom bill` | `non-discrimination law`, `non-discrimination ordinance` |
| `hermaphroditic` | [simple](#simple) | `hermaphroditic`, `pseudohermaphroditic`, `pseudo hermaphroditic` | `intersex` |
| `hermaphrodite` | [simple](#simple) | `hermaphrodite`, `pseudohermaphrodite`, `pseudo hermaphrodite` | `person who is intersex`, `person`, `intersex person` |
| `heshe` | [simple](#simple) | `shemale`, `she male`, `heshe`, `shehe` | `transgender person`, `person` |
| `islamist` | [simple](#simple) | `islamist` | `muslim`, `person of Islamic faith`, `fanatic`, `zealot` |
| `islamists` | [simple](#simple) | `islamists` | `muslims`, `people of Islamic faith`, `fanatics`, `zealots` |
| `master-slave` | [and](#and) | `master` (a), `masters` (a), `slave` (b), `slaves` (b) | `primary`, `primaries`, `hub`, `hubs`, `reference`, `references`, `replica`, `replicas`, `spoke`, `spokes`, `secondary`, `secondaries` |
| `eskimo` | [simple](#simple) | `eskimo` | `Inuit` |
| `eskimos` | [simple](#simple) | `eskimos` | `Inuits` |
| `oriental` | [simple](#simple) | `oriental` | `Asian person` |
| `orientals` | [simple](#simple) | `orientals` | `Asian people` |
| `nonwhite` | [simple](#simple) | `nonwhite`, `non white` | `person of color`, `people of color` |
| `ghetto` | [simple](#simple) | `ghetto` | `projects`, `urban` |
| `committed-suicide` | [simple](#simple) | `committed suicide`, `completed suicide` | `died by suicide` |
| `commit-suicide` | [simple](#simple) | `commit suicide`, `complete suicide` | `die by suicide` |
| `suicide-epidemic` | [simple](#simple) | `suicide epidemic` | `rise in suicides` |
