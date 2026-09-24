export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HireStackParamList = {
  HireHome: undefined;
  HirePost: undefined;
  HireProfile: undefined;
  HireApplicants: { vacancyId: number };
};

export type WorkStackParamList = {
  WorkHome: undefined;
  WorkApply: { vacancyId: number };
  WorkProfile: undefined;
};
