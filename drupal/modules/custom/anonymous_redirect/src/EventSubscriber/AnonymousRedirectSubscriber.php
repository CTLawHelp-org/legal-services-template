<?php
/**
 * Created by PhpStorm.
 * User: adria
 * Date: 20/2/2016
 * Time: 1:22 PM
 */

namespace Drupal\anonymous_redirect\EventSubscriber;

use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class AnonymousRedirectSubscriber extends ControllerBase implements EventSubscriberInterface {


  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['redirectAnonymous'];
    return $events;
  }


  /**
   * Redirects anonymous users to the /user route
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   */
  public function redirectAnonymous(GetResponseEvent $event) {

    $config = $this->config('anonymous_redirect.settings');

    $redirectEnabled = $config->get('enable_redirect');
    $redirectUrl = $config->get('redirect_url');
    $currentPath = $event->getRequest()->getPathInfo();
    $currentUser = \Drupal::currentUser();
    $userRoles = $currentUser->getRoles();

    // do nothing is redirect_url is not enabled
    // do nothing is the user's role is not "anonymous"
    if (!$redirectEnabled || in_array('anonymous', $userRoles) == FALSE) {
      return;
    }

    if($this->isProtected($currentPath)) {
      // external redirect
      if ($this->containsHTTP($redirectUrl)) {
        $response = new TrustedRedirectResponse($redirectUrl);
        $response->send();
        return;
      }

      // Redirect the user to the front page
      if($this->isFrontPage($redirectUrl) && $currentPath !== Url::fromRoute("<front>")->toString()){
        $response = new RedirectResponse(Url::fromRoute("<front>")->toString());
        $response->send();
      }

      // redirect the user the configured route
      if ($this->isFrontPage($redirectUrl) == false && strpos($currentPath, $redirectUrl) === FALSE) {
        $response = new RedirectResponse($redirectUrl);
        $response->send();
        //$event->setResponse($response->send());
      }
    }
    else {
      return;
    }
  }


  /**
   * Returns true if the entered string contains 'http://'
   *
   * @param $urlString
   *
   * @return bool
   */
  public function containsHTTP($urlString) {

    if (strpos($urlString, 'http://') !== FALSE) {
      return TRUE;
    }

    return FALSE;
  }


  /**
   * Returns true if the entered string matches the route for the configured front page
   *
   * @param $urlString
   *
   * @return bool
   */
  public function isFrontPage($urlString){

    if($urlString == "<front>"){
      return true;
    }

    return false;
  }


  /**
   * Returns true if the entered string matches the protected routes
   *
   * @param $urlString
   *
   * @return bool
   */
  public function isProtected($urlString){

    if(dirname($urlString) == '/node' || dirname($urlString) == '/taxonomy/term'){
      return true;
    }

    return false;
  }
}
