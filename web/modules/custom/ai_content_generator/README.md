# AI Content Generator

## Overview
AI Content Generator is a Drupal 10/11 module that allows administrators to automatically generate content using AI. It integrates with the AI module to leverage various AI providers for content generation.

## Features
- Bulk generation of content for selected content types
- Support for generating content in both regular fields and paragraph fields
- Customizable maximum length for each generated field
- Integration with multiple AI providers through the AI module
- Batch processing to handle large content generation tasks

## Installation
1. Install the module as you would any other Drupal module.
2. Ensure that the AI module and at least one AI provider module are installed and configured.

## Configuration
No additional configuration is required for this module. However, you need to have at least one AI provider configured in the AI module settings.

## Usage
1. Navigate to `/admin/content/ai-generate` (Content > Generate Content with AI).
2. Select the content type you want to generate.
3. Choose the fields you want to populate with AI-generated content.
4. Set the maximum length for each field.
5. Enter the topic or theme for the content.
6. Specify the number of content items to generate.
7. Select the AI provider and model to use.
8. Click "Generate Content" to start the process.

## Permissions
The module defines one permission:
- `administer ai content generator`: Allows access to the AI content generation form.

## How it works

1. User Interface:
  - The module provides a form at `/admin/content/ai-generate`.
  - Users can select a content type, choose fields to populate, and set maximum lengths for each field.
  - Multiple topics can be entered, separated by semicolons (;).
  - Users specify the number of content items to generate and select an AI provider and model.

2. Content Generation Process:
  - When the form is submitted, it creates a batch process for content generation.
  - Topics are cycled through if more content items are requested than topics provided.
  - For each content item:
    a. It generates a title using AI based on the current topic.
    b. It generates content for each selected field, respecting the specified maximum length.
    c. For paragraph fields, it creates new paragraph entities with generated content.
    d. It creates a new node with the generated title and field content.

3. AI Integration:
  - The module uses the AI module to interact with various AI providers.
  - For each field, including the title, a specific prompt is sent to the AI model.
  - The AI-generated content is then processed and trimmed to fit within the specified length limits.

4. Paragraph Handling:
  - The module can generate content for fields within paragraph entities.
  - It creates new paragraph entities for each content item and populates their fields as specified.

5. Batch Processing:
  - Content generation is done in a batch process to handle large numbers of items efficiently.
  - This prevents timeouts and provides progress feedback to the user.

6. Error Handling:
  - If content generation for a specific item fails, it's logged and the process continues with the next item.
  - After completion, a summary is displayed showing successful and failed generations.

7. Customization:
  - The module allows for easy customization of prompts sent to the AI model.
  - Field types that can be populated are configurable within the code.

This process allows for efficient, AI-driven bulk content generation while providing flexibility in terms of content structure and topics.

## File Structure
- `ai_content_generator.info.yml`: Module definition file.
- `ai_content_generator.routing.yml`: Defines the route for the content generation form.
- `ai_content_generator.permissions.yml`: Defines the module's permissions.
- `src/Form/ContentGenerationForm.php`: Contains the main form and logic for content generation.
- `tests/src/Functional/ContentGenerationFormTest.php`: Contains functional tests for the module.

## Dependencies
- Drupal Core (^10)
- AI module

## Customization
The module can be extended to support additional field types or to modify the content generation prompts. Refer to the `ContentGenerationForm` class for the main logic that can be customized.

## Troubleshooting
If you encounter issues with content generation, check the following:
1. Ensure that the AI module and at least one AI provider are properly configured.
2. Check Drupal logs for any error messages during the content generation process.
3. Verify that the selected content type and fields are compatible with the module.

## Contributing
Contributions to improve the module are welcome. Please submit issues and pull requests to the module's repository.

## License
This module is licensed under GPL-2.0+. See the LICENSE.txt file for details.
