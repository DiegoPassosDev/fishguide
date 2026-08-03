export interface PostComment {
  id: number;
  author: string;
  text: string;
}

export interface PostCatch {
  species: string;
  weight: string;
  location: string;
  tide: string;
}

export interface Post {
  id: number;
  authorName: string;
  avatarColor: string;
  followed: boolean;
  topic: string;
  timeAgo: string;
  content: string;
  photo?: boolean;
  photoUrl?: string;
  catch?: PostCatch;
  likes: number;
  comments: PostComment[];
  shares: number;
  liked: boolean;
}
