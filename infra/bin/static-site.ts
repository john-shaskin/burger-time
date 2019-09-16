#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { StaticSiteStack } from '../lib/static-site-stack';

const app = new cdk.App();

const hostedZoneIdSsmPath = '/burger-time/hosted-zone-id';
const hostedZoneNameSsmPath = '/burger-time/hosted-zone-name';
const sslCertificateArnSsmPath = '/burger-time/ssl-certificate-arn';

new StaticSiteStack(app, 'BurgerTimeStaticSite', {
  hostedZoneIdSsmPath: hostedZoneIdSsmPath,
  hostedZoneNameSsmPath: hostedZoneNameSsmPath,
  sslCertificateArnSsmPath: sslCertificateArnSsmPath,
  env: {
    region: 'us-west-2',
  },
});
