<script lang="ts">
	import Nav from "$lib/components/Nav.svelte";

</script>

<Nav/>
<div class="docs-container">
  <aside class="sidebar">
    <nav class="docs-nav">
      <h3>Documentation</h3>
      <ul>
        <li><a href="#getting-started" class="nav-link">Getting Started</a></li>
        <li><a href="#installation" class="nav-link">Installation</a></li>
        <li><a href="#configuration" class="nav-link">Configuration</a></li>
        <li><a href="#sync-setup" class="nav-link">Sync Setup</a></li>
        <li><a href="#api-reference" class="nav-link">API Reference</a></li>
        <li><a href="#troubleshooting" class="nav-link">Troubleshooting</a></li>
      </ul>
    </nav>
  </aside>

  <main class="docs-content">
    <section id="getting-started">
      <h1>Getting Started</h1>
      <p>
        Welcome to YASS! This guide will help you set up your self-hosted bookmark 
        synchronization service in minutes.
      </p>
    </section>

    <section id="installation">
      <h2>Installation</h2>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js 18+ or Docker</li>
        <li>2GB RAM minimum</li>
        <li>1GB disk space</li>
      </ul>

      <h3>Option 1: Docker (Recommended)</h3>
      <pre><code>docker run -d \
  --name yass \
  -p 3000:3000 \
  -v yass-data:/app/data \
  yass/yass:latest</code></pre>

      <h3>Option 2: npm</h3>
      <pre><code>npm install -g yass
yass init
yass start</code></pre>

      <h3>Option 3: From Source</h3>
      <pre><code>git clone https://github.com/yourusername/yass.git
cd yass
npm install
npm run build
npm start</code></pre>
    </section>

    <section id="configuration">
      <h2>Configuration</h2>
      
      <h3>Environment Variables</h3>
      <div class="config-table">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>PORT</code></td>
              <td>3000</td>
              <td>Server port</td>
            </tr>
            <tr>
              <td><code>HOST</code></td>
              <td>0.0.0.0</td>
              <td>Bind address</td>
            </tr>
            <tr>
              <td><code>DATABASE_URL</code></td>
              <td>./data/yass.db</td>
              <td>SQLite database path</td>
            </tr>
            <tr>
              <td><code>JWT_SECRET</code></td>
              <td>random</td>
              <td>JWT signing secret</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Config File</h3>
      <p>Create a <code>yass.config.json</code> file:</p>
      <pre><code>{`{
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  },
  "database": {
    "path": "./data/yass.db"
  },
  "auth": {
    "jwtSecret": "your-secret-key",
    "sessionTimeout": "7d"
  },
  "sync": {
    "interval": 300,
    "maxRetries": 3
  }
}`}</code></pre>
    </section>

    <section id="sync-setup">
      <h2>Sync Setup</h2>
      
      <h3>Client Configuration</h3>
      <p>Configure your browser extension or mobile app:</p>
      <ol>
        <li>Open YASS settings</li>
        <li>Enter your server URL: <code>http://your-server:3000</code></li>
        <li>Generate an API key in the web interface</li>
        <li>Enter the API key in your client</li>
        <li>Enable synchronization</li>
      </ol>

      <h3>Browser Extension</h3>
      <p>Install the YASS browser extension:</p>
      <ul>
        <li><a href="/">Chrome Web Store</a></li>
        <li><a href="/">Firefox Add-ons</a></li>
        <li><a href="/">Safari App Store</a></li>
      </ul>

      <h3>Mobile Apps</h3>
      <p>Download the mobile apps:</p>
      <ul>
        <li><a href="/">iOS App Store</a></li>
        <li><a href="/">Google Play Store</a></li>
      </ul>
    </section>

    <section id="api-reference">
      <h2>API Reference</h2>
      
      <h3>Authentication</h3>
      <p>All API requests require an API key in the <code>Authorization</code> header:</p>
      <pre><code>Authorization: Bearer your-api-key</code></pre>

      <h3>Endpoints</h3>
      <div class="api-endpoints">
        <div class="endpoint">
          <h4>GET /api/bookmarks</h4>
          <p>Retrieve all bookmarks</p>
        </div>
        <div class="endpoint">
          <h4>POST /api/bookmarks</h4>
          <p>Create a new bookmark</p>
        </div>
        <div class="endpoint">
          <h4>PUT /api/bookmarks/:id</h4>
          <p>Update an existing bookmark</p>
        </div>
        <div class="endpoint">
          <h4>DELETE /api/bookmarks/:id</h4>
          <p>Delete a bookmark</p>
        </div>
        <div class="endpoint">
          <h4>POST /api/sync</h4>
          <p>Trigger synchronization</p>
        </div>
      </div>
    </section>

    <section id="troubleshooting">
      <h2>Troubleshooting</h2>
      
      <h3>Common Issues</h3>
      <div class="troubleshooting-list">
        <div class="issue">
          <h4>Server won't start</h4>
          <p><strong>Cause:</strong> Port already in use</p>
          <p><strong>Solution:</strong> Change port or kill existing process</p>
        </div>
        <div class="issue">
          <h4>Sync not working</h4>
          <p><strong>Cause:</strong> Incorrect API key or server URL</p>
          <p><strong>Solution:</strong> Verify configuration and network connectivity</p>
        </div>
        <div class="issue">
          <h4>Database errors</h4>
          <p><strong>Cause:</strong> Insufficient permissions or disk space</p>
          <p><strong>Solution:</strong> Check file permissions and available storage</p>
        </div>
      </div>

      <h3>Getting Help</h3>
      <ul>
        <li><a href="/">GitHub Issues</a></li>
        <li><a href="/">Discord Community</a></li>
        <li><a href="/">Documentation Wiki</a></li>
      </ul>
    </section>
  </main>
</div>

<style>
  .docs-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    gap: 2rem;
  }

  .sidebar {
    width: 250px;
    flex-shrink: 0;
  }

  .docs-nav h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .docs-nav ul {
    list-style: none;
    padding: 0;
  }

  .nav-link {
    display: block;
    padding: 0.5rem 0;
    color: #6b7280;
    text-decoration: none;
    border-left: 2px solid transparent;
    padding-left: 0.5rem;
  }

  .nav-link:hover {
    color: #1f2937;
    border-left-color: #1f2937;
  }

  .docs-content {
    flex: 1;
    max-width: 800px;
  }

  h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 2rem;
    color: #1f2937;
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h4 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    line-height: 1.6;
    color: #4b5563;
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
    color: #4b5563;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  code {
    background: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9rem;
  }

  pre code {
    background: none;
    padding: 0;
  }

  .config-table {
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #1f2937;
  }

  .api-endpoints {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .endpoint {
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }

  .troubleshooting-list {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .issue {
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }

  .issue h4 {
    color: #dc2626;
  }

  .issue p {
    margin: 0.25rem 0;
  }

  .issue p strong {
    color: #1f2937;
  }

  @media (max-width: 768px) {
    .docs-container {
      flex-direction: column;
      padding: 1rem;
    }

    .sidebar {
      width: 100%;
    }

    .docs-nav {
      display: flex;
      overflow-x: auto;
      gap: 1rem;
    }

    .docs-nav ul {
      display: flex;
      gap: 1rem;
    }
  }
</style>