// Projects data - will be loaded from JSON file
let projectsData = [];

// Function to load projects data from JSON file
async function loadProjectsData() {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error('Error loading projects data:', error);
    // Fallback to empty array if JSON loading fails
    projectsData = [];
    return [];
  }
}

// Function to create a project item element
function createProjectItem(project) {
  const projectLink = document.createElement('a');
  // Use the template page with project ID as parameter
  projectLink.href = `project-template.html?id=${project.id}`;
  projectLink.className = 'project-item-link';

  const projectItem = document.createElement('div');
  projectItem.className = 'project-item';

  // Create header row
  const headerRow = document.createElement('div');
  headerRow.className = 'project-header-row';

  // Create icon
  const icon = document.createElement('div');
  icon.className = 'project-icon';
  icon.innerHTML = `<i class="${project.icon}"></i>`;

  // Create title
  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.title;

  // Create tags
  const tags = document.createElement('div');
  tags.className = 'project-tags';
  project.tags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'project-tag';
    tagSpan.textContent = tag;
    tags.appendChild(tagSpan);
  });

  // Assemble header row
  headerRow.appendChild(icon);
  headerRow.appendChild(title);
  headerRow.appendChild(tags);

  // Create description
  const description = document.createElement('p');
  description.textContent = project.description;

  // Assemble project item
  projectItem.appendChild(headerRow);
  projectItem.appendChild(description);

  projectLink.appendChild(projectItem);
  return projectLink;
}

// Function to render all projects
async function renderProjects(containerSelector = '.projects-list') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Load projects data if not already loaded
  if (projectsData.length === 0) {
    await loadProjectsData();
  }

  // Clear existing content
  container.innerHTML = '';

  // Add each project
  projectsData.forEach(project => {
    const projectElement = createProjectItem(project);
    container.appendChild(projectElement);
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectsData, createProjectItem, renderProjects };
}