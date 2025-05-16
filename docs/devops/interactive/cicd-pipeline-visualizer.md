# CI/CD Pipeline Visualization Tool

This interactive tool helps you visualize and design CI/CD pipelines for Java applications.

## Pipeline Visualizer

<div class="pipeline-visualizer">
    <iframe src="https://excalidraw.com/" width="100%" height="600px" frameborder="0" allow="clipboard-write"></iframe>
</div>

!!! note "About the Embedded Tool"
    The embedded Excalidraw tool above allows you to create, save, and share pipeline diagrams. You can also use our pre-made templates below.

## Pre-made Pipeline Templates

Below are several pre-made CI/CD pipeline templates for common Java application scenarios. Click on any template to open it in the editor.

### Spring Boot Application Pipeline

<div class="template-card" data-template="spring-boot">
    <h3>Spring Boot Pipeline</h3>
    <p>A complete CI/CD pipeline for Spring Boot applications, including build, test, containerization, and deployment stages.</p>
    <ul>
        <li>Maven/Gradle build with caching</li>
        <li>Unit and integration testing</li>
        <li>Docker image building</li>
        <li>Deployment to Kubernetes</li>
    </ul>
    <button class="md-button md-button--primary">Open Template</button>
</div>

### Microservices Pipeline

<div class="template-card" data-template="microservices">
    <h3>Microservices Pipeline</h3>
    <p>A CI/CD pipeline designed for Java microservices architecture with service mesh integration.</p>
    <ul>
        <li>Parallel service builds</li>
        <li>Contract testing</li>
        <li>Canary deployments</li>
        <li>Service mesh configuration</li>
    </ul>
    <button class="md-button md-button--primary">Open Template</button>
</div>

### Android App Pipeline

<div class="template-card" data-template="android">
    <h3>Android App Pipeline</h3>
    <p>CI/CD pipeline for Android applications developed with Java/Kotlin.</p>
    <ul>
        <li>Android SDK builds</li>
        <li>Emulator testing</li>
        <li>UI testing</li>
        <li>Play Store delivery</li>
    </ul>
    <button class="md-button md-button--primary">Open Template</button>
</div>

### Enterprise Java Pipeline

<div class="template-card" data-template="enterprise">
    <h3>Enterprise Java Pipeline</h3>
    <p>A comprehensive pipeline for enterprise Java applications with advanced security scanning.</p>
    <ul>
        <li>Multi-module builds</li>
        <li>OWASP dependency checks</li>
        <li>SAST/DAST scanning</li>
        <li>Compliance verification</li>
    </ul>
    <button class="md-button md-button--primary">Open Template</button>
</div>

## Custom Pipeline Generator

Use our interactive form to generate a custom CI/CD pipeline based on your specific requirements.

<div class="pipeline-generator">
    <form id="pipeline-generator-form">
        <div class="form-group">
            <label for="project-type">Project Type:</label>
            <select id="project-type">
                <option value="spring-boot">Spring Boot</option>
                <option value="microservices">Microservices</option>
                <option value="jakarta-ee">Jakarta EE</option>
                <option value="android">Android</option>
                <option value="desktop">Desktop Java</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="build-tool">Build Tool:</label>
            <select id="build-tool">
                <option value="maven">Maven</option>
                <option value="gradle">Gradle</option>
                <option value="ant">Ant</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Testing Requirements:</label>
            <div class="checkbox-group">
                <input type="checkbox" id="unit-tests" checked>
                <label for="unit-tests">Unit Tests</label>
                
                <input type="checkbox" id="integration-tests" checked>
                <label for="integration-tests">Integration Tests</label>
                
                <input type="checkbox" id="e2e-tests">
                <label for="e2e-tests">End-to-End Tests</label>
                
                <input type="checkbox" id="performance-tests">
                <label for="performance-tests">Performance Tests</label>
            </div>
        </div>
        
        <div class="form-group">
            <label>Deployment Target:</label>
            <div class="radio-group">
                <input type="radio" name="deployment" id="kubernetes" checked>
                <label for="kubernetes">Kubernetes</label>
                
                <input type="radio" name="deployment" id="vm">
                <label for="vm">Virtual Machines</label>
                
                <input type="radio" name="deployment" id="serverless">
                <label for="serverless">Serverless</label>
                
                <input type="radio" name="deployment" id="paas">
                <label for="paas">PaaS</label>
            </div>
        </div>
        
        <div class="form-group">
            <label>CI/CD Platform:</label>
            <div class="radio-group">
                <input type="radio" name="platform" id="github-actions" checked>
                <label for="github-actions">GitHub Actions</label>
                
                <input type="radio" name="platform" id="jenkins">
                <label for="jenkins">Jenkins</label>
                
                <input type="radio" name="platform" id="gitlab-ci">
                <label for="gitlab-ci">GitLab CI</label>
                
                <input type="radio" name="platform" id="azure-devops">
                <label for="azure-devops">Azure DevOps</label>
            </div>
        </div>
        
        <button type="submit" class="md-button md-button--primary">Generate Pipeline</button>
    </form>
    
    <div id="generated-pipeline" class="hidden">
        <h3>Your Custom Pipeline</h3>
        <div class="pipeline-diagram"></div>
        <div class="pipeline-code">
            <pre><code class="yaml"></code></pre>
        </div>
        <button id="download-pipeline" class="md-button">Download Pipeline Configuration</button>
    </div>
