<?php

declare(strict_types=1);

namespace Drupal\ai_content_generator\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\NodeType;
use Drupal\ai\AiProviderInterface;
use Drupal\ai\OperationType\Chat\ChatInput;
use Drupal\ai\OperationType\Chat\ChatMessage;
use Drupal\ai\Plugin\ProviderProxy;
use Drupal\ai\Service\AiProviderFormHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a form to generate content using AI.
 */
class ContentGenerationForm extends FormBase {

  /**
   * The AI LLM Provider Helper.
   *
   * @var \Drupal\ai\Service\AiProviderFormHelper
   */
  protected $aiProviderHelper;

  /**
   * The AI Provider.
   *
   * @var \Drupal\ai\AiProviderPluginManager
   */
  protected $providerManager;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->aiProviderHelper = $container->get('ai.form_helper');
    $instance->providerManager = $container->get('ai.provider');
    $instance->entityTypeManager = $container->get('entity_type.manager');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ai_content_generator_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['content_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Content Type'),
      '#options' => $this->getContentTypeOptions(),
      '#required' => TRUE,
    ];

    $form['topic'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Content Topic'),
      '#description' => $this->t('Enter the topic or theme for the content to be generated.'),
      '#required' => TRUE,
    ];

    // Load the LLM configurations.
    $this->aiProviderHelper->generateAiProvidersForm($form, $form_state, 'chat', 'chat', AiProviderFormHelper::FORM_CONFIGURATION_FULL);

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Generate Content'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $provider = $this->aiProviderHelper->generateAiProviderFromFormSubmit($form, $form_state, 'chat', 'chat');
    $content_type = $form_state->getValue('content_type');
    $topic = $form_state->getValue('topic');

    for ($i = 0; $i < 3; $i++) {
      $title = $this->generateTitle($provider, $topic, $form_state->getValue('chat_ai_model'));
      $this->createContent($content_type, $title);
    }

    $this->messenger()->addStatus($this->t('3 content items have been generated and published.'));
  }

  /**
   * Generates a title using AI.
   */
  private function generateTitle(AiProviderInterface|ProviderProxy $provider, string $topic, string $model): string {
    $prompt = "Generate a catchy and informative title for an article about: $topic. The title should be concise and engaging, not exceeding 60 characters if possible.";
    
    $input = new ChatInput([
      new ChatMessage('user', $prompt),
    ]);

    try {
      $response = $provider->chat($input, $model, ['ai_content_generator'])->getNormalized();
      return $response->getText();
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Error generating title: @error', ['@error' => $e->getMessage()]));
      return 'AI Generated Content';
    }
  }

  /**
   * Creates a new content item.
   */
  private function createContent(string $content_type, string $title) {
    $node = $this->entityTypeManager->getStorage('node')->create([
      'type' => $content_type,
      'title' => $title,
      'uid' => 1,
      'status' => 1,
    ]);

    $node->save();
  }

  /**
   * Gets the content type options for the form.
   */
  private function getContentTypeOptions(): array {
    $types = NodeType::loadMultiple();
    $options = [];
    foreach ($types as $type) {
      $options[$type->id()] = $type->label();
    }
    return $options;
  }

}
