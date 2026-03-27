export * from "./queries";
export * from "./mutations";

export type { PendingReview };
import type { getPendingReviews } from "./queries";
type PendingReview = Awaited<ReturnType<typeof getPendingReviews>>[number];
