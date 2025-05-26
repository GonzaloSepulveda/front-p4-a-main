import Comment from "./comments.ts";
//Cambiado a ingles
interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  cover: string;
  likes: number;
  createdAt: Date;
  updated_at: Date;
  comentarios: Comment[];
}

export default Post;
