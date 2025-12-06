<div class="about-container">
  <section class="hero">
    <h1>About YASS</h1>
    <p class="subtitle">Your journey to better bookmark management starts here</p>
  </section>

  <section class="mission">
    <h2>Our Mission</h2>
    <p>
      YASS (Yet Another Self-Hosted Sync) was created to solve a common problem: 
      managing bookmarks across multiple devices without relying on cloud services 
      that compromise your privacy. We believe in giving users full control over 
      their data while providing a seamless synchronization experience.
    </p>
  </section>

  <section class="story">
    <h2>The Story</h2>
    <p>
      Frustrated with existing bookmark management solutions that either required 
      expensive subscriptions, stored data on third-party servers, or lacked proper 
      synchronization capabilities, we set out to build something better.
    </p>
    <p>
      YASS emerged from the need for a simple, fast, and self-hosted solution that 
      just works. No vendor lock-in, no privacy concerns, no unnecessary complexity.
    </p>
  </section>

  <section class="principles">
    <h2>Core Principles</h2>
    <div class="principles-grid">
      <div class="principle">
        <h3>🏠 Self-Hosted</h3>
        <p>You control where your data lives. No third-party dependencies.</p>
      </div>
      <div class="principle">
        <h3>🔓 Open Source</h3>
        <p>Transparent code that you can audit and contribute to.</p>
      </div>
      <div class="principle">
        <h3>⚡ Fast & Lightweight</h3>
        <p>Optimized for performance without sacrificing features.</p>
      </div>
      <div class="principle">
        <h3>🔒 Privacy-First</h3>
        <p>Your data stays yours. No tracking, no analytics, no compromises.</p>
      </div>
    </div>
  </section>

  <section class="tech">
    <h2>Technology Stack</h2>
    <p>
      YASS is built with modern web technologies to ensure reliability, 
      performance, and ease of maintenance:
    </p>
    <ul class="tech-list">
      <li><strong>Frontend:</strong> SvelteKit for fast, reactive web applications</li>
      <li><strong>Backend:</strong> Node.js with Express for robust API services</li>
      <li><strong>Database:</strong> SQLite for simplicity and portability</li>
      <li><strong>Sync:</strong> Custom synchronization protocol for efficient data transfer</li>
    </ul>
  </section>

  <section class="cta">
    <h2>Join Us</h2>
    <p>
      YASS is open source and welcomes contributions. Whether you're a developer 
      looking to contribute code, a user providing feedback, or someone who wants 
      to help improve documentation, there's a place for you in our community.
    </p>
    <div class="cta-buttons">
      <a href="/docs" class="btn btn-primary">Get Started</a>
      <a href="https://github.com/yourusername/yass" class="btn btn-secondary">View on GitHub</a>
    </div>
  </section>
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    margin-bottom: 4rem;
  }

  .hero h1 {
    font-size: 3rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #6b7280;
  }

  section {
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  p {
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 1rem;
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .principle {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .principle h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .principle p {
    font-size: 0.95rem;
    margin: 0;
  }

  .tech-list {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid #1f2937;
  }

  .tech-list li {
    margin-bottom: 0.5rem;
  }

  .cta {
    text-align: center;
    background: #f9fafb;
    padding: 2rem;
    border-radius: 0.5rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #1f2937;
    color: white;
  }

  .btn-primary:hover {
    background: #374151;
  }

  .btn-secondary {
    background: white;
    color: #1f2937;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover {
    background: #f9fafb;
  }

  @media (max-width: 768px) {
    .about-container {
      padding: 1rem;
    }

    .hero h1 {
      font-size: 2rem;
    }

    .principles-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
    }
  }
</style>