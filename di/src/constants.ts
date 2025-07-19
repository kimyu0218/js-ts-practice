import { Profile } from './types';

export const LOG_MESSAGES = {
  INIT: 'Initialize Container.',
  SET_PROFILE: (profile: Profile) => `Set profile as "${profile}"`,
  REGISTER: (profile: Profile, token: string) => `Register "${profile}.${token}"`,
  INJECT: (profile: Profile, token: string) => `Inject "${profile}.${token}".`,
};

export const ERROR_MESSAGES = {
  ENV_ALREADY_SET: 'Env can only be set once.',
  MULTIPLE_PROVIDERS: (token: string) => `Provider for token "${token}" already registered for this profile.`,
  NO_PROVIDER: (token: string) => `No provider found for token "${token}". Ensure it is registered in your module.`,
};
