import type { Profile } from '../../types';
import { mockProfile } from '../mock/profile';

export interface IProfileService {
  get(): Promise<Profile>;
}

class MockProfileService implements IProfileService {
  async get(): Promise<Profile> {
    return mockProfile;
  }
}

export const profileService: IProfileService = new MockProfileService();
