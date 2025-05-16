/**
 * CI/CD Pipeline Visualizer Tool
 * 
 * This script provides functionality for the interactive CI/CD Pipeline Visualizer tool.
 * It includes template loading, custom pipeline generation, download capabilities, and pipeline analysis.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Pipeline template loader
    document.querySelectorAll('.template-card button').forEach(button => {
        button.addEventListener('click', function() {
            const template = this.parentElement.dataset.template;
            loadTemplate(template);
        });
    });
    
    // Custom pipeline generator
    document.getElementById('pipeline-generator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        generateCustomPipeline();
    });
    
    // Pipeline analyzer
    document.getElementById('analyze-pipeline').addEventListener('click', function() {
        analyzePipeline();
    });
    
    // Pipeline download
    document.getElementById('download-pipeline').addEventListener('click', function() {
        downloadPipelineConfig();
    });
});

/**
 * Loads a predefined pipeline template into the editor
 */
function loadTemplate(templateName) {
    // Get the Excalidraw iframe
    const iframe = document.querySelector('.pipeline-visualizer iframe');
    
    // For actual template loading, we would:
    // 1. Load the YAML file
    // 2. Generate a diagram based on the YAML
    // 3. Pass it to the Excalidraw iframe
    
    // Predefined templates as fallback if fetch fails
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
    
    // Try multiple paths to find the template
    const paths = [
        `../assets/pipeline-templates/${templateName}.yml`,
        `/assets/pipeline-templates/${templateName}.yml`,
        `../../assets/pipeline-templates/${templateName}.yml`,
        `/java-learning/docs/assets/pipeline-templates/${templateName}.yml`
    ];
    
    let templateFound = false;
    let attemptCount = 0;
    
    function tryNextPath() {
        if (attemptCount >= paths.length) {
            // All attempts failed, use hardcoded template data
            console.log('Using hardcoded template data as fallback');
            const yamlContent = templateData[templateName];
            if (yamlContent) {
                showTemplateModal(templateName, yamlContent);
            } else {
                alert(`Template "${templateName}" not found in predefined templates!`);
            }
            return;
        }
        
        const path = paths[attemptCount];
        attemptCount++;
        
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                templateFound = true;
                return response.text();
            })
            .then(yamlContent => {
                // Create a modal to display the template
                showTemplateModal(templateName, yamlContent);
            })
            .catch(error => {
                console.error(`Error loading template from ${path}:`, error);
                tryNextPath();
            });
    }
    
    // Start trying paths
    tryNextPath();
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
    
    // Add modal styles if needed
    addModalStyles();
}

/**
 * Adds required modal styles if they don't exist
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
    
    // Generate YAML based on selections
    const yaml = generateYaml(projectType, buildTool, {
        unitTests,
        integrationTests,
        e2eTests,
        performanceTests
    }, deploymentTarget, cicdPlatform);
    
    // Update the generated pipeline section
    document.getElementById('generated-pipeline').classList.remove('hidden');
    document.querySelector('#generated-pipeline .pipeline-code code').textContent = yaml;
    
    // If available, generate a diagram representation
    generateDiagram(yaml);
}

/**
 * Generates YAML configuration based on user selections
 */
