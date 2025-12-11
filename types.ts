
export interface PolicySection {
  id: string;
  title: string;
  snippet: string;
  relevance: string;
}

export interface RealityGap {
  insurer_claim: string;
  actual_policy: string;
  vynda_comment: string;
  severity: 'Critical' | 'Major' | 'Minor';
}

export interface MemoryCase {
  id: string;
  similarity_score: number;
  payer: string;
  procedure_type: string;
  outcome: string;
  resolution_time_days: number;
  similarity_reason: string;
  key_lever: string;
  strategy_detail: string;
}

export interface MissingEvidenceItem {
  id: string; // Added ID for state management
  label: string;
  importance: 'Critical' | 'Important' | 'Helpful'; // Updated values
  impact_if_added: string;
  why_it_matters: string;
}

export interface CollectiveStats {
  total_cases: number;
  similar_patterns: number;
  win_rate: number;
  avg_resolution_days: number;
  payer_denial_rate: number;
  total_recovered: string; // Added
}

export interface VyndaResponse {
  case_summary: {
    patient_name: string;
    payer: string;
    procedure: string;
    denial_reason_raw: string;
    true_denial_cause: string;
    fairness_assessment: 'Unfair' | 'Standard' | 'Gray Area';
    win_probability_percent: number;
    overall_rationale: string;
  };
  policy_analysis: {
    referenced_sections: PolicySection[];
    insurer_claim_vs_policy: RealityGap[];
  };
  memory_cases: MemoryCase[];
  missing_evidence: {
    checklist_items: MissingEvidenceItem[];
    vynda_summary: string;
  };
  appeal_letter?: {
    title: string;
    body: string;
    key_arguments: string[]; // Added
    recommended_attachments: string[]; // Added
    strategic_notes: string; // Added
  };
  patient_explanation: {
    short: string;
    long: string;
    next_steps: string[];
  };
  collective_stats: CollectiveStats;
  consultant_prompt?: string; // Added
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UploadedFile {
  file: File;
  base64: string;
  mimeType: string;
  label: 'DENIAL_LETTER' | 'POLICY_DOC';
}
