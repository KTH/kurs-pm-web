module.exports = {
  shortNames: ['sv', 'se'],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',
    language_link_lang_en: 'English',
    menu_panel_search: 'Sök',
    menu_panel_close: 'Stäng',
    menu_panel_menu: 'Meny',

    /**
     * Error messages
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du söker',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Message keys
     */
    service_name: 'Node-applikationsnamn',

    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Denna sida på svenska',

    site_name: 'Om kursen',
    host_name: 'KTH',

    button_mobile_menu_label: 'Öppna/stäng mobilmenyn',
    mobile_menu_aria_label: 'Mobilemeny',

    skip_to_main_content: 'Hoppa till huvudinnehållet',
    back_to_top_label: 'Till sidans topp',

    memoLabel: 'Kurs-PM',
    prepositionFor: 'för',

    noPublishedMemo: 'Inget publicerat kurs-PM',
    obsoleteData: 'Data för kurs-PM är sparat med en tidigare version och föråldrat.',
    aboutCourse: 'Om kursen',

    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas',

    courseInformationTitle: 'Information',

    adminLinkLabel: 'Administrera Om kursen',
  },
  sideMenuLabels: {
    directory: 'Kurs- och programkatalogen',
    aboutCourse: 'Om kursen',
    beforeChoosingCourse: 'Inför kursval',
    aboutCourseMemos: 'Kurs-PM',
    courseMemo: 'Förbereda och gå kurs',
    finishCourse: 'Slutföra ej avklarad kurs',
    courseDevelopment: 'Kursens utveckling',
    archive: 'Arkiv',
    subMenuAriaLabel: 'Undermeny',
  },
  courseLinksLabels: {
    linkHeaderTitle: 'Relaterad information',
    administrateYouStudy: 'Administrera dina studier',
    courseAndExamination: 'Kurs och examination',
    rightsAndResponsibilities: 'Rättigheter och skyldigheter',
  },
  coverPageLabels: {
    roundsTitle: 'Kursomgång',
    offeredByTitle: 'Kursen ges av',
    languageOfInstructionTitle: 'Undervisningsspråk',
    syllabusInformation: 'Information hämtas från',
    syllabusLinkStart: 'Kursplan ',
    syllabusLinkMiddle: '(',
    syllabusLinkEnd: ')',
    memoSource: 'Utskrift från sidan',
  },
  courseFactsLabels: {
    roundFacts: 'Fakta om kursomgång',
    offeredByTitle: 'Kursen ges av',
    languageOfInstructionTitle: 'Undervisningsspråk',
    roundsTitle: 'Kursomgång',
    startDate: 'Startdatum',
    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas',
  },
  courseMemoLinksLabels: {
    documents: 'Dokument',
    versionTitle: 'Version kurs-PM',
    latest: 'Senaste:',
    courseMemoArchiveLabel: 'Arkiv för kurs-PM',
    archivePageLabel: 'Arkiv',
    courseMemoPdf: 'Kurs-PM som pdf',
    courseMemoPrint: 'Skriv ut eller spara',
    syllabus: 'Kursplan',
    syllabusInformation: 'information hämtas från',
    syllabusLinkStart: 'Kursplan (',
    syllabusLinkEnd: ')',
    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas',
    inDevelopment: 'Under utveckling',
    printDialog: 'Skriv ut eller spara kurs-PM',
    version: 'Ver',
  },
  courseContactsLabels: {
    courseContactsTitle: 'Kontakter',
    communicationWithTeachersTitle: 'Kommunikation i kursen',
    courseCoordinatorTitle: 'Kursansvarig',
    teacherTitle: 'Lärare',
    teacherAssistantsTitle: 'Lärarassistenter',
    examinerTitle: 'Examinator',
    otherContactsTitle: 'Övriga kontakter',
  },
  extraInfo: {
    season: {
      1: 'VT ',
      2: 'HT ',
    },
  },
  sourceInfo: {
    noInfoYet: 'Ingen information tillagd',
    insertedSubSection: 'Avsnittet nedan kommer inte från kursplanen:',
  },
  sectionsLabels: {
    contentAndOutcomes: 'Innehåll och lärandemål',
    prep: 'Förberedelser inför kursstart',
    reqToFinal: 'Examination och slutförande',
    extra: 'Ytterligare Information',
    contacts: 'Kontakter',
    asterisk: 'Rubriker markerade med en asterisk ( * ) kommer från kursplan version',
  },
  memoTitlesByMemoLang: {
    additionalRegulations: 'Övriga föreskrifter',
    communicationDuringCourse: 'Kommunikation i kursen',
    courseContent: 'Kursinnehåll',
    courseCoordinator: 'Kursansvarig',
    ethicalApproach: 'Etiskt förhållningssätt',
    ethicalApproachThisCourse: 'Kursspecifika regler för etiskt förhållningssätt',
    equipment: 'Utrustning',
    examination: 'Examination',
    examinationModules: 'Examinationsmoduler',
    examiner: 'Examinator',
    extraHeaders1: 'Egen rubrik 1',
    extraHeaders2: 'Egen rubrik 2',
    extraHeaders3: 'Egen rubrik 3',
    extraHeaders4: 'Egen rubrik 4',
    extraHeaders5: 'Egen rubrik 5',
    gradingCriteria: 'Målrelaterade betygskriterier/bedömningskriterier',
    gradingScale: 'Betygsskala',
    infoForReregisteredStudents: 'Ändringar inför denna kursomgång',
    learningActivities: 'Läraktiviteter',
    learningOutcomes: 'Lärandemål',
    literature: 'Kurslitteratur',
    otherContacts: 'Övriga kontakter',
    otherRequirementsForFinalGrade: 'Övriga krav för slutbetyg',
    permanentDisability: 'Stöd för studenter med funktionsnedsättning',
    possibilityToAddition: 'Möjlighet till plussning',
    possibilityToCompletion: 'Möjlighet till komplettering',
    possibilityToCompensate: 'Möjlighet till ersättningsuppgifter',
    preparations: 'Särskilda förberedelser',
    prerequisites: 'Rekommenderade förkunskaper',
    reportingResults: 'Resultatrapportering',
    scheduleDetails: 'Detaljplanering',
    software: 'Programvara',
    teacher: 'Lärare',
    teacherAssistants: 'Lärarassistenter',
  },
  courseHeaderLabels: {
    adminLinkLabel: 'Administrera Om kursen',
    notLatestMemo: 'Detta är inte senaste versionen av kurs-PM.',
    laterMemos: 'Du hittar kurs-PM för nyare kursomgångar på sidan',
    show: 'Visa',
    latestVersionLabel: '(senaste versionen)',
    aboutCourseMemo: 'Kurs-PM',
    linkOpensInNewTab: 'Länken kommer att öppnas i ny flik',
    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas',
  },
  aboutHeaderLabels: {
    memoLabel: 'Kurs-PM',
    adminLinkLabel: 'Administrera Om kursen',
    linkOpensInNewTab: 'Länken kommer att öppnas i ny flik',
  },
  aboutMemoLabels: {
    notPublished: 'är inte publicerat',
    nonePublished: 'Det finns inga publicerade Kurs-PM',
    aboutMemosText1:
      'Här listas publicerade kurs-PM för pågående och kommande kursomgångar. Kurs-PM är kursomgångens detaljerade plan för kursens genomförande. Ett kurs-PM innehåller information som hjälper dig att förbereda, planera och genomföra kursen.',
    aboutMemosText2:
      'Kurs-PM ska vara publicerat senast vid kursens start. Saknas kurs-PM kan du kontakta kursens kontaktperson eller examinator. Kurs-PM för tidigare kursomgångar visas på sidan ',
    currentMemos: 'Publicerade kurs-PM',
    currentMemosInfo:
      '<p>Kurs-PM listas under den termin då kursomgången startade. Finns det flera publicerade kurs-PM för en termin kan du ta reda på vilket kurs-PM som tillhör din kursomgång genom att kontrollera kursens startdatum.</p><p>Du når även din kursomgångs kurs-PM via “Personliga menyn”.</p>',
    btnClose: 'Stäng',
    ariaLabel: 'Information om publicerade kurs-PM',
    shouldBePublished:
      'Kurs-PM ska vara publicerat senast vid kursens start. Har kurs-PM inte publicerats men din kurs har startat kan du kontakta kursens kontaktperson eller examinator.',
    courseInfo: 'Information om kursen',
    onPage: 'hittar du även på sidan',
    syllabusLink: 'Inför kursval',
    currentOfferings: 'Kursomgångar som startar',
    previousOfferingsText: 'Kurs-PM för tidigare kursomgångar visas på sidan ',
    previousOfferings: 'Tidigare kursomgångar',
    startdate: 'Startdatum',
  },
  breadCrumbs: {
    student: 'Studentwebben',
    studies: 'Studier',
    directory: 'Kurs- och programkatalogen',
  },
}
