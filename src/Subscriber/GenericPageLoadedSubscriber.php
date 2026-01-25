<?php declare(strict_types=1);

namespace BohemTheme\Subscriber;

use Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Storefront\Page\GenericPageLoadedEvent;
use Shopware\Storefront\Page\PageLoadedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class GenericPageLoadedSubscriber implements EventSubscriberInterface
{
    private EntityRepository $categoryRepository;

    public function __construct(EntityRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * @return string[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            GenericPageLoadedEvent::class => 'onGenericPageLoaded',
        ];
    }

    public function onGenericPageLoaded(GenericPageLoadedEvent $event): void
    {
        $criteria = new Criteria();
        $criteria->addFilter(
            new EqualsFilter('customFields.custom_fields_bohem_show_in_search_default', true)
        );
        $criteria->addFilter(
            new EqualsFilter('active', true)
        );
        $criteria->setLimit(6);
        $criteria->addAssociation('media');

        $categories = $this->categoryRepository->search(
            $criteria,
            $event->getContext()
        );
        $event->getPage()->addExtension(
            'bohemSearchDefaultCategories',
            $categories
        );
    }
}
