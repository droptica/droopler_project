<?php

namespace Drupal\Tests\ai_content_generator\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Test the content generation form.
 *
 * @group ai_content_generator
 */
class ContentGenerationFormTest extends BrowserTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  protected static $modules = ['ai_content_generator', 'node'];

  /**
   * A user with permission to generate content.
   *
   * @var \Drupal\user\UserInterface
   */
  protected $adminUser;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->adminUser = $this->drupalCreateUser(['administer ai content generator']);
  }

  /**
   * Tests that the content generation form is accessible.
   */
  public function testContentGenerationFormAccess() {
    $this->drupalLogin($this->adminUser);
    $this->drupalGet('admin/content/ai-generate');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->pageTextContains('Generate Content with AI');
  }

  // Add more test methods as needed...
}
