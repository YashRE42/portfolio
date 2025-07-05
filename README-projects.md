# Reusable Project Items System

This system allows you to easily manage and display project items across your portfolio website using plain HTML, CSS, and JavaScript.

## How It Works

The project items are now dynamically generated from a JSON data file (`projects.json`). This makes it easy to:
- Add new projects without touching HTML or JavaScript
- Maintain consistent styling
- Reuse project components across different pages
- Filter and sort projects programmatically
- Edit project data in a simple JSON format
- Generate individual project detail pages automatically

### Individual Project Pages

Each project automatically gets its own detail page using the template system:
- URL format: `project-template.html?id=project-id`
- Content is dynamically loaded from the same JSON data
- Consistent styling and layout across all project pages
- No need to create separate HTML files for each project

## Adding a New Project

To add a new project, simply add an object to the array in `projects.json`:

### JSON Format

The `projects.json` file contains an array of project objects. Each project should follow this structure:

```javascript
{
  id: 'unique-project-id',
  title: 'Project Title',
  icon: 'fab fa-github', // FontAwesome icon class
  tags: ['Tag1', 'Tag2'], // Array of tags
  description: 'Short project description for projects list...',
  extendedDescription: 'Detailed project description for individual project pages...',
  link: 'project-page.html', // Link to detailed project page
  additionalContent: { // Optional additional content
    type: 'list', // or 'images'
    title: 'Additional content title',
    items: [ // For list type
      {
        text: 'Item text',
        link: 'https://example.com' // Optional link
      }
    ],
    images: [ // For images type
      {
        src: 'image1.png',
        alt: 'Image description'
      }
    ]
  },
  externalLinks: [ // Optional external links
    {
      text: 'View Project',
      link: 'https://example.com',
      target: '_blank'
    }
  ]
}
```

## Project Structure

Each project object can have these properties:

- **id**: Unique identifier for the project
- **title**: Project title (displayed as h3)
- **icon**: FontAwesome icon class (e.g., 'fab fa-github')
- **tags**: Array of tag strings
- **description**: Short project description (used in projects list)
- **extendedDescription**: Detailed project description (used in individual project pages)
- **link**: URL to the detailed project page
- **additionalContent**: Optional object for extra content
- **externalLinks**: Optional array of external links

### Description Fields

- **description**: Short summary used in the projects list page. Should be concise and engaging.
- **extendedDescription**: Detailed description used in individual project pages. Can include:
  - Technical details
  - Implementation challenges
  - Features and functionality
  - Technologies used
  - Project outcomes
  - Future improvements

### Additional Content Types

1. **List**: For displaying lists of links or items
2. **Images**: For displaying project screenshots

## Usage

The system automatically renders projects when the page loads. To manually render projects:

```javascript
renderProjects('.projects-list'); // Default selector
renderProjects('#custom-container'); // Custom selector
```

### URL Structure

- **Projects List**: `projects.html` - Shows all projects
- **Individual Project**: `project-template.html?id=project-id` - Shows specific project details

Example URLs:
- `project-template.html?id=zulip` - Zulip project details
- `project-template.html?id=shopify` - Shopify project details
- `project-template.html?id=fitness-calendar` - Fitness Calendar project details

## Benefits

- **Maintainable**: All project data in one place
- **Consistent**: Same styling and structure for all projects
- **Flexible**: Easy to add new content types
- **Reusable**: Can be used on multiple pages
- **No Framework**: Pure HTML/CSS/JS solution

## File Structure

- `projects.json` - Contains all project data in JSON format
- `projects-data.js` - Contains rendering functions and loads data from JSON
- `projects.html` - Main projects page (now uses dynamic rendering)
- `project-template.html` - Template for individual project detail pages
- `project-detail.js` - JavaScript for rendering individual project pages
- `main.js` - Initializes project rendering
- `style.css` & `contact.css` - Styling for project items and detail pages 