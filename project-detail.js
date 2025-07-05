// Project detail page functionality
class ProjectDetailPage {
  constructor() {
    this.projectId = this.getProjectIdFromUrl();
    this.project = null;
  }

  // Extract project ID from URL parameters
  getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  // Load project data and render the page
  async initialize() {
    if (!this.projectId) {
      this.showError('No project ID specified');
      return;
    }

    try {
      // Load all projects data
      await loadProjectsData();
      
      // Find the specific project
      this.project = projectsData.find(p => p.id === this.projectId);
      
      if (!this.project) {
        this.showError(`Project with ID "${this.projectId}" not found`);
        return;
      }

      this.renderProject();
    } catch (error) {
      console.error('Error loading project:', error);
      this.showError('Failed to load project data');
    }
  }

  // Render the project details
  renderProject() {
    // Update page title
    document.getElementById('page-title').textContent = `${this.project.title} - Yash Rathore`;
    document.getElementById('project-title').textContent = this.project.title;
    document.getElementById('project-title-header').textContent = this.project.title;

    // Update project icon
    const iconElement = document.getElementById('project-icon');
    iconElement.innerHTML = `<i class="${this.project.icon}"></i>`;

    // Render tags
    this.renderTags();

    // Render description
    this.renderDescription();

    // Render additional content
    this.renderAdditionalContent();
    
    // Render external links
    this.renderExternalLinks();
  }

  // Render project tags
  renderTags() {
    const tagsContainer = document.getElementById('project-tags');
    tagsContainer.innerHTML = '';

    this.project.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'project-tag';
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });
  }

  // Render project description
  renderDescription() {
    const descriptionContainer = document.getElementById('project-description');
    
    // Use extended description if available, otherwise fall back to regular description
    const descriptionText = this.project.extendedDescription || this.project.description;
    
    // Split description by newlines and create paragraphs
    const paragraphs = descriptionText.split('\n').filter(p => p.trim());
    
    descriptionContainer.innerHTML = '';
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        const p = document.createElement('p');
        p.textContent = paragraph.trim();
        descriptionContainer.appendChild(p);
      }
    });

    // Render additional content (grouped images)
    if (this.project.additionalContent && this.project.additionalContent.type === 'images') {
      const additional = this.project.additionalContent;
      if (Array.isArray(additional.groups)) {
        additional.groups.forEach(group => {
          if (group.title) {
            const groupTitle = document.createElement('h3');
            groupTitle.textContent = group.title;
            descriptionContainer.appendChild(groupTitle);
          }
          const imageGrid = document.createElement('div');
          imageGrid.className = 'project-images';
          group.images.forEach(img => {
            const image = document.createElement('img');
            image.src = img.src;
            image.alt = img.alt;
            image.className = 'project-screenshot';
            imageGrid.appendChild(image);
          });
          descriptionContainer.appendChild(imageGrid);
        });
      } else if (Array.isArray(additional.images)) {
        // fallback: single group of images
        const imageGrid = document.createElement('div');
        imageGrid.className = 'project-images';
        additional.images.forEach(img => {
          const image = document.createElement('img');
          image.src = img.src;
          image.alt = img.alt;
          image.className = 'project-screenshot';
          imageGrid.appendChild(image);
        });
        descriptionContainer.appendChild(imageGrid);
      }
    }
  }

  // Render additional content (lists, images, etc.)
  renderAdditionalContent() {
    const additionalContainer = document.getElementById('project-additional-content');
    additionalContainer.innerHTML = '';

    if (!this.project.additionalContent) {
      return;
    }

    const { type, title, items, images } = this.project.additionalContent;

    // Add title
    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.textContent = title;
      additionalContainer.appendChild(titleElement);
    }

    // Render based on content type
    if (type === 'list' && items) {
      this.renderList(items, additionalContainer);
    } else if (type === 'images' && images) {
      this.renderImages(images, additionalContainer);
    }
  }

  // Render list items
  renderList(items, container) {
    const ul = document.createElement('ul');
    items.forEach(item => {
      const li = document.createElement('li');
      
      // Create status icon if status exists
      if (item.status) {
        const statusIcon = document.createElement('i');
        if (item.status === 'merged') {
          statusIcon.className = 'fas fa-check-circle';
          statusIcon.style.color = '#28a745';
        } else if (item.status === 'closed') {
          statusIcon.className = 'fas fa-check-circle';
          statusIcon.style.color = '#dc3545';
        } else if (item.status === 'open') {
          statusIcon.className = 'fas fa-circle';
          statusIcon.style.color = '#007bff';
        }
        statusIcon.style.marginRight = '8px';
        li.appendChild(statusIcon);
      }
      
      if (item.link) {
        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.text;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        li.appendChild(link);
      } else {
        li.textContent = item.text;
      }
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  // Render images
  renderImages(images, container) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-images';
    
    images.forEach(img => {
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.className = 'project-screenshot';
      imageContainer.appendChild(image);
    });
    
    container.appendChild(imageContainer);
  }

  // Render external links
  renderExternalLinks() {
    const navigationContainer = document.querySelector('.project-navigation');
    if (!navigationContainer || !this.project.externalLinks) {
      return;
    }

    // Add external links before the back button
    this.project.externalLinks.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.href = link.link;
      linkElement.textContent = link.text;
      linkElement.className = 'btn btn-primary';
      if (link.target) {
        linkElement.target = link.target;
        linkElement.rel = 'noopener noreferrer';
      }
      navigationContainer.insertBefore(linkElement, navigationContainer.firstChild);
    });
  }

  // Show error message
  showError(message) {
    const main = document.querySelector('main');
    main.innerHTML = `
      <section class="glass-section">
        <div class="glass-card">
          <h2>Error</h2>
          <p>${message}</p>
          <a href="projects.html" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Back to Projects
          </a>
        </div>
      </section>
    `;
  }
}

// Initialize the project detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const projectPage = new ProjectDetailPage();
  projectPage.initialize();
}); 