## 3.1.0
Class DrooplerProductVariation has been removed, if you want to restore it for your project you can find it here:
https://github.com/droptica/droopler/tree/master/modules/custom/d_commerce/modules/d_commerce_product/src/Entity
And attach it in:
app/web/profiles/contrib/droopler/modules/custom/d_commerce/modules/d_commerce_product/d_commerce_product.module

with this hook:

function d_commerce_product_entity_type_build(array &$entity_types) {
  $entity_types['commerce_product_variation']->setClass('Drupal\d_commerce_product\Entity\DrooplerProductVariation');
}
