import "./CreatorSection.css";
import { Code2, Heart, Sparkles } from "lucide-react";
import "./CreatorSection.css";

export default function CreatorSection() {
  return (
    <section className="creator-section">
      <div className="creator-glow creator-glow-one" />
      <div className="creator-glow creator-glow-two" />

      <div className="creator-content">

        <span className="creator-badge">
          <Sparkles size={16} />
          THE CREATOR BEHIND NEWSSKY
        </span>

        <div className="creator-logo">
          <Code2 size={38} />
        </div>

        <p className="creator-label">
          DESIGNED & DEVELOPED BY
        </p>

        <h2 className="creator-name">
          AMIR HUSSAIN
          <span>DOGAR.</span>
        </h2>

        <p className="creator-description">
          Turning ideas into beautiful digital
          experiences. Building modern web
          applications with creativity and passion.
        </p>

        <div className="creator-skills">
          <span>React Developer</span>
          <span>Creative Design</span>
          <span>Web Development</span>
        </div>

        <div className="creator-footer">
          Crafted with passion
          <Heart
            size={17}
            fill="#ff6584"
            color="#ff6584"
          />
        </div>

      </div>
    </section>
  );
}