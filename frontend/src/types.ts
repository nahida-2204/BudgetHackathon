export interface Measure {
  category: string;
  title: string;
  value: string;
  description: string;
  iconName: string;
}

export interface ImpactProfile {
  id: string;
  name: string;
  iconName: string;
  title: string;
  benefitAmount: string;
  benefitSubtitle: string;
  measures: Measure[];
  bullets: string[];
}

export interface ExpenseCategory {
  name: string;
  amount: number; // in Rs per 1,000
  color: string;
  percentage: string;
}

export interface RevenueSource {
  name: string;
  percentage: number;
  color: string;
}

export interface ExpenditureCategory {
  name: string;
  percentage: number;
  color: string;
}

export interface BudgetMeasure {
  title: string;
  description: string;
}

export interface KeyMeasureCard {
  id: string;
  sector: string;
  measures: BudgetMeasure[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  originalText?: string;
  simplifiedText?: string;
  kreolText?: string;
  error?: string;
}
