import { Handlers } from "$fresh/server.ts";
import axios from "axios";
import type { ApiResponseSingleSuccess } from "../../models/api_response.ts";
import type Post from "../../models/post.ts";
import PostCover from "../../islands/PostCover.tsx";
import LikeButton from "../../islands/LikeButton.tsx";
//Las variables coinciden con el back
interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const { data } = await axios.get<ApiResponseSingleSuccess<Post>>(
        `https://back-p5-y0e1.onrender.com/api/posts/${ctx.params.id}`,
      );
      return ctx.render({ post: data.data });
    } catch (_) {
      return ctx.render({ post: null });
    }
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const author = form.get("author")?.toString() || "";
    const content = form.get("content")?.toString() || "";

    if (!author || !content) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      await axios.patch(
        `https://back-p5-y0e1.onrender.com/api/posts/${ctx.params.id}/comments`,
        { author, content },
        { headers: { "Content-Type": "application/json" } },
      );

      const headers = new Headers();
      headers.set("location", `/post/${ctx.params.id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      return new Response("Error posting comment", { status: 500 });
    }
  },
};

interface PostProps {
  data: {
    post: (Post & { comments?: Comment[] }) | null;
  };
}

export default function PostDetail({ data }: PostProps) {
  const { post } = data;
  if (!post) {
    return (
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
              <circle cx="12" cy="16" r="1"></circle>
            </svg>
          </div>
          <h1>Oops! Post not found</h1>
          <p>The post you're looking for doesn't exist or was removed.</p>
          <div className="not-found-actions">
            <a href="/" className="back-home-btn">
              Back to Home
            </a>
            <a href="/search" className="search-link">
              Search posts
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string"
      ? new Date(dateString)
      : dateString;
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="post-detail">
      <PostCover
        src={post.cover}
        alt={`Cover image for: ${post.title}`}
        width={1200}
        height={400}
      />

      <div className="post-container">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">By {post.author}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </header>

        <article className="post-content">
          <div className="post-text">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <footer className="post-footer">
          <div className="post-actions">
            <LikeButton
              postId={post._id}
              initialLikes={post.likes}
              isLiked={false}
            />
          </div>

          <section className="comments-section" aria-label="Comments">
            <h3>Comments ({post.comments?.length || 0})</h3>

            <form method="POST" className="comment-form">
              <div className="form-group">
                <label htmlFor="author">Name:</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Comment:</label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Write your comment..."
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                Post comment
              </button>
            </form>

            <div className="comments-list-container">
              {post.comments && post.comments.length > 0 ? (
                <div className="comments-list">
                  {post.comments.map((comment: Comment) => (
                    <article key={comment._id} className="comment">
                      <header className="comment-header">
                        <strong>{comment.author}</strong>
                        <time
                          dateTime={comment.createdAt}
                          className="comment-date"
                        >
                          {formatDate(comment.createdAt)}
                        </time>
                      </header>
                      <p className="comment-content">{comment.content}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="no-comments">Be the first to comment</p>
              )}
            </div>
          </section>
        </footer>
      </div>
    </div>
  );
}
