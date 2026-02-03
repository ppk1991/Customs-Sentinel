
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Declaration {
  id: string;
  exporter: string;
  importer: string;
  itemDescription: string;
  declaredValue: number;
  currency: string;
  originCountry: string;
  hsCode: string;
  riskScore: number;
  riskLevel: RiskLevel;
  timestamp: string;
  status: 'PENDING' | 'CLEARED' | 'FLAGGED' | 'INSPECTING';
  documentRefs?: string[];
  documentStatus?: {
    name: string;
    status: 'PRESENT' | 'MISSING' | 'INCONSISTENT';
  }[];
}

export interface CustomsEvent {
  id: string;
  date: string;
  type: 'SEIZURE' | 'FRAUD' | 'MISCLASSIFICATION' | 'SANCTION_HIT';
  description: string;
  entities: string[];
  severity: RiskLevel;
  outcome: string;
}

export interface TrafficSegment {
  category: string;
  volume: number;
  riskAnalysis: string;
  context: string;
}

export type View = 
  'dashboard' 
  | 'upload' 
  | 'declarations' 
  | 'risk-engine' 
  | 'simulator' 
  | 'case-history' 
  | 'admin';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface RiskAnalysisResponse {
  score: number;
  level: RiskLevel;
  analysis: string;
  flags: string[];
  valuationAnomaly?: number;
  documentAnalysis?: {
    indicator_id: string;
    finding: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}