function generateYaml(projectType, buildTool, tests, deploymentTarget, cicdPlatform) {
    // Define platform-specific syntax
    const platformTemplates = {
        'github-actions': {
            header: `name: ${projectType} CI/CD Pipeline\n\non:\n  push:\n    branches: [ main, master, develop ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:`,
            buildJob: `  build:\n    runs-on: ubuntu-latest\n    \n    steps:\n    - uses: actions/checkout@v3`,
            javaSetup: (buildTool) => {
                const cacheType = buildTool === 'maven' ? 'maven' : 'gradle';
                return `    - name: Set up JDK 17\n      uses: actions/setup-java@v3\n      with:\n        java-version: '17'\n        distribution: 'temurin'\n        cache: ${cacheType}`;
            },
            buildStep: (buildTool) => {
                if (buildTool === 'maven') {
                    return `    - name: Build with Maven\n      run: mvn -B package --file pom.xml`;
                } else if (buildTool === 'gradle') {
                    return `    - name: Build with Gradle\n      run: ./gradlew build`;
                } else {
                    return `    - name: Build with Ant\n      run: ant build`;
                }
            },
            testSteps: (tests) => {
                let steps = '';
                if (tests.unitTests) {
                    steps += `    - name: Run unit tests\n      run: ${buildTool === 'maven' ? 'mvn test' : './gradlew test'}\n`;
                }
                if (tests.integrationTests) {
                    steps += `    - name: Run integration tests\n      run: ${buildTool === 'maven' ? 'mvn verify -DskipUnitTests' : './gradlew integrationTest'}\n`;
                }
                if (tests.e2eTests) {
                    steps += `    - name: Run end-to-end tests\n      run: ${buildTool === 'maven' ? 'mvn test -Pe2e' : './gradlew e2eTest'}\n`;
                }
                if (tests.performanceTests) {
                    steps += `    - name: Run performance tests\n      run: ${buildTool === 'maven' ? 'mvn gatling:test' : './gradlew performanceTest'}\n`;
                }
                return steps;
            },
            deploymentSteps: (target) => {
                if (target === 'kubernetes') {
                    return `  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'\n    \n    steps:\n    - uses: actions/checkout@v3\n    \n    - name: Set up kubectl\n      uses: azure/setup-kubectl@v3\n      \n    - name: Set Kubernetes context\n      uses: azure/k8s-set-context@v3\n      with:\n        kubeconfig: \${{ secrets.KUBE_CONFIG }}\n        \n    - name: Deploy to Kubernetes\n      run: |\n        kubectl apply -f k8s/deployment.yaml\n        kubectl apply -f k8s/service.yaml`;
                } else if (target === 'serverless') {
                    return `  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'\n    \n    steps:\n    - uses: actions/checkout@v3\n    \n    - name: Deploy to AWS Lambda\n      uses: serverless/github-action@v3.1\n      with:\n        args: deploy --stage prod`;
                } else if (target === 'vm') {
                    return `  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'\n    \n    steps:\n    - uses: actions/checkout@v3\n    \n    - name: Deploy to VMs\n      uses: appleboy/ssh-action@master\n      with:\n        host: \${{ secrets.HOST }}\n        username: \${{ secrets.USERNAME }}\n        key: \${{ secrets.SSH_KEY }}\n        script: |\n          cd /opt/app\n          ./deploy.sh`;
                } else if (target === 'paas') {
                    return `  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'\n    \n    steps:\n    - uses: actions/checkout@v3\n    \n    - name: Deploy to Heroku\n      uses: akhileshns/heroku-deploy@v3.12.14\n      with:\n        heroku_api_key: \${{ secrets.HEROKU_API_KEY }}\n        heroku_app_name: "my-app"\n        heroku_email: \${{ secrets.HEROKU_EMAIL }}`;
                }
            }
        },
        'jenkins': {
            // Jenkins pipeline format
            header: `pipeline {\n  agent any\n\n  stages {`,
            buildJob: `    stage('Build') {\n      steps {\n        checkout scm`,
            javaSetup: (buildTool) => {
                return `        tool 'jdk-17'`;
            },
            buildStep: (buildTool) => {
                if (buildTool === 'maven') {
                    return `        sh 'mvn -B package --file pom.xml'`;
                } else if (buildTool === 'gradle') {
                    return `        sh './gradlew build'`;
                } else {
                    return `        sh 'ant build'`;
                }
            },
            testSteps: (tests) => {
                let steps = '';
                if (tests.unitTests) {
                    steps += `    stage('Unit Tests') {\n      steps {\n        ${buildTool === 'maven' ? "sh 'mvn test'" : "sh './gradlew test'"}\n      }\n    }\n`;
                }
                if (tests.integrationTests) {
                    steps += `    stage('Integration Tests') {\n      steps {\n        ${buildTool === 'maven' ? "sh 'mvn verify -DskipUnitTests'" : "sh './gradlew integrationTest'"}\n      }\n    }\n`;
                }
                if (tests.e2eTests) {
                    steps += `    stage('End-to-End Tests') {\n      steps {\n        ${buildTool === 'maven' ? "sh 'mvn test -Pe2e'" : "sh './gradlew e2eTest'"}\n      }\n    }\n`;
                }
                if (tests.performanceTests) {
                    steps += `    stage('Performance Tests') {\n      steps {\n        ${buildTool === 'maven' ? "sh 'mvn gatling:test'" : "sh './gradlew performanceTest'"}\n      }\n    }\n`;
                }
                return steps;
            },
            deploymentSteps: (target) => {
                if (target === 'kubernetes') {
                    return `    stage('Deploy') {\n      when {\n        branch 'main'\n      }\n      steps {\n        sh 'kubectl apply -f k8s/deployment.yaml'\n        sh 'kubectl apply -f k8s/service.yaml'\n      }\n    }`;
                } else if (target === 'serverless') {
                    return `    stage('Deploy') {\n      when {\n        branch 'main'\n      }\n      steps {\n        sh 'serverless deploy --stage prod'\n      }\n    }`;
                } else if (target === 'vm') {
                    return `    stage('Deploy') {\n      when {\n        branch 'main'\n      }\n      steps {\n        sshagent(['deployment-key']) {\n          sh 'ssh user@host "cd /opt/app && ./deploy.sh"'\n        }\n      }\n    }`;
                } else if (target === 'paas') {
                    return `    stage('Deploy') {\n      when {\n        branch 'main'\n      }\n      steps {\n        sh 'heroku container:push web -a my-app'\n        sh 'heroku container:release web -a my-app'\n      }\n    }`;
                }
            },
            footer: `  }\n\n  post {\n    always {\n      junit '**/target/surefire-reports/TEST-*.xml'\n      archiveArtifacts artifacts: 'target/*.jar', fingerprint: true\n    }\n  }\n}`
        },
        // Add other platforms like GitLab CI and Azure DevOps
    };
    
    // Get the selected platform template
    const platformTemplate = platformTemplates[cicdPlatform];
    
    // Generate the YAML
    let yaml = platformTemplate.header + '\n';
    
    if (cicdPlatform === 'github-actions') {
        yaml += platformTemplate.buildJob + '\n';
        yaml += platformTemplate.javaSetup(buildTool) + '\n';
        yaml += platformTemplate.buildStep(buildTool) + '\n';
        yaml += platformTemplate.testSteps({unitTests, integrationTests, e2eTests, performanceTests});
        yaml += '  ' + '\n'; // End build job
        yaml += platformTemplate.deploymentSteps(deploymentTarget);
    } else if (cicdPlatform === 'jenkins') {
        yaml += platformTemplate.buildJob + '\n';
        yaml += platformTemplate.javaSetup(buildTool) + '\n';
        yaml += platformTemplate.buildStep(buildTool) + '\n';
        yaml += '      }\n    }\n'; // End build stage
        yaml += platformTemplate.testSteps({unitTests, integrationTests, e2eTests, performanceTests});
        yaml += platformTemplate.deploymentSteps(deploymentTarget) + '\n';
        yaml += platformTemplate.footer;
    }
    
    return yaml;
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
    const codeElement = document.querySelector('#generated-pipeline .pipeline-code code');
    if (codeElement) {
        const yaml = codeElement.textContent;
        
        // Get selected platform for filename
        let platform = 'github';
        document.querySelectorAll('input[name="platform"]').forEach(input => {
            if (input.checked) {
                platform = input.id.replace('-actions', '').replace('-ci', '');
            }
        });
        
        // Get project type for filename
        const projectType = document.getElementById('project-type').value;
        
        // Create filename
        const filename = `${projectType}-${platform}-pipeline.yml`;
        
        // Download the file
        downloadYamlFile(yaml, filename);
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
 * Analyze a pipeline configuration for best practices
 */
function analyzePipeline() {
    // Get the pipeline config from the textarea
    const config = document.getElementById('pipeline-config').value;
    
    if (!config.trim()) {
        alert('Please paste a pipeline configuration to analyze.');
        return;
    }
    
    // Analyze the pipeline for common issues and best practices
    const analysis = performPipelineAnalysis(config);
    
    // Display the analysis results
    document.getElementById('analysis-results').classList.remove('hidden');
    
    // Populate metrics summary
    const metricsSummary = document.querySelector('#analysis-results .metrics-summary');
    metricsSummary.innerHTML = `
        <h4>Pipeline Metrics</h4>
        <div class="metrics-grid">
            <div class="metric">
                <span class="metric-name">Overall Score</span>
                <span class="metric-value">${analysis.overallScore}/100</span>
            </div>
            <div class="metric">
                <span class="metric-name">Security Practices</span>
                <span class="metric-value">${analysis.securityScore}/100</span>
            </div>
            <div class="metric">
                <span class="metric-name">Efficiency</span>
                <span class="metric-value">${analysis.efficiencyScore}/100</span>
            </div>
            <div class="metric">
                <span class="metric-name">Maintainability</span>
                <span class="metric-value">${analysis.maintainabilityScore}/100</span>
            </div>
        </div>
    `;
    
    // Populate improvement suggestions
    const improvementSuggestions = document.querySelector('#analysis-results .improvement-suggestions');
    improvementSuggestions.innerHTML = '<h4>Improvement Suggestions</h4><ul>';
    
    analysis.suggestions.forEach(suggestion => {
        improvementSuggestions.innerHTML += `
            <li class="suggestion">
                <div class="suggestion-header">
                    <span class="suggestion-priority ${suggestion.priority}">${suggestion.priority}</span>
                    <span class="suggestion-title">${suggestion.title}</span>
                </div>
                <p class="suggestion-description">${suggestion.description}</p>
            </li>
        `;
    });
    
    improvementSuggestions.innerHTML += '</ul>';
    
    // Populate security checks
    const securityChecks = document.querySelector('#analysis-results .security-checks');
    securityChecks.innerHTML = '<h4>Security Checks</h4><ul>';
    
    analysis.securityChecks.forEach(check => {
        securityChecks.innerHTML += `
            <li class="security-check ${check.status.toLowerCase()}">
                <span class="check-icon"></span>
                <span class="check-name">${check.name}</span>
                <span class="check-status">${check.status}</span>
                <p class="check-description">${check.description}</p>
            </li>
        `;
    });
    
    securityChecks.innerHTML += '</ul>';
    
    // Add styles for the analysis results
    addAnalysisStyles();
}

/**
 * Add styles for the analysis results
 */
function addAnalysisStyles() {
    if (!document.getElementById('analysis-styles')) {
        const style = document.createElement('style');
        style.id = 'analysis-styles';
        style.textContent = `
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }
            .metric {
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;
                display: flex;
                flex-direction: column;
            }
            .metric-name {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .metric-value {
                font-size: 1.5rem;
                color: #3f51b5;
            }
            .suggestion {
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 10px;
            }
            .suggestion-header {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }
            .suggestion-priority {
                font-size: 0.8rem;
                padding: 3px 8px;
                border-radius: 4px;
                margin-right: 10px;
                text-transform: uppercase;
            }
            .suggestion-priority.high {
                background-color: #f44336;
                color: white;
            }
            .suggestion-priority.medium {
                background-color: #ff9800;
                color: white;
            }
            .suggestion-priority.low {
                background-color: #4caf50;
                color: white;
            }
            .suggestion-title {
                font-weight: bold;
            }
            .security-check {
                display: flex;
                align-items: center;
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 10px;
                flex-wrap: wrap;
            }
            .check-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 10px;
            }
            .security-check.pass .check-icon {
                background-color: #4caf50;
            }
            .security-check.fail .check-icon {
                background-color: #f44336;
            }
            .security-check.warning .check-icon {
                background-color: #ff9800;
            }
            .check-name {
                font-weight: bold;
                margin-right: 10px;
            }
            .check-status {
                font-size: 0.8rem;
                padding: 3px 8px;
                border-radius: 4px;
                margin-right: 10px;
                text-transform: uppercase;
            }
            .security-check.pass .check-status {
                background-color: #4caf50;
                color: white;
            }
            .security-check.fail .check-status {
                background-color: #f44336;
                color: white;
            }
            .security-check.warning .check-status {
                background-color: #ff9800;
                color: white;
            }
            .check-description {
                flex-basis: 100%;
                margin-top: 10px;
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