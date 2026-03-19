import { TEST_USER } from "../constants";

export function createUser(overrides = {}) {
  return {
    id: TEST_USER.id,
    email: TEST_USER.email,
    name: TEST_USER.name,
    avatar_url: null,
    rating: 0,
    reviews_count: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createAuthUser(overrides = {}) {
  return {
    id: TEST_USER.id,
    email: TEST_USER.email,
    user_metadata: { name: TEST_USER.name },
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
