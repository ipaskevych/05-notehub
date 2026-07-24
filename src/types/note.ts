export interface Note {
  id: string;
  title: string;
  content: string;
  tag: 'Work' | 'Personal' | 'Shopping';
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: 'Work' | 'Personal' | 'Shopping';
}