import api from "./api";
import type {
  CommunityComment,
  CommunityPost,
  CreatePostInput,
  TopicCount,
  UpdatePostInput,
} from "@/types/community";

export async function fetchPosts(topic?: string): Promise<CommunityPost[]> {
  const response = await api.get<CommunityPost[]>("/posts", {
    params: topic ? { topic } : {},
  });
  return response.data;
}

export async function fetchTopics(): Promise<TopicCount[]> {
  const response = await api.get<TopicCount[]>("/posts/topics");
  return response.data;
}

export async function createPost(input: CreatePostInput): Promise<CommunityPost> {
  const response = await api.post<CommunityPost>("/posts", input);
  return response.data;
}

export async function updatePost(
  id: string,
  input: UpdatePostInput,
): Promise<CommunityPost> {
  const response = await api.patch<CommunityPost>(`/posts/${id}`, input);
  return response.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

export async function togglePostLike(id: string): Promise<{ liked: boolean; likes: number }> {
  const response = await api.post<{ liked: boolean; likes: number }>(`/posts/${id}/like`);
  return response.data;
}

export async function sharePost(id: string): Promise<{ shares: number }> {
  const response = await api.post<{ shares: number }>(`/posts/${id}/share`);
  return response.data;
}

export async function toggleFollow(
  id: string,
): Promise<{ followed: boolean; authorId: string }> {
  const response = await api.post<{ followed: boolean; authorId: string }>(
    `/posts/${id}/follow`,
  );
  return response.data;
}

export async function fetchComments(postId: string): Promise<CommunityComment[]> {
  const response = await api.get<CommunityComment[]>(`/posts/${postId}/comments`);
  return response.data;
}

export async function addComment(
  postId: string,
  content: string,
): Promise<CommunityComment> {
  const response = await api.post<CommunityComment>(`/posts/${postId}/comments`, {
    content,
  });
  return response.data;
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await api.delete(`/posts/${postId}/comments/${commentId}`);
}