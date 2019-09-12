import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import StaticSite = require('../lib/static-site-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StaticSite.StaticSiteStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
