import cdk = require('@aws-cdk/core');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import s3Deployment = require('@aws-cdk/aws-s3-deployment');

export interface StaticSiteStackProps extends cdk.StackProps {
  hostedZoneId: string,
  staticAssetsPath?: string,
}

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    /**
     * Get external resources
     */
    const hostedZone = route53.HostedZone.fromHostedZoneId(this, 'HostedZone', props.hostedZoneId);
    // TODO:
    // S3 bucket with public access, and HTTPS support
    // S3 deployment of build folder + .env file
    // Cloudfront distribution (eventually)
    // Route53 recordset
    const recordSetName = 'burger-time';
    // const siteName = `${recordSetName}.${hostedZone.zoneName}`;

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      bucketName: `${recordSetName}-static-content`
    });

    const staticAssetsPath = props.staticAssetsPath || '../build/';
    new s3Deployment.BucketDeployment(this, 'SiteDeployment', {
      destinationBucket: bucket,
      source: s3Deployment.Source.asset(staticAssetsPath),
    } as s3Deployment.BucketDeploymentProps);
  }
}
