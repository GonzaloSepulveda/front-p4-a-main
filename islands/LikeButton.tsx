import { useState } from "preact/hooks";
import { JSX } from "preact";
import axios from "axios";


interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isLiked?: boolean;
}

export default function LikeButton(
  { postId, initialLikes, isLiked = false }: LikeButtonProps,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => { //Cambiada la logica de la funcion
  e.preventDefault();
  if (isLoading) return;

  try {
    setIsLoading(true);
    setError("");

    if (liked) {
      // Eliminar el like
      await axios.delete(`https://back-p5-y0e1.onrender.com/api/posts/${postId}/like`, { //link cambiado
        headers: { "Content-Type": "application/json" },
      });
      setLikes((prev) => prev - 1);
    } else {
      // Agregar el like
      await axios.post(`https://back-p5-y0e1.onrender.com/api/posts/${postId}/like`, null, {
        headers: { "Content-Type": "application/json" },
      });
      setLikes((prev) => prev + 1);
    }

    setLiked(!liked);
  } catch (err) {
    console.error("Error al dar/quitar like:", err);
    setError("No se pudo actualizar el like");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="like-button-container">
      <button
        type="button"
        onClick={handleLike}
        disabled={isLoading}
        className={`like-button ${liked ? "liked" : ""} ${
          isLoading ? "loading" : ""
        }`}
        aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
      >
        <span className="like-icon">
          {isLoading ? "⏳" : liked ? "❤️" : "🤍"}
        </span>
        <span className="like-count">{likes}</span>
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
