<div class="get-started-container">
  <section class="hero">
    <h1>Get Started with YASS</h1>
    <p class="subtitle">Set up your self-hosted bookmark synchronization in minutes</p>
  </section>

  <div class="steps-container">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h2>Choose Your Installation Method</h2>
        <p>Select the installation method that works best for you:</p>
        <div class="options">
          <div class="option">
            <h3>🐳 Docker (Recommended)</h3>
            <p>Quick setup with containerization</p>
            <button class="btn btn-primary" on:click={() => selectMethod('docker')}>Choose Docker</button>
          </div>
          <div class="option">
            <h3>📦 npm</h3>
            <p>Install via package manager</p>
            <button class="btn btn-secondary" on:click={() => selectMethod('npm')}>Choose npm</button>
          </div>
          <div class="option">
            <h3>🔧 From Source</h3>
            <p>Build from source code</p>
            <button class="btn btn-secondary" on:click={() => selectMethod('source')}>Choose Source</button>
          </div>
        </div>
      </div>
    </div>

    {#if currentStep >= 2}
    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h2>Download & Install</h2>
        <div class="instruction-block">
          <h3>{selectedMethod === 'docker' ? 'Docker Commands' : selectedMethod === 'npm' ? 'npm Commands' : 'Build from Source'}</h3>
          <pre><code>{selectedMethod === 'docker' ? `docker pull yass/yass:latest
docker run -d \\
  --name yass \\
  -p 3000:3000 \\
  -v yass-data:/app/data \\
  yass/yass:latest` : selectedMethod === 'npm' ? `npm install -g yass
yass init
yass setup` : `git clone https://github.com/yourusername/yass.git
cd yass
npm install
npm run build`}</code></pre>
        </div>
        <button class="btn btn-primary" on:click={nextStep}>Next Step</button>
      </div>
    </div>
    {/if}

    {#if currentStep >= 3}
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h2>Configure Your Server</h2>
        <p>Set up your server configuration:</p>
        <form class="config-form">
          <div class="form-group">
            <label for="server-url">Server URL:</label>
            <input type="text" id="server-url" placeholder="http://localhost:3000" />
          </div>
          <div class="form-group">
            <label for="port">Port:</label>
            <input type="number" id="port" value="3000" />
          </div>
          <div class="form-group">
            <label for="data-path">Data Path:</label>
            <input type="text" id="data-path" value="./data" />
          </div>
          <button type="button" class="btn btn-primary" on:click={nextStep}>Next Step</button>
        </form>
      </div>
    </div>
    {/if}

    {#if currentStep >= 4}
    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <h2>Start Your Server</h2>
        <p>Launch your YASS server:</p>
        <div class="command-block">
          <pre><code>{selectedMethod === 'docker' ? 'docker logs yass' : selectedMethod === 'npm' ? 'yass start' : 'npm start'}</code></pre>
          <button class="btn btn-copy" on:click={copyCommand}>Copy</button>
        </div>
        <button class="btn btn-primary" on:click={nextStep}>Next Step</button>
      </div>
    </div>
    {/if}

    {#if currentStep >= 5}
    <div class="step">
      <div class="step-number">5</div>
      <div class="step-content">
        <h2>Set Up Client</h2>
        <p>Configure your browser extension or mobile app:</p>
        <div class="client-setup">
          <div class="client-option">
            <h3>🌐 Browser Extension</h3>
            <ol>
              <li>Install the YASS extension for your browser</li>
              <li>Open extension settings</li>
              <li>Enter your server URL</li>
              <li>Generate and enter API key</li>
            </ol>
          </div>
          <div class="client-option">
            <h3>📱 Mobile App</h3>
            <ol>
              <li>Download YASS app from app store</li>
              <li>Go to settings</li>
              <li>Configure server connection</li>
              <li>Enable synchronization</li>
            </ol>
          </div>
        </div>
        <button class="btn btn-success" on:click={completeSetup}>Complete Setup</button>
      </div>
    </div>
    {/if}

    {#if currentStep === 6}
    <div class="step">
      <div class="step-number">✓</div>
      <div class="step-content">
        <h2>Setup Complete!</h2>
        <p>🎉 Your YASS server is ready to use.</p>
        <div class="completion-actions">
          <a href="/docs" class="btn btn-primary">View Documentation</a>
          <a href="http://localhost:3000" class="btn btn-secondary" target="_blank">Open YASS</a>
        </div>
      </div>
    </div>
    {/if}
  </div>
</div>

<script lang="ts">
  let selectedMethod = '';
  let currentStep = 1;

  function selectMethod(method) {
    selectedMethod = method;
    showStep(2);
    updateInstallationInstructions();
  }

  function updateInstallationInstructions() {
    // Instructions will be updated via reactive bindings
  }

  function showStep(stepNumber) {
    currentStep = stepNumber;
  }

  function nextStep() {
    if (currentStep < 5) {
      currentStep++;
    }
  }

  function copyCommand() {
    const commandText = selectedMethod === 'docker' ? 'docker logs yass' : 
                       selectedMethod === 'npm' ? 'yass start' : 'npm start';
    navigator.clipboard.writeText(commandText);
  }

  function completeSetup() {
    currentStep = 6;
  }
</script>

<style>
  .get-started-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  .hero h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #6b7280;
  }

  .steps-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .step {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .step-number {
    width: 3rem;
    height: 3rem;
    background: #1f2937;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step-content h2 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .option {
    padding: 1.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    text-align: center;
  }

  .option h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .option p {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .instruction-block {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .instruction-block h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .config-form {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  .command-block {
    position: relative;
    background: #1f2937;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .command-block pre {
    color: #f9fafb;
    margin: 0;
    font-family: monospace;
  }

  .btn-copy {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #374151;
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .client-setup {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .client-option {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.375rem;
  }

  .client-option h3 {
    font-size: 1.125rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .client-option ol {
    margin: 0;
    padding-left: 1.25rem;
  }

  .client-option li {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.25rem;
  }

  .completion-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
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

  .btn-success {
    background: #059669;
    color: white;
  }

  .btn-success:hover {
    background: #047857;
  }

  @media (max-width: 768px) {
    .get-started-container {
      padding: 1rem;
    }

    .step {
      flex-direction: column;
      gap: 1rem;
    }

    .step-number {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1rem;
    }

    .options {
      grid-template-columns: 1fr;
    }

    .client-setup {
      grid-template-columns: 1fr;
    }

    .completion-actions {
      flex-direction: column;
    }
  }
</style>