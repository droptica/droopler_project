<?php

declare(strict_types=1);

namespace Drupal\ai_content_generator\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\NodeType;
use Drupal\field\Entity\FieldConfig;
use Drupal\ai\AiProviderInterface;
use Drupal\ai\OperationType\Chat\ChatInput;
use Drupal\ai\OperationType\Chat\ChatMessage;
use Drupal\ai\Plugin\ProviderProxy;
use Drupal\ai\Service\AiProviderFormHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;

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
   * The entity field manager.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * The entity type bundle info.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $entityTypeBundleInfo;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->aiProviderHelper = $container->get('ai.form_helper');
    $instance->providerManager = $container->get('ai.provider');
    $instance->entityTypeManager = $container->get('entity_type.manager');
    $instance->entityFieldManager = $container->get('entity_field.manager');
    $instance->entityTypeBundleInfo = $container->get('entity_type.bundle.info');
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
      '#ajax' => [
        'callback' => '::updateFieldOptions',
        'wrapper' => 'field-options-wrapper',
      ],
    ];

    $form['field_options_wrapper'] = [
      '#type' => 'container',
      '#attributes' => ['id' => 'field-options-wrapper'],
    ];

    $selected_content_type = $form_state->getValue('content_type');
    if ($selected_content_type) {
      $form['field_options_wrapper']['fields'] = $this->getFieldOptions($selected_content_type);
    }

    $form['topic'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Content Topic'),
      '#description' => $this->t('Enter the topic or theme for the content to be generated.'),
      '#required' => TRUE,
    ];

    $form['count'] = [
      '#type' => 'number',
      '#title' => $this->t('Number of content items to generate'),
      '#description' => $this->t('Enter the number of content items you want to generate.'),
      '#min' => 1,
      '#max' => 100,
      '#default_value' => 3,
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
   * Ajax callback to update field options.
   */
  public function updateFieldOptions(array &$form, FormStateInterface $form_state) {
    return $form['field_options_wrapper'];
  }

  /**
   * Get field options for a given content type.
   */
  private function getFieldOptions($content_type) {
    $fields = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Fields to generate'),
      '#options' => [],
      '#description' => $this->t('Select the fields you want to generate content for.'),
    ];

    $field_definitions = $this->entityFieldManager->getFieldDefinitions('node', $content_type);

    foreach ($field_definitions as $field_name => $field_definition) {
      if ($field_definition instanceof FieldConfig) {
        if ($field_definition->getType() == 'entity_reference_revisions' && $field_definition->getSetting('target_type') == 'paragraph') {
          $paragraph_bundles = $this->entityTypeBundleInfo->getBundleInfo('paragraph');
          $allowed_paragraph_types = $field_definition->getSetting('handler_settings')['target_bundles'];

          foreach ($allowed_paragraph_types as $paragraph_type) {
            $paragraph_fields = $this->entityFieldManager->getFieldDefinitions('paragraph', $paragraph_type);
            foreach ($paragraph_fields as $paragraph_field_name => $paragraph_field_definition) {
              if ($this->isTextualField($paragraph_field_definition)) {
                $fields['#options'][$field_name . '.' . $paragraph_type . '.' . $paragraph_field_name] = $field_definition->getLabel() . ' - ' . $paragraph_bundles[$paragraph_type]['label'] . ' - ' . $paragraph_field_definition->getLabel();
              }
            }
          }
        } elseif ($this->isTextualField($field_definition)) {
          $fields['#options'][$field_name] = $field_definition->getLabel();
        }
      }
    }

    return $fields;
  }

  /**
   * Check if a field is textual (i.e., can contain generated text).
   */
  private function isTextualField($field_definition) {
    $textual_field_types = ['text', 'text_long', 'text_with_summary', 'string', 'string_long'];
    return in_array($field_definition->getType(), $textual_field_types);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $provider = $this->aiProviderHelper->generateAiProviderFromFormSubmit($form, $form_state, 'chat', 'chat');
    $content_type = $form_state->getValue('content_type');
    $topic = $form_state->getValue('topic');
    $count = $form_state->getValue('count');
    $model = $form_state->getValue('chat_ai_model');
    $selected_fields = array_filter($form_state->getValue('fields'));

    $batch = [
      'title' => $this->t('Generating content with AI'),
      'operations' => [],
      'finished' => [$this, 'generateContentBatchFinished'],
    ];

    for ($i = 0; $i < $count; $i++) {
      $batch['operations'][] = [
        [$this, 'generateContentBatchOperation'],
        [
          $provider->getPluginId(),
          $provider->getConfiguration(),
          $content_type,
          $topic,
          $model,
          $selected_fields,
        ],
      ];
    }

    batch_set($batch);
  }

  /**
   * Batch operation to generate a single content item.
   */
  public function generateContentBatchOperation($provider_id, $provider_config, $content_type, $topic, $model, $selected_fields, &$context) {
    /** @var \Drupal\ai\AiProviderInterface $provider */
    $provider = $this->providerManager->createInstance($provider_id, $provider_config);

    $node_data = [
      'type' => $content_type,
      'title' => $this->generateTitle($provider, $topic, $model),
      'uid' => 1,
      'status' => 1,
    ];

    foreach ($selected_fields as $field_key) {
      $field_parts = explode('.', $field_key);
      if (count($field_parts) == 3) {
        // This is a paragraph field
        $paragraph_data = [
          'type' => $field_parts[1],
          $field_parts[2] => ['value' => $this->generateFieldContent($provider, $topic, $model, $field_key)],
        ];
        
        $paragraph = $this->entityTypeManager->getStorage('paragraph')->create($paragraph_data);
        $paragraph->save();

        $node_data[$field_parts[0]][] = [
          'target_id' => $paragraph->id(),
          'target_revision_id' => $paragraph->getRevisionId(),
        ];
      } else {
        // This is a regular node field
        $node_data[$field_key] = ['value' => $this->generateFieldContent($provider, $topic, $model, $field_key)];
      }
    }

    if ($this->createContent($node_data)) {
      $context['results']['generated'] = ($context['results']['generated'] ?? 0) + 1;
      $context['message'] = $this->t('Generated content item: @title', ['@title' => $node_data['title']]);
    } else {
      $context['results']['failed'] = ($context['results']['failed'] ?? 0) + 1;
      $context['message'] = $this->t('Failed to generate content item');
    }
  }

  /**
   * Generates content for a specific field.
   */
  private function generateFieldContent(AiProviderInterface|ProviderProxy $provider, string $topic, string $model, string $field_key): string {
    $field_parts = explode('.', $field_key);
    $field_name = end($field_parts);
    $prompt = "Generate 2 paragraphs of content for the field '$field_name' related to the topic: $topic. The content should be appropriate for the field type and context.";

    $input = new ChatInput([
      new ChatMessage('user', $prompt),
    ]);

    try {
      $response = $provider->chat($input, $model, ['ai_content_generator'])->getNormalized();
      return $response->getText();
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Error generating content for field @field: @error', ['@field' => $field_name, '@error' => $e->getMessage()]));
      return '';
    }
  }

  /**
   * Creates a new content item.
   */
  private function createContent(array $node_data): bool {
    try {
      $node = $this->entityTypeManager->getStorage('node')->create($node_data);
      $node->save();
      return true;
    }
    catch (\Exception $e) {
      $this->messenger()->addError($this->t('Error creating content: @error', ['@error' => $e->getMessage()]));
      return false;
    }
  }

  /**
   * Generates a title using AI.
   */
  private function generateTitle(AiProviderInterface|ProviderProxy $provider, string $topic, string $model): string {
    $prompt = "Generate a catchy, engaging and informative title for an article about: $topic. This need to be one simple sentence. Title should not exceeding 60 characters if possible.";

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

  /**
   * Batch finished callback.
   */
  public function generateContentBatchFinished($success, $results, $operations) {
    if ($success) {
      $generated = $results['generated'] ?? 0;
      $failed = $results['failed'] ?? 0;
      
      if ($generated > 0) {
        $this->messenger()->addStatus($this->formatPlural(
          $generated,
          'Successfully generated 1 content item.',
          'Successfully generated @count content items.'
        ));
      }
      
      if ($failed > 0) {
        $this->messenger()->addWarning($this->formatPlural(
          $failed,
          '1 content item failed to generate.',
          '@count content items failed to generate.'
        ));
      }
    }
    else {
      $this->messenger()->addError($this->t('An error occurred while generating content.'));
    }
  }

}
