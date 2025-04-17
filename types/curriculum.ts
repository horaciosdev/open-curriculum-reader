// Tipos para autocompleção com flexibilidade
type IdentifierType = 'CPF' | 'CNPJ' | 'Passport' | 'SSN' | 'NIN' | 'CURP' | 'DNI' | 'Other' | string;
type NetworkType = 'LinkedIn' | 'GitHub' | 'Lattes' | 'Twitter' | 'X' | 'Stack Overflow' | 'Instagram' | 'Medium' | 'Dev.to' | 'Facebook' | 'Mastodon' | string;
type StudyType = 'Associate' | 'Bachelor' | 'Master' | 'PhD' | 'Technologist' | 'TeachingDegree' | 'Certificate' | 'Diploma' | 'HighSchool' | 'Specialization' | 'PostGraduate' | string;
type SkillCategory = 'hard' | 'soft' | 'cloud' | 'devops' | 'language' | 'framework' | 'tool' | 'methodology' | 'management' | 'design' | 'communication' | string;

export interface Curriculum {
  [key: string]: any;
  meta: {
    formatVersion: string;
    createdAt: string;
    updatedAt?: string;
    language?: string;
  };
  basics: {
    name: string;
    label?: string;
    image?: string;
    summary: string;
    identifiers?: Array<{
      type: IdentifierType;
      value: string;
    }>;
    location: {
      address?: string;
      city: string;
      region?: string;
      countryCode: string;
    };
    profiles: Array<{
      network: NetworkType;
      url: string;
      username?: string;
    }>;
  };
  work: Array<{
    organization: string;
    position: string;
    url?: string;
    startDate: string;
    endDate?: string | null;
    highlights?: string[];
  }>;
  education: Array<{
    institution: string;
    studyType: StudyType;
    area: string;
    startDate: string;
    endDate?: string;
    courses?: string[];
    score?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  skills?: Array<{
    name: string;
    category: SkillCategory;
    keywords?: string[];
  }>;
  volunteer?: Array<{
    organization: string;
    position: string;
    startDate: string;
    endDate?: string | null;
    highlights?: string[];
  }>;
  awards?: Array<{
    title: string;
    date: string;
    awarder: string;
  }>;
  publications?: Array<{
    name: string;
    publisher: string;
    releaseDate: string;
    url: string;
  }>;
  interests?: Array<{
    name: string;
    keywords?: string[];
  }>;
  references?: Array<{
    name: string;
    reference: string;
  }>;
}