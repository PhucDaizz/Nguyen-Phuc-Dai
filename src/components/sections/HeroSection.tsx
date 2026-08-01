import React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import portfolioData from "../../data/portfolioData.json";

interface HeroSectionProps {
  containerVariants: Variants;
  itemVariants: Variants;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  containerVariants,
  itemVariants,
}) => {
  return (
    <section
      className="hero-section container"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/icon.png"
            alt="Logo"
            style={{ width: "64px", height: "64px", objectFit: "contain" }}
          />
          <h5
            style={{
              fontSize: "1rem",
              letterSpacing: "0.2em",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {portfolioData.hero.role}
          </h5>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h1>{portfolioData.hero.name}</h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p
            style={{ maxWidth: "700px", marginTop: "3rem", fontSize: "1.4rem" }}
          >
            {portfolioData.hero.description}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ marginTop: "4rem", display: "flex", gap: "2rem" }}
        >
          <a
            href="#about"
            className="interactive-element"
            style={{
              paddingBottom: "0.2rem",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {portfolioData.hero.ctaText}{" "}
            <ArrowUpRight
              size={16}
              style={{
                display: "inline",
                marginLeft: "0.5rem",
                marginBottom: "-2px",
              }}
            />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)" }}
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <div className="scroll-indicator" role="button" aria-label="Scroll to About" title="Scroll down">
          <span className="scroll-indicator-dot" />
        </div>
      </motion.div>
    </section>
  );
};
