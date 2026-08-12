export interface WaitlistFormData {
  name: string;
  email: string;
  interest_area: 'Text2Clip' | 'OVI' | 'Aura' | '';
}

export interface WaitlistResponse {
  status: string;
  message: string;
  timestamp: string;
}
