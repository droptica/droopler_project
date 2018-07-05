<?php


namespace Drupal\d_application_api\EventSubscriber;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EventSubscriber implements EventSubscriberInterface {

  public function redirection(GetResponseEvent $event) {

    $host = \Drupal::request()->getHost();
    $current_path = \Drupal::service('path.current')->getPath();
    if ($current_path == '/user/login') {
      if ($host == "www.droptica.com" || $host == "droptica.com") {
        $response = new RedirectResponse('/', 301);
        $event->setResponse($response);
        $event->stopPropagation();
      }
    }
  }

  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = array('redirection');
    return $events;
  }

}
