interface Post {
  post_id: string;
  user_id: string;
  post_title: string;
  post_author: string;
  created_on: Date;
  price_listing: number;
  post_images: string[];
  rating: number;
}

export default Post;
