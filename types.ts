export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface IdeaFormData {
  title: string;
  description: string;
  tags: string[];
}

export interface AIResponse {
  description: string;
  tags: string[];
}
