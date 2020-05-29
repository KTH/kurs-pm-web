module.exports = {
  shortNames: ['sv', 'se'],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',

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
    locale_text: 'Kurs-PM på svenska',

    site_name: 'Om kursen',
    host_name: 'KTH',

    memoLabel: 'Kurs-PM',

    noPublishedMemo: 'Inget publicerat kurs-PM',
    obsoleteData: 'Data för kurs-PM är sparat med en tidigare version och föråldrat.',
    aboutCourse: 'Om kursen',
    aboutCourseMemos: 'Om kurs-PM',

    breadCrumbLabels: {
      university: 'KTH',
      student: 'Student på KTH',
      directory: 'Kurs- och programkatalogen',
      aboutCourse: 'Om kursen',
      aboutCourseMemos: 'Om kurs-PM'
    },

    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas',

    courseImage: {
      Arkitektur: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
      Bioteknik: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
      'Datalogi och datateknik': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
      Elektroteknik: 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
      Fysik: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
      'Industriell ekonomi': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
      Informationsteknik: 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
      'Informations- och kommunikationsteknik': 'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
      Kemiteknik: 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
      'Kemi och kemiteknik': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
      Matematik: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
      Miljöteknik: 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg',
      'Molekylära livsvetenskaper': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
      Maskinteknik: 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
      Materialvetenskap: 'Picture_by_MainFieldOfStudy_15_Materials_Science.jpg',
      'Medicinsk teknik': 'Picture_by_MainFieldOfStudy_16_Medical_Engineering.jpg',
      Materialteknik: 'Picture_by_MainFieldOfStudy_17_Materials_Engineering.jpg',
      Samhällsbyggnad: 'Picture_by_MainFieldOfStudy_18_Built_Environment.jpg',
      'Teknisk fysik': 'Picture_by_MainFieldOfStudy_19_Engineering_Physics.jpg',
      'Teknik och ekonomi': 'Picture_by_MainFieldOfStudy_20_Technology_Economics.jpg',
      'Teknik och hälsa': 'Picture_by_MainFieldOfStudy_21_Technology_Health.jpg',
      'Teknik och management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
      Teknik: 'Picture_by_MainFieldOfStudy_23_Technology.jpg',
      'Teknik och lärande': 'Picture_by_MainFieldOfStudy_25_Technology_Learning.jpg',
      default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg'
    },

    courseHeaderTitle: 'Kurs-PM',
    courseInformationTitle: 'Information',

    adminLinkLabel: 'Administrera Om kursen'
  },
  sideMenuLabels: {
    directory: 'Kurs- och programkatalogen',
    aboutCourse: 'Om kursen',
    beforeChoosingCourse: 'Inför kursval',
    aboutCourseMemos: 'Om kurs-PM',
    courseMemo: 'Förbereda och gå kurs',
    finishCourse: 'Slutföra ej avklarad kurs',
    courseDevelopmentAndHistory: 'Kursens utveckling och historik'
  },
  courseLinksLabels: {
    linkHeaderTitle: 'Student på KTH',
    beforeAndDuringACourse: 'Inför och under en kurs',
    contactPersonsAndStudentCounselling: 'Studievägledare och kanslier',
    rightsAndResponsibilities: 'Rättigheter och skyldigheter'
  },
  courseFactsLabels: {
    offeredByTitle: 'Kursen ges av',
    languageOfInstructionTitle: 'Undervisningsspråk'
  },
  courseMemoLinksLabels: {
    versionTitle: 'Version kurs-PM',
    latest: 'Senaste:',
    courseMemoArchiveLabel: 'Arkiv för kurs-PM',
    courseMemoPdf: 'Kurs-PM som pdf',
    syllabus: 'Kursplan',
    syllabusInformation: 'information hämtas från',
    syllabusLinkStart: 'Kursplan (',
    syllabusLinkEnd: '– )',
    mandatoryFieldMissing: 'Obligatoriskt innehåll saknas'
  },
  courseContactsLabels: {
    courseContactsTitle: 'Kontakter',
    communicationWithTeachersTitle: 'Kommunikation i kursen',
    courseCoordinatorTitle: 'Kursansvarig',
    teacherTitle: 'Lärare',
    teacherAssistantsTitle: 'Lärarassistenter',
    examinerTitle: 'Examinator',
    otherContactsTitle: 'Övriga kontakter'
  },
  extraInfo: {
    season: {
      1: 'VT ',
      2: 'HT '
    }
  },
  sourceInfo: {
    addNewTitle: 'Ange rubrik',
    fetched: 'Hämtats',
    '(c)': 'från kursgemensam information',
    '(r)': 'från kurstillfällesinformation',
    '(s)': 'från kursplan (s)',
    mandatory: 'Obligatorisk rubrik',
    mandatoryAndEditable: 'Obligatorisk rubrik',
    mandatoryForSome: 'Obligatorisk rubrik för vissa kurser',
    includeInMemo: 'Inkludera rubrik',
    noInfoYet:
      'Inget innehåll är inlagt. Välj Redigera för att lägga in innehåll eller välj att inte inkludera rubriken.',
    // includera rubrik
    notIncludedInMemoYet: 'Innehåll finns inlagt. Välj: Inkludera rubrik för att visa rubrik med innehåll i kurs-PM',
    // includera avsnitt
    notIncludedInMemoYetOfAddition: 'Innehåll finns inlagt. Välj: Inkludera avsnitt för att visa innehållet i kurs-PM',
    nothingFetched: {
      mandatoryAndEditable: `Inget innehåll är inlagt. Rubriken är obligatorisk och kommer att inkluderas i kurs-PM. 
      Välj Redigera för att lägga in innehåll.`,
      mandatory: `Inget innehåll fanns att hämta. Rubriken är obligatorisk och kommer att inkluderas i kurs-
      pm. Instruktioner om hur man ändrar hämtad information ges i informationsikonen ovan.`,
      mandatoryForSome: `Inget innehåll fanns att hämta. 
      Rubriken gäller således inte för den här kursen och kommer därför inte att inkluderas i kurs-PM.`,
      optional: `Inget innehåll fanns att hämta. Instruktioner om hur man ändrar hämtadinformation ges i informationsikonen ovan. 
      Du kan också välja att inte inkludera rubriken.`
    }
  },
  sectionsLabels: {
    contentAndOutcomes: 'Innehåll och lärandemål',
    prep: 'Förbereda inför kursstart',
    reqToFinal: 'Examination och slutförande',
    extra: 'Ytterligare Information',
    contacts: 'Kontakter'
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
    gradingCriteria: 'Målrelaterade betygskriterier',
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
    scheduleDetails: 'Detaljschema',
    software: 'Programvara',
    teacher: 'Lärare',
    teacherAssistants: 'Lärarassistenter'
  },
  courseHeaderLabels: {
    adminLinkLabel: 'Administrera Om kursen',
    linkOpensInNewTab: 'Länken kommer att öppnas i ny flik'
  },
  aboutHeaderLabels: {
    memoLabel: 'Kurs-PM',
    adminLinkLabel: 'Administrera Om kursen',
    linkOpensInNewTab: 'Länken kommer att öppnas i ny flik'
  },
  aboutMemoLabels: {
    aboutMemosText:
      'Varje kursomgång för en kurs ska tillhandahålla ett kurs-PM senast vid kursstart. Kurs-PM är kursomgångens detaljerade plan för genomförande. Ett kurs-PM innehåller information som hjälper studenten att förbereda och planera för kursomgångens genomförande och examination. Det ska beskriva studentens rättigheter och skyldigheter. Nedan listas de kurs-PM som är publicerade denna termin, föregående och kommande.',
    currentMemos: 'Aktuella kurs-PM'
  },
  coursePresentationLabels: {
    imageAltText: 'Inspirerande bild för kursen',
    imageTitleText: ''
  }
}
