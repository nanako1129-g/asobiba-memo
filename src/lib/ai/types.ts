/** 詳細画面「AIあそび方提案」の応答 */
export type VisitSuggestions = {
  summary: string;
  playFlow: string;
  stayDuration: string;
  hydrationNote: string;
  precautions: string;
};

export type VisitSuggestionsRequest = {
  placeName: string;
  ward: string;
  ageGroup: string;
  playTip: string;
  comment: string;
  address: string;
  nursingRoom: boolean;
  diaperChange: boolean;
  strollerOk: boolean;
};

export type PlayTipDraftRequest = {
  placeName: string;
  ward: string;
  ageGroup: string;
  comment: string;
  nursingRoom: boolean;
  diaperChange: boolean;
  strollerOk: boolean;
};

export type PlayTipDraftResponse = {
  playTipDraft: string;
};
