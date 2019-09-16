import cdk = require('@aws-cdk/core');
import acm = require('@aws-cdk/aws-certificatemanager');
import route53 = require('@aws-cdk/aws-route53');
import route53Targets = require('@aws-cdk/aws-route53-targets');
import s3 = require('@aws-cdk/aws-s3');
import s3Deployment = require('@aws-cdk/aws-s3-deployment');
import ssm = require('@aws-cdk/aws-ssm');

export interface StaticSiteStackProps extends cdk.StackProps {
  hostedZoneIdSsmPath: string,
  hostedZoneNameSsmPath: string,
  sslCertificateArnSsmPath: string,
  staticAssetsPath?: string,
}

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    /**
     * Get external resources
     */
    const hostedZoneId = ssm.StringParameter.fromStringParameterName(this, 'HostedZonePath', props.hostedZoneIdSsmPath).stringValue;
    const zoneName = ssm.StringParameter.fromStringParameterName(this, 'HostedZoneName', props.hostedZoneNameSsmPath).stringValue;
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName,
    });

    // const sslCertificateArn = ssm.StringParameter.fromStringParameterName(this, 'SslCertificateArn', props.sslCertificateArnSsmPath).stringValue;
    // acm.Certificate.fromCertificateArn(this, 'SslCertificate', sslCertificateArn);

    // TODO:
    // S3 bucket with public access, and HTTPS support
    // S3 deployment of build folder
    // Cloudfront distribution (eventually)
    // Route53 recordset

    const recordSetName = 'burger-time';
    // const siteName = `${recordSetName}.${hostedZone.zoneName}`;

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      bucketName: `${recordSetName}-static-content`,
    });

    const staticAssetsPath = props.staticAssetsPath || '../build/';
    new s3Deployment.BucketDeployment(this, 'SiteDeployment', {
      destinationBucket: bucket,
      source: s3Deployment.Source.asset(staticAssetsPath),
    } as s3Deployment.BucketDeploymentProps);

    new route53.ARecord(this, 'Route53Record', {
      recordName: recordSetName,
      target: route53.RecordTarget.fromAlias(new route53Targets.BucketWebsiteTarget(bucket)),
      zone: hostedZone,
    });
  }
}
