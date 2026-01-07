<?php declare(strict_types=1);

namespace BohemTheme\Subscriber;

use Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductListingSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            ProductListingCriteriaEvent::class => 'onListingCriteria',
        ];
    }

    public function onListingCriteria(ProductListingCriteriaEvent $event): void
    {
        $criteria = $event->getCriteria();

        // Ensure cover is fully hydrated (ProductMediaEntity + nested MediaEntity)
        $criteria->addAssociation('cover.media');

        // Load gallery media (ProductMediaEntity collection) + nested MediaEntity
        $criteria->addAssociation('media.media');
    }
}
