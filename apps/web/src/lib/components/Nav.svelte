<nav>
  <div class="nav-container">
    <div class="nav-brand">
      <a href="/">YASS</a>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/about" class="nav-link">About</a>
      <a href="/docs" class="nav-link">Docs</a>
      <a href="/get-started" class="nav-link nav-cta">Get Started</a>
    </div>
  </div>
</nav>

<style>
  nav {
    background: rgba(255, 255, 255, 0.399);
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    backdrop-filter: blur(5px);
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    color: #6b7280;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: #1f2937;
  }

  .nav-cta {
    background: #1f2937;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }

  .nav-cta:hover {
    background: #374151;
    color: white;
  }

  @media (max-width: 768px) {
    .nav-container {
      padding: 1rem;
    }

    .nav-links {
      gap: 1rem;
    }

    .nav-brand a {
      font-size: 1.25rem;
    }
  }
</style>