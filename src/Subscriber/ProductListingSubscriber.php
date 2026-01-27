<?php declare(strict_types=1);

namespace BohemTheme\Subscriber;

use Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent;
use Shopware\Core\Content\Product\Events\ProductSearchCriteriaEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductListingSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            ProductListingCriteriaEvent::class => 'addMediaAssociations',
            ProductSearchCriteriaEvent::class => 'addMediaAssociations',
        ];
    }

    /**
     * @param object $event
     */
    public function addMediaAssociations(object $event): void
    {
        $criteria = $event->getCriteria();

        // Cover image
        $criteria->addAssociation('cover.media');

        // Gallery media
        $criteria->addAssociation('media.media');
    }
}
