export interface LegalSubsection {
  subheading: string;
  content: string;
  summary?: string;
}

export interface LegalSection {
  heading: string;
  content?: string;
  summary?: string;
  subsections?: LegalSubsection[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface LegalContent {
  terms: {
    en: LegalDocument;
    ar: LegalDocument;
  };
  privacy: {
    en: LegalDocument;
    ar: LegalDocument;
  };
}
