module.exports = {
  shortNames: ['en'],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%d-%b-%Y',
    language_link_lang_sv: 'Svenska',
    menu_panel_search: 'Search',
    menu_panel_close: 'Close',
    menu_panel_menu: 'Menu',

    /**
     * Error messages
     */

    error_not_found: "Sorry, we can't find your requested page",
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'Node application name',

    example_message_key: 'This is an english translation of a label',

    button_label_example: 'Click me to send data to server!',

    field_text_example: 'Data to be sent to API',

    field_label_get_example: 'My modelData(Response from api call GET): ',
    field_label_post_example: 'My modelData(Response from api call POST): ',

    lang_block_id: '1.77273',
    locale_text: 'This page in English',

    site_name: 'About course',
    host_name: 'KTH',

    button_mobile_menu_label: 'Open/close the mobile menu',
    mobile_menu_aria_label: 'Mobile menu',

    skip_to_main_content: 'Skip to main content',
    back_to_top_label: 'To page top',

    memoLabel: 'Course memo',
    prepositionFor: 'for',

    noPublishedMemo: 'No published course memo',
    obsoleteData: 'Course memo data was saved in an earlier version and is obsolete.',
    aboutCourse: 'About course',

    mandatoryFieldMissing: 'Missing mandatory information',

    courseMainSubjects: {
      Architecture: 'Arkitektur',
      Biotechnology: 'Bioteknik',
      'Computer Science and Engineering': 'Datalogi och datateknik',
      'Electrical Engineering': 'Elektroteknik',
      Physics: 'Fysik',
      'Industrial Management': 'Industriell ekonomi',
      'Information Technology': 'Informationsteknik',
      'Information and Communication Technology': 'Informations- och kommunikationsteknik',
      'Chemical Science and Engineering': 'Kemiteknik',
      'Chemistry and Chemical Engineering': 'Kemi och kemiteknik',
      Mathematics: 'Matematik',
      'Environmental Engineering': 'Miljöteknik',
      'Molecular Life Science': 'Molekylära livsvetenskaper',
      'Mechanical Engineering': 'Maskinteknik',
      'Materials Science': 'Materialvetenskap',
      'Medical Engineering': 'Medicinsk teknik',
      'Materials Science and Engineering': 'Materialteknik',
      'Built Environment': 'Samhällsbyggnad',
      'Engineering Physics': 'Teknisk fysik',
      'Technology and Economics': 'Teknik och ekonomi',
      'Technology and Health': 'Teknik och hälsa',
      'Technology and Management': 'Teknik och management',
      Technology: 'Teknik',
      'Engineering and Management': 'Teknik och management',
      'Technology and Learning': 'Teknik och lärande',
      default: 'default',
    },

    courseInformationTitle: 'Information',

    adminLinkLabel: 'Administer About course',
  },
  sideMenuLabels: {
    directory: 'Course and programme directory',
    aboutCourse: 'About course',
    beforeChoosingCourse: 'Before course selection',
    aboutCourseMemos: 'Course memo',
    courseMemo: 'Prepare and take course',
    finishCourse: 'Finish course',
    courseDevelopment: 'Course development',
    archive: 'Archive',
    subMenuAriaLabel: 'Sub menu',
  },
  courseLinksLabels: {
    linkHeaderTitle: 'Related information',
    administrateYouStudy: 'Administrate your studies',
    courseAndExamination: 'Course and examination',
    rightsAndResponsibilities: 'Rights and responsibilities',
  },
  coverPageLabels: {
    roundsTitle: 'Course offering',
    offeredByTitle: 'Offered By',
    languageOfInstructionTitle: 'Language Of Instruction',
    syllabusInformation: 'Fetched from',
    syllabusLinkStart: 'Syllabus ',
    syllabusLinkMiddle: '(',
    syllabusLinkEnd: ')',
    memoSource: 'Printed from page',
  },
  courseFactsLabels: {
    roundFacts: 'Round Facts',
    offeredByTitle: 'Offered By',
    languageOfInstructionTitle: 'Language Of Instruction',
    roundsTitle: 'Course offering',
    startDate: 'Start date',
    mandatoryFieldMissing: 'Missing mandatory information',
  },
  courseMemoLinksLabels: {
    documents: 'Documents',
    versionTitle: 'Course memo version',
    latest: 'Latest:',
    courseMemoArchiveLabel: 'Course memo archive',
    archivePageLabel: 'Archive page',
    courseMemoPdf: 'Course memo pdf',
    courseMemoPrint: 'Print or save',
    syllabus: 'Syllabus',
    syllabusInformation: 'fetched from',
    syllabusLinkStart: 'Syllabus (',
    syllabusLinkEnd: ')',
    mandatoryFieldMissing: 'Missing mandatory information',
    inDevelopment: 'In development',
    printDialog: 'Print or save course memo',
    version: 'Ver',
  },
  courseContactsLabels: {
    courseContactsTitle: 'Contacts',
    communicationWithTeachersTitle: 'Communication during course',
    courseCoordinatorTitle: 'Course Coordinator',
    teacherTitle: 'Teachers',
    teacherAssistantsTitle: 'Teacher Assistants',
    examinerTitle: 'Examiner',
    otherContactsTitle: 'Other Contacts',
  },
  extraInfo: {
    season: {
      1: 'Spring ',
      2: 'Autumn ',
    },
  },
  sourceInfo: {
    noInfoYet: 'No information inserted',
    insertedSubSection: 'The section below is not retrieved from the course syllabus:',
  },
  sectionsLabels: {
    contentAndOutcomes: 'Content and learning outcomes',
    prep: 'Preparations before course start',
    reqToFinal: 'Examination and completion',
    extra: 'Further information',
    contacts: 'Contact',
    asterisk: 'Headings denoted with an asterisk ( * ) is retrieved from the course syllabus version ',
  },
  memoTitlesByMemoLang: {
    additionalRegulations: 'Additional regulations',
    communicationDuringCourse: 'Communication during course',
    courseContent: 'Course contents',
    courseCoordinator: 'Course coordinator',
    ethicalApproachThisCourse: 'Course specific regulations for ethical approach',
    ethicalApproach: 'Ethical approach',
    equipment: 'Equipment',
    examiner: 'Examiner',
    examination: 'Examination',
    examinationModules: 'Examination set',
    extraHeaders1: 'Extra header 1',
    extraHeaders2: 'Extra header 2',
    extraHeaders3: 'Extra header 3',
    extraHeaders4: 'Extra header 4',
    extraHeaders5: 'Extra header 5',
    gradingCriteria: 'Grading criteria/assessment criteria',
    gradingScale: 'Grading scale',
    infoForReregisteredStudents: 'Changes of the course before this course offering',
    learningActivities: 'Learning activities',
    learningOutcomes: 'Intended learning outcomes',
    literature: 'Literature',
    otherContacts: 'Other contacts',
    otherRequirementsForFinalGrade: 'Other requirements for final grade',
    permanentDisability: 'Support for students with disabilities',
    possibilityToAddition: 'Opportunity to raise an approved grade via renewed examination',
    possibilityToCompletion: 'Opportunity to complete the requirements via supplementary examination',
    possibilityToCompensate: 'Alternatives to missed activities or tasks',
    preparations: 'Specific preparations',
    prerequisites: 'Recommended prerequisites',
    reportingResults: 'Reporting of exam results',
    scheduleDetails: 'Detailed plan',
    software: 'Software',
    teacher: 'Teacher',
    teacherAssistants: 'Teacher assistants',
  },
  courseHeaderLabels: {
    adminLinkLabel: 'Administer About course',
    notLatestMemo: 'The displayed memo is not the latest version.',
    laterMemos: 'Recent memos are listed on',
    show: 'Show',
    latestVersionLabel: '(latest version)',
    aboutCourseMemo: 'Course memo',
    linkOpensInNewTab: 'Link will open in new tab',
    mandatoryFieldMissing: 'Missing mandatory information',
  },
  aboutHeaderLabels: {
    memoLabel: 'Course memo',
    adminLinkLabel: 'Administer About course',
    linkOpensInNewTab: 'Link will open in new tab',
  },
  aboutMemoLabels: {
    notPublished: 'is not published',
    nonePublished: 'There are no published course memos',
    aboutMemosText1:
      'Here you will find published course memos for ongoing and comming course offerings. The course memo is the course offering’s detailed plan. A course memo contains information to help you prepare, plan and complete the course.',
    aboutMemosText2:
      'The course memo must be published no later than at the start of the course. If the course memo is missing, you can contact the course contact or examiner. Course memos for previous course offerings are displayed on the ',
    currentMemos: 'Published course memos',
    currentMemosInfo:
      '<p>The course memo is listed under the semester when the course offering started. If there are several published course memos for one semester, you can find out which course memo belongs to your course offering by checking the course start date.</p><p>You can also reach your course offering’s course memo via the "Personal menu".</p>',
    btnClose: 'Close',
    ariaLabel: 'Information about published course memos',
    shouldBePublished:
      'The course memo shall be published no later than at the start of the course. If the course memo is missing and the course has started, you can contact the course contact or examiner.',
    courseInfo: 'Information about the course',
    onPage: 'is also found on the page',
    syllabusLink: 'Before course selection',
    currentOfferings: 'Course offerings starting',
    previousOfferingsText: 'Course memos for previous course offerings are displayed on the ',
    previousOfferings: 'Previous course offerings',
    startdate: 'Start date',
    noMemos: 'This course has no published course memos.',
  },
  breadCrumbs: {
    student: 'Student web',
    studies: 'Studies',
    directory: 'Course and programme directory',
  },
}
