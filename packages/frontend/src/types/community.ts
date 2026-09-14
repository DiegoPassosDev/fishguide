export interface CommunityAuthor {
  id: string;
  name: string;
  avatar: string | null;
  verified: boolean;
}

export interface PostCatchInfo {
  species?: string;
  weight?: string;
  location?: string;
  tide?: string;
}

export interface CommunityPost {
  id: string;
  content: string;
  topic: string | null;
  photo: string | null;
  catchInfo: PostCatchInfo | null;
  likes: number;
  shares: number;
  likedByMe: boolean;
  followedByMe: boolean;
  commentsCount: number;
  createdAt: string;
  author: CommunityAuthor;
}

export interface CommunityComment {
  id: string;
  content: string;
  createdAt: string;
  author: CommunityAuthor;
}

export interface TopicCount {
  name: string;
  count: number;
}

export interface CreatePostInput {
  content: string;
  topic?: string;
  photo?: string;
  catchInfo?: PostCatchInfo;
}