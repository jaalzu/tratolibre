import { vi } from "vitest";

export const mockRedirect = vi.fn();
export const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  replace: vi.fn(),
};

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
  useRouter: () => mockRouter,
  usePathname: () => "/",
}));
