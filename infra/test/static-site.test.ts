import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import StaticSite = require('../lib/static-site-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StaticSite.StaticSiteStack(app, 'MyTestStack', {
      hostedZoneIdSsmPath: '/path/to/ssm/var/for/hosted-zone-id',
      hostedZoneNameSsmPath: '/path/to/ssm/var/for/hosted-zone-name',
      staticAssetsPath: './path/to/static/website',
      sslCertificateArnSsmPath: '/path/to/ssm/var/for/ssl-certificate-arn',
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
