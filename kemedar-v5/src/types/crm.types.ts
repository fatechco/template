export type CRMLeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "dormant";
export type CRMOpportunityStage = "lead" | "qualified" | "proposal" | "negotiation" | "contract" | "closed_won" | "closed_lost";

export interface CRMContact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  firstNameAr: string | null;
  lastNameAr: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  company: string | null;
  jobTitle: string | null;
  source: string | null;
  leadStatus: CRMLeadStatus;
  leadScore: number;
  assignedToUserId: string | null;
  tags: string[];
  customFields: Record<string, any> | null;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  notes: string | null;
  preferredLanguage: string | null;
  preferredContactMethod: string | null;
  consentMarketing: boolean;
  consentWhatsapp: boolean;
  consentEmail: boolean;
  consentSms: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  opportunities?: CRMOpportunity[];
}

export interface CRMOpportunity {
  id: string;
  contactId: string;
  title: string;
  stage: CRMOpportunityStage;
  value: number | null;
  currency: string;
  probability: number | null;
  expectedCloseDate: string | null;
  propertyId: string | null;
  assignedToUserId: string | null;
  source: string | null;
  lostReason: string | null;
  notes: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CRMTask {
  id: string;
  contactId: string | null;
  title: string;
  description: string | null;
  type: string | null;
  priority: string | null;
  status: string;
  dueDate: string | null;
  assignedToUserId: string | null;
  completedAt: string | null;
}

export interface CRMNote {
  id: string;
  contactId: string;
  content: string;
  authorUserId: string;
  isPinned: boolean;
  createdAt: string;
}

export interface CRMPipeline {
  id: string;
  name: string;
  nameAr: string | null;
  isDefault: boolean;
  isActive: boolean;
  stages?: CRMPipelineStage[];
}

export interface CRMPipelineStage {
  id: string;
  pipelineId: string;
  name: string;
  nameAr: string | null;
  sortOrder: number;
  color: string | null;
  probability: number | null;
}
