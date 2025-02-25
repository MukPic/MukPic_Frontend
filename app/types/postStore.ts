import { create } from "zustand";

interface PostState {
  communityKey: number;
  title: string;
  content: string;
  imageUrls: string[]; // imageUrls로 통일
  likeCount: number;
  profileImage: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  liked: boolean;
  images: File[];

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setImageUrls: (imageUrls: string[]) => void;
  setLikeCount: (likeCount: number) => void;
  setProfileImage: (profileImage: string) => void;
  setUserName: (userName: string) => void;
  setCreatedAt: (createdAt: string) => void;
  setUpdatedAt: (updatedAt: string) => void;
  setCategory: (category: string) => void;
  setLiked: (liked: boolean) => void;
  setImages: (images: File[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  communityKey: 0,
  title: "",
  content: "",
  imageUrls: [], // imageUrls로 일관성 있게 사용
  likeCount: 0,
  profileImage: "",
  userName: "",
  createdAt: "",
  updatedAt: "",
  category: "",
  liked: false,
  images: [],

  setTitle: (title: string) => set({ title }),
  setContent: (content: string) => set({ content }),
  setImageUrls: (imageUrls: string[]) => set({ imageUrls }), // imageUrls로 변경
  setLikeCount: (likeCount: number) => set({ likeCount }),
  setProfileImage: (profileImage: string) => set({ profileImage }),
  setUserName: (userName: string) => set({ userName }),
  setCreatedAt: (createdAt: string) => set({ createdAt }),
  setUpdatedAt: (updatedAt: string) => set({ updatedAt }),
  setCategory: (category: string) => set({ category }), // 중복된 setCategory 제거
  setLiked: (liked: boolean) => set({ liked }),
  setImages: (images: File[]) => set({ images }),
}));