</div>

## Pipeline Analyzer

Already have a CI/CD pipeline configuration? Paste it below to analyze it for best practices and improvement opportunities.

<div class="pipeline-analyzer">
    <textarea id="pipeline-config" placeholder="Paste your pipeline configuration here (YAML, Jenkinsfile, etc.)"></textarea>
    <button id="analyze-pipeline" class="md-button md-button--primary">Analyze Pipeline</button>
    
    <div id="analysis-results" class="hidden">
        <h3>Analysis Results</h3>
        <div class="metrics-summary"></div>
        <div class="improvement-suggestions"></div>
        <div class="security-checks"></div>
    </div>
</div>

## About This Tool

This CI/CD Pipeline Visualization Tool helps Java developers and DevOps engineers:

1. **Design pipelines** using an intuitive visual interface
2. **Learn best practices** through pre-made templates
3. **Generate configuration** for popular CI/CD platforms
4. **Analyze existing pipelines** for improvements

While the embedded tool provides basic functionality, we also offer a more advanced standalone version that includes:

- Integration with actual CI/CD platforms via API
- Real-time pipeline execution visualization
- Historical performance analytics
- Team collaboration features

[Visit Advanced Tool Site](https://example.com/advanced-cicd-tool){ .md-button .md-button--primary }

## Usage Instructions

### Creating a New Pipeline

1. Use the embedded Excalidraw tool or select a pre-made template
2. Customize the pipeline stages to match your requirements
3. Add or remove elements as needed
4. Export or download your pipeline configuration

### Analyzing Existing Pipelines

1. Paste your pipeline configuration in the analyzer
2. Click "Analyze Pipeline"
3. Review the suggestions and metrics
4. Apply recommended improvements to your configuration

## JavaScript Implementation

<script id="pipeline-visualizer-script">
// This specific ID helps ensure our script isn't replaced during navigation
(function() {
    // Flag to track if we've already initialized on this page
    let initialized = false;
    
    // Function to check if visualizer elements exist and need initialization
    function checkAndInitialize() {
        // Check if we're on the correct page by looking for specific elements
        const hasTemplateCards = document.querySelectorAll('.template-card').length > 0;
        const hasGenerator = document.getElementById('pipeline-generator-form');
        const hasAnalyzer = document.getElementById('analyze-pipeline');
        
        if ((hasTemplateCards || hasGenerator || hasAnalyzer) && !initialized) {
            console.log('CI/CD Pipeline Visualizer: Initializing from checkAndInitialize');
            initializePipelineVisualizer();
            initialized = true;
            return true;
        }
        return false;
    }
    
    // Main initialization function
    function initializePipelineVisualizer() {
        console.log('CI/CD Pipeline Visualizer: Running initialization');
        
        // Pipeline template loader
        document.querySelectorAll('.template-card button').forEach(button => {
            button.onclick = function() {
                const template = this.parentElement.dataset.template;
                loadTemplate(template);
                return false;
            };
        });
        
        // Custom pipeline generator
        const generatorForm = document.getElementById('pipeline-generator-form');
        if (generatorForm) {
            generatorForm.onsubmit = function(e) {
                e.preventDefault();
                generateCustomPipeline();
                return false;
            };
        }
        
        // Pipeline analyzer
        const analyzeBtn = document.getElementById('analyze-pipeline');
        if (analyzeBtn) {
            analyzeBtn.onclick = function() {
                analyzePipeline();
                return false;
            };
        }
        
        // Pipeline download
        const downloadBtn = document.getElementById('download-pipeline');
        if (downloadBtn) {
            downloadBtn.onclick = function() {
                downloadPipelineConfig();
                return false;
            };
        }
    }

    // Multiple ways to detect navigation/loading
    
    // 1. Standard DOM ready event
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(checkAndInitialize, 100);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(checkAndInitialize, 100);
        });
    }
    
    // 2. Set up MutationObserver to detect when our elements are added to the DOM
    const observer = new MutationObserver(function(mutations) {
        if (checkAndInitialize()) {
            // If we successfully initialized, no need to keep observing
            observer.disconnect();
        }
    });
    
    // Observe the entire document for child modifications
    observer.observe(document.documentElement, { 
        childList: true,
        subtree: true 
    });
    
    // 3. Material for MkDocs specific navigation event
    if (typeof window.navigation !== 'undefined') {
        window.navigation.addEventListener('navigate', function() {
            // Reset initialized flag when navigating
            initialized = false;
            setTimeout(checkAndInitialize, 200);
        });
    }
    
    // 4. More aggressive polling as a fallback
    setInterval(function() {
        // If we find any pipeline visualizer elements but we're not initialized, initialize
        const hasElements = document.querySelectorAll('.template-card, #pipeline-generator-form, #analyze-pipeline').length > 0;
        if (hasElements && !initialized) {
            initialized = false; // Force reinitialization
            checkAndInitialize();
        }
    }, 1000);
    
    // 5. Hash change event (sometimes used for navigation)
    window.addEventListener('hashchange', function() {
        initialized = false;
        setTimeout(checkAndInitialize, 200);
    });
    
    // 6. History API
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        initialized = false;
        setTimeout(checkAndInitialize, 200);
    };
})();

