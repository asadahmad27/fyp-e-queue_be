const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};
const FILE_KEYS = {
  PROFILE_PICS: 'profile_pics',
  BRAND_LOGO: 'brand_logos',
  PRODUCT_IMAGES: 'product_images',
  FEED_IMAGES: 'feed_images',
};

const REVIEW_STATUS = {
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
};

const REVIEW_STAT = {
  EXCELLENT: 'Excellent',
  GREAT: 'Great',
  AVERAGE: 'Average',
  BAD: 'Bad',
  POOR: 'Poor',
};
const DEFAULT_REVIEW_COUNT = 2;

const AD_STATUS = {
  ACTIVE: "Active",
  FEATURED: "Featured",
  SOLD: "Sold"
}

export {
  USER_ROLES,
  FILE_KEYS,
  REVIEW_STATUS,
  REVIEW_STAT,
  DEFAULT_REVIEW_COUNT,
  AD_STATUS
};

export const SUSPENDED = 'suspended';
export const REVIEW_NOT_ALLOWED = 'review-not-allowed';
