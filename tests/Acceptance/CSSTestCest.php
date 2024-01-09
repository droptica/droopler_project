<?php

namespace Tests\Acceptance;

use Tests\Support\AcceptanceTester;

/**
 * @file
 * CSS test cest.
 */

/**
 * Class CSSTestCest
 */
class CSSTestCest
{
    /**
     * CSS themes test.
     *
     * @param AcceptanceTester $I
     */
    public function cssThemes(AcceptanceTester $I)
    {
        $I->wantTo('See css themes files');
        $I->amOnPage('/profiles/contrib/droopler/themes/custom/droopler_theme/build/css/main.style.css');
        $I->seeResponseCodeIs(200);
    }

    /**
     * CSS subtheme test.
     *
     * @param AcceptanceTester $I
     */
    public function cssSubtheme(AcceptanceTester $I)
    {
        $I->wantTo('See css subtheme files');
        $I->amOnPage('/themes/custom/droopler_subtheme/build/css/main.style.css');
        $I->seeResponseCodeIs(200);
    }
}