// Template data for each pipeline type
const templateData = {
    'spring-boot': `name: Spring Boot CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
    
    - name: Build with Maven
      run: mvn -B package --file pom.xml
    
    - name: Run unit tests
      run: mvn test
    
    - name: Run integration tests
      run: mvn verify -DskipUnitTests
    
    - name: Build Docker image
      run: |
        docker build -t my-spring-app:\${{ github.sha }} .
    
    - name: Login to DockerHub
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      uses: docker/login-action@v2
      with:
        username: \${{ secrets.DOCKER_USERNAME }}
        password: \${{ secrets.DOCKER_PASSWORD }}
    
    - name: Push Docker image
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        docker tag my-spring-app:\${{ github.sha }} username/my-spring-app:latest
        docker push username/my-spring-app:latest`,
    
    'microservices': `name: Java Microservices CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
    
    - name: Build with Maven
      run: mvn -B package --file pom.xml`,
    
    'android': `name: Android App CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'`,
    
    'enterprise': `name: Enterprise Java CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: OWASP Dependency Check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: 'Enterprise Java App'
        path: '.'
        format: 'HTML'
        out: 'reports'`
};

/**
 * Loads a predefined pipeline template and displays it in a modal
 */
function loadTemplate(templateName) {
    // Instead of fetching from a file, use the hardcoded template data
    const yamlContent = templateData[templateName];
    
    if (yamlContent) {
        // Show the template in a modal
        showTemplateModal(templateName, yamlContent);
    } else {
        alert(`Template "${templateName}" not found!`);
    }
}

/**
 * Displays a modal with the template content and options to use it
 */
function showTemplateModal(templateName, yamlContent) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'pipeline-template-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h3');
    title.textContent = `${templateName.charAt(0).toUpperCase() + templateName.slice(1)} Pipeline Template`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.textContent = '×';
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create body with code display
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'yaml';
    code.textContent = yamlContent;
    pre.appendChild(code);
    body.appendChild(pre);
    
    // Create footer with actions
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    const useTemplateBtn = document.createElement('button');
    useTemplateBtn.className = 'md-button md-button--primary';
    useTemplateBtn.textContent = 'Use This Template';
    useTemplateBtn.onclick = function() {
        // In a full implementation, this would load the template into the editor
        alert('Template would be loaded into the editor');
        document.body.removeChild(modal);
    };
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'md-button';
    downloadBtn.textContent = 'Download Template';
    downloadBtn.onclick = function() {
        downloadYamlFile(yamlContent, `${templateName}-pipeline.yml`);
        document.body.removeChild(modal);
    };
    
    footer.appendChild(useTemplateBtn);
    footer.appendChild(downloadBtn);
    
    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);
    
    // Add modal to document
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
}

