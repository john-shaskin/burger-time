#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { StaticSiteStack } from '../lib/static-site-stack';

const app = new cdk.App();
new StaticSiteStack(app, 'InfraStack');