/**
 * Adds required modal styles
 */
function addModalStyles() {
    if (!document.getElementById('pipeline-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'pipeline-modal-styles';
        style.textContent = `
            .pipeline-template-modal {
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background-color: #fff;
                border-radius: 4px;
                max-width: 80%;
                max-height: 80%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            .modal-header h3 {
                margin: 0;
            }
            .close-button {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .modal-body {
                padding: 15px;
                overflow: auto;
                flex-grow: 1;
            }
            .modal-body pre {
                margin: 0;
                overflow: auto;
                background-color: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
            }
            .modal-footer {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Generates a custom pipeline based on the form inputs
 */
function generateCustomPipeline() {
    // Get form values
    const projectType = document.getElementById('project-type').value;
    const buildTool = document.getElementById('build-tool').value;
    const unitTests = document.getElementById('unit-tests').checked;
    const integrationTests = document.getElementById('integration-tests').checked;
    const e2eTests = document.getElementById('e2e-tests').checked;
    const performanceTests = document.getElementById('performance-tests').checked;
    
    // Get deployment target
    let deploymentTarget = '';
    document.querySelectorAll('input[name="deployment"]').forEach(input => {
        if (input.checked) {
            deploymentTarget = input.id;
        }
    });
    
    // Get CI/CD platform
    let cicdPlatform = '';
    document.querySelectorAll('input[name="platform"]').forEach(input => {
        if (input.checked) {
            cicdPlatform = input.id;
        }
    });
    
    // Generate a simple YAML based on selections
    // In a full implementation, this would be more sophisticated
    const yaml = `# Generated ${projectType} pipeline for ${cicdPlatform}
name: ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: ${buildTool}
    
    - name: Build with ${buildTool}
      run: ${buildTool === 'maven' ? 'mvn -B package --file pom.xml' : (buildTool === 'gradle' ? './gradlew build' : 'ant build')}
    
${unitTests ? `    - name: Run unit tests
      run: ${buildTool === 'maven' ? 'mvn test' : (buildTool === 'gradle' ? './gradlew test' : 'ant test')}\n` : ''}
${integrationTests ? `    - name: Run integration tests
      run: ${buildTool === 'maven' ? 'mvn verify -DskipUnitTests' : (buildTool === 'gradle' ? './gradlew integrationTest' : 'ant integration-test')}\n` : ''}
${e2eTests ? `    - name: Run end-to-end tests
      run: ${buildTool === 'maven' ? 'mvn test -Pe2e' : (buildTool === 'gradle' ? './gradlew e2eTest' : 'ant e2e-test')}\n` : ''}
${performanceTests ? `    - name: Run performance tests
      run: ${buildTool === 'maven' ? 'mvn gatling:test' : (buildTool === 'gradle' ? './gradlew performanceTest' : 'ant performance-test')}\n` : ''}
${deploymentTarget === 'kubernetes' ? `  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: kubectl apply -f k8s/deployment.yaml
` : ''}`;
    
    // Update the generated pipeline section
    const generatedPipeline = document.getElementById('generated-pipeline');
    if (generatedPipeline) {
        generatedPipeline.classList.remove('hidden');
        const codeElement = document.querySelector('#generated-pipeline .pipeline-code code');
        if (codeElement) {
            codeElement.textContent = yaml;
        }
        
        // Generate a visual diagram
        generateDiagram(yaml);
    }
}

/**
 * Generate a visual diagram of the pipeline
 */
function generateDiagram(yaml) {
    // This creates a visual representation of the pipeline
    const diagramDiv = document.querySelector('#generated-pipeline .pipeline-diagram');
    if (diagramDiv) {
        // Parse the pipeline stages from the YAML
        const stages = [];
        
        // Add the build stage
        stages.push({ name: 'Build', steps: ['Checkout', 'Setup JDK', 'Compile'] });
        
        // Add testing stages based on the YAML content
        const testSteps = [];
        if (yaml.includes('unit tests') || yaml.includes('mvn test') || yaml.includes('./gradlew test')) {
            testSteps.push('Unit Tests');
        }
        if (yaml.includes('integration tests') || yaml.includes('verify -DskipUnitTests') || yaml.includes('integrationTest')) {
            testSteps.push('Integration Tests');
        }
        if (yaml.includes('e2e tests') || yaml.includes('-Pe2e') || yaml.includes('e2eTest')) {
            testSteps.push('E2E Tests');
        }
        if (yaml.includes('performance tests') || yaml.includes('gatling:test') || yaml.includes('performanceTest')) {
            testSteps.push('Performance Tests');
        }
        
        if (testSteps.length > 0) {
            stages.push({ name: 'Test', steps: testSteps });
        }
        
        // Add packaging/containerization stage if present
        if (yaml.includes('docker build') || yaml.includes('package') || yaml.includes('jar') || yaml.includes('war')) {
            stages.push({ name: 'Package', steps: ['Build Artifact', 'Create Container Image'] });
        }
        
        // Add deployment stage if present
        if (yaml.includes('deploy') || yaml.includes('kubernetes') || yaml.includes('kubectl') || 
            yaml.includes('heroku') || yaml.includes('serverless')) {
            const deploySteps = [];
            
            if (yaml.includes('kubernetes') || yaml.includes('kubectl')) {
                deploySteps.push('Deploy to Kubernetes');
            } else if (yaml.includes('heroku')) {
                deploySteps.push('Deploy to Heroku');
            } else if (yaml.includes('serverless')) {
                deploySteps.push('Deploy to Serverless');
            } else if (yaml.includes('vm')) {
                deploySteps.push('Deploy to VM');
            } else {
                deploySteps.push('Deploy to Target');
            }
            
            stages.push({ name: 'Deploy', steps: deploySteps });
        }
        
        // Create the flow diagram HTML
        let diagramHtml = '<div class="pipeline-flow-diagram">';
        
        // Add the stages
        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            
            // Start stage block
            diagramHtml += `<div class="pipeline-stage">
                <div class="stage-header">${stage.name}</div>
                <div class="stage-steps">`;
            
            // Add steps
            stage.steps.forEach(step => {
                diagramHtml += `<div class="stage-step">${step}</div>`;
            });
            
            // Close stage block
            diagramHtml += `</div></div>`;
            
            // Add arrow if not the last stage
            if (i < stages.length - 1) {
                diagramHtml += '<div class="pipeline-arrow">→</div>';
            }
        }
        
        // Close the diagram
        diagramHtml += '</div>';
        
        // Add the diagram to the page
        diagramDiv.innerHTML = diagramHtml;
        
        // Add the CSS for the diagram
        const style = document.createElement('style');
        style.textContent = `
            .pipeline-flow-diagram {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                margin: 20px 0;
                gap: 15px;
            }
            
            .pipeline-stage {
                border: 2px solid #3f51b5;
                border-radius: 8px;
                overflow: hidden;
                width: 180px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                background-color: white;
            }
            
            .stage-header {
                background-color: #3f51b5;
                color: white;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                font-size: 16px;
            }
            
            .pipeline-stage:nth-child(4n+1) {
                border-color: #3f51b5;
            }
            
            .pipeline-stage:nth-child(4n+1) .stage-header {
                background-color: #3f51b5;
            }
            
            .pipeline-stage:nth-child(4n+3) {
                border-color: #e91e63;
            }
            
            .pipeline-stage:nth-child(4n+3) .stage-header {
                background-color: #e91e63;
            }
            
            .pipeline-stage:nth-child(4n+5) {
                border-color: #009688;
            }
            
            .pipeline-stage:nth-child(4n+5) .stage-header {
                background-color: #009688;
            }
            
            .pipeline-stage:nth-child(4n+7) {
                border-color: #ff9800;
            }
            
            .pipeline-stage:nth-child(4n+7) .stage-header {
                background-color: #ff9800;
            }
            
            .stage-steps {
                padding: 10px;
            }
            
            .stage-step {
                padding: 8px;
                margin: 5px 0;
                background-color: #f5f5f5;
                border-radius: 4px;
                font-size: 14px;
                text-align: center;
            }
            
            .pipeline-arrow {
                font-size: 24px;
                color: #555;
                display: flex;
                align-items: center;
            }
            
            @media (max-width: 768px) {
                .pipeline-flow-diagram {
                    flex-direction: column;
                }
                
                .pipeline-arrow {
                    transform: rotate(90deg);
                    margin: 10px 0;
                }
                
                .pipeline-stage {
                    width: 100%;
                    max-width: 250px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Download the generated pipeline configuration
 */
function downloadPipelineConfig() {
    const code = document.querySelector('#generated-pipeline .pipeline-code code');
    if (code) {
        const yaml = code.textContent;
        downloadYamlFile(yaml, 'custom-pipeline.yml');
    }
}

/**
 * Utility function to download a YAML file
 */
function downloadYamlFile(yamlContent, filename) {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Analyze the pipeline configuration entered by the user
 */
function analyzePipeline() {
    const configInput = document.getElementById('pipeline-config');
    const analysisResults = document.getElementById('analysis-results');
    
    if (configInput && analysisResults) {
        const config = configInput.value.trim();
        
        if (config) {
            // Perform analysis
            const analysis = performPipelineAnalysis(config);
            
            // Display results
            analysisResults.classList.remove('hidden');
            
            // Update metrics summary
            const metricsSummary = document.querySelector('#analysis-results .metrics-summary');
            if (metricsSummary) {
                metricsSummary.innerHTML = `
                    <div class="metrics-container">
                        <div class="metric">
                            <div class="metric-title">Overall Score</div>
                            <div class="metric-score">${analysis.overallScore}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${analysis.overallScore}%;"></div>
                            </div>
                        </div>
                        <div class="metric">
                            <div class="metric-title">Security</div>
                            <div class="metric-score">${analysis.securityScore}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${analysis.securityScore}%;"></div>
                            </div>
                        </div>
                        <div class="metric">
                            <div class="metric-title">Efficiency</div>
                            <div class="metric-score">${analysis.efficiencyScore}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${analysis.efficiencyScore}%;"></div>
                            </div>
                        </div>
                        <div class="metric">
                            <div class="metric-title">Maintainability</div>
                            <div class="metric-score">${analysis.maintainabilityScore}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${analysis.maintainabilityScore}%;"></div>
                            </div>
                        </div>
                    </div>
                    <p><strong>Pipeline Type:</strong> ${analysis.platform}</p>
                `;
            }
            
            // Update improvement suggestions
            const improvementSuggestions = document.querySelector('#analysis-results .improvement-suggestions');
            if (improvementSuggestions) {
                let suggestionsHtml = '<h4>Improvement Suggestions</h4><ul>';
                analysis.suggestions.forEach(suggestion => {
                    suggestionsHtml += `<li>${suggestion}</li>`;
                });
                suggestionsHtml += '</ul>';
                improvementSuggestions.innerHTML = suggestionsHtml;
            }
            
            // Update security checks
            const securityChecks = document.querySelector('#analysis-results .security-checks');
            if (securityChecks) {
                let checksHtml = '<h4>Security Checks</h4><ul>';
                analysis.securityChecks.forEach(check => {
                    checksHtml += `<li class="${check.passed ? 'passed' : 'failed'}">${check.name}: ${check.message}</li>`;
                });
                checksHtml += '</ul>';
                securityChecks.innerHTML = checksHtml;
            }
            
            // Add styles for the analysis results
            addAnalysisStyles();
        } else {
            alert('Please enter a pipeline configuration to analyze.');
        }
    }
}

/**
 * Add styles for the analysis results
 */
function addAnalysisStyles() {
    if (!document.getElementById('analysis-styles')) {
        const style = document.createElement('style');
        style.id = 'analysis-styles';
        style.textContent = `
            .metrics-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 20px;
            }
            .metric {
                flex: 1;
                min-width: 200px;
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;
            }
            .metric-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .metric-score {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .metric-bar {
                height: 10px;
                background-color: #ddd;
                border-radius: 5px;
                overflow: hidden;
            }
            .metric-fill {
                height: 100%;
                background-color: #4caf50;
                border-radius: 5px;
            }
            .improvement-suggestions, .security-checks {
                margin-top: 20px;
            }
            .improvement-suggestions h4, .security-checks h4 {
                margin-bottom: 10px;
            }
            .improvement-suggestions ul, .security-checks ul {
                padding-left: 20px;
            }
            .security-checks .passed {
                color: #4caf50;
            }
            .security-checks .failed {
                color: #f44336;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Analyze pipeline configuration for best practices and issues
 */
function performPipelineAnalysis(config) {
    // Detect if it's GitHub Actions, Jenkins, GitLab CI, etc.
    let platform = 'unknown';
    if (config.includes('jobs:') && config.includes('runs-on:')) {
        platform = 'GitHub Actions';
    } else if (config.includes('pipeline {') && config.includes('agent')) {
        platform = 'Jenkins';
    } else if (config.includes('stages:') && config.includes('- script:')) {
        platform = 'GitLab CI';
    }
    
    // Check for various practices
    const hasCaching = config.includes('cache:') || config.includes('caching');
    const hasTests = config.includes('test') || config.includes('Test');
    const hasSecurity = config.includes('dependency-check') || 
                        config.includes('OWASP') || 
                        config.includes('snyk') || 
                        config.includes('security');
    const hasEnvironmentVariables = config.includes('env:') || 
                                   config.includes('environment') ||
                                   config.includes('variables:');
    const hasMultiStageDeployments = config.includes('staging') && config.includes('production');
    const hasDockerization = config.includes('docker') || config.includes('image:');
    
    // Security score (40% of total)
    const securityScore = hasSecurity ? 85 : 40;
    
    // Efficiency score (30% of total)
    let efficiencyScore = 50;
    if (hasCaching) efficiencyScore += 20;
    if (config.includes('matrix') || config.includes('parallel')) efficiencyScore += 15;
    efficiencyScore = Math.min(efficiencyScore, 100);
    
    // Maintainability score (30% of total)
    let maintainabilityScore = 60;
    if (hasEnvironmentVariables) maintainabilityScore += 20;
    if (config.includes('stages:') || config.includes('stages {')) maintainabilityScore += 10;
    maintainabilityScore = Math.min(maintainabilityScore, 100);
    
    // Overall score is weighted average
    const overallScore = Math.round((securityScore * 0.4) + (efficiencyScore * 0.3) + (maintainabilityScore * 0.3));
    
    // Generate improvement suggestions
    const suggestions = [];
    if (!hasCaching) {
        suggestions.push('Implement dependency caching to improve build speed');
    }
    if (!hasTests) {
        suggestions.push('Add automated tests to validate your code');
    }
    if (!hasSecurity) {
        suggestions.push('Integrate security scanning tools like OWASP dependency check');
    }
    if (!hasEnvironmentVariables) {
        suggestions.push('Use environment variables for configuration to improve maintainability');
    }
    if (!hasMultiStageDeployments) {
        suggestions.push('Consider implementing staged deployments (e.g., staging/production)');
    }
    if (!hasDockerization) {
        suggestions.push('Containerize your application for consistent environments');
    }
    
    // Generate security checks
    const securityChecks = [
        {
            name: 'Dependency Scanning',
            passed: hasSecurity,
            message: hasSecurity 
                ? 'Security scanning is implemented' 
                : 'No dependency scanning found'
        },
        {
            name: 'Secrets Management',
            passed: config.includes('secrets') || config.includes('vault'),
            message: config.includes('secrets') || config.includes('vault')
                ? 'Secrets management is implemented'
                : 'No secrets management found'
        },
        {
            name: 'Image Scanning',
            passed: config.includes('trivy') || config.includes('image scan'),
            message: config.includes('trivy') || config.includes('image scan')
                ? 'Container image scanning is implemented'
                : 'No container image scanning found'
        }
    ];
    
    return {
        platform,
        overallScore,
        securityScore,
        efficiencyScore,
        maintainabilityScore,
        suggestions,
        securityChecks
    };
}
</script>

<style>
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.checkbox-group, .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.pipeline-analyzer textarea {
    width: 100%;
    min-height: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    margin-bottom: 10px;
}

.template-card {
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
}

.template-card h3 {
    margin-top: 0;
}

.hidden {
    display: none;
}

.pipeline-code {
    margin-top: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: auto;
}

.pipeline-code pre {
    margin: 0;
    padding: 15px;
}

#download-pipeline {
    margin-top: 10px;
}
</style>
</rewritten_file>