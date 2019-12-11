import cdk = require('@aws-cdk/core');
import acm = require('@aws-cdk/aws-certificatemanager');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import iam = require('@aws-cdk/aws-iam');
import route53 = require('@aws-cdk/aws-route53');
import route53Targets = require('@aws-cdk/aws-route53-targets');
import s3 = require('@aws-cdk/aws-s3');
import s3Deployment = require('@aws-cdk/aws-s3-deployment');
import ssm = require('@aws-cdk/aws-ssm');

export interface StaticSiteStackProps extends cdk.StackProps {
  hostedZoneIdSsmPath: string,
  hostedZoneNameSsmPath: string,
  sslCertificateArnSsmPath?: string,
  staticAssetsPath?: string,
  useCloudFrontDistribution?: boolean,
}

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const useCloudFrontDistribution = props.useCloudFrontDistribution || false;

    /**
     * Get external resources
     */
    const hostedZoneId = ssm.StringParameter.fromStringParameterName(this, 'HostedZonePath', props.hostedZoneIdSsmPath).stringValue;
    const zoneName = ssm.StringParameter.fromStringParameterName(this, 'HostedZoneName', props.hostedZoneNameSsmPath).stringValue;
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName,
    });

    let sslCertificate = null;
    if (useCloudFrontDistribution && props.sslCertificateArnSsmPath) {
      const sslCertificateArn = ssm.StringParameter.fromStringParameterName(this, 'SslCertificateArn', props.sslCertificateArnSsmPath).stringValue;
      sslCertificate = acm.Certificate.fromCertificateArn(this, 'SslCertificate', sslCertificateArn);
    }

    const recordSetName = 'burger-time';
    const siteName = `${recordSetName}.${hostedZone.zoneName}`;

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      publicReadAccess: !useCloudFrontDistribution,
      websiteIndexDocument: !useCloudFrontDistribution ? 'index.html' : undefined,
      bucketName: siteName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const staticAssetsPath = props.staticAssetsPath || '../build/';
    new s3Deployment.BucketDeployment(this, 'SiteDeployment', {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset(staticAssetsPath)],
    } as s3Deployment.BucketDeploymentProps);

    // Bucket target is totally broken...
    let target = route53.RecordTarget.fromAlias(new route53Targets.BucketWebsiteTarget(bucket));

    if (useCloudFrontDistribution) {
      let aliasConfiguration;
      if (sslCertificate) {
        aliasConfiguration = {
          acmCertRef: sslCertificate.certificateArn,
          names: [siteName],
        };
      }
      const originAccessIdentity = new cloudfront.CfnCloudFrontOriginAccessIdentity(this, 'OAI', {
        cloudFrontOriginAccessIdentityConfig: {
          comment: bucket.bucketName
        },
      });
      bucket.grantRead(new iam.CanonicalUserPrincipal(originAccessIdentity.attrS3CanonicalUserId));

      const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteWebDistribution', {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentityId: originAccessIdentity.ref,
            },
            behaviors: [ { isDefaultBehavior: true } ],
          },
        ],
        // Needed to ensure all paths return index.html
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html'
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html'
          }
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        viewerProtocolPolicy: sslCertificate != null ? cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS : cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
        aliasConfiguration,
      });
      target = route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution));
    }

    new route53.ARecord(this, 'Route53Record', {
      recordName: recordSetName,
      target: target,
      zone: hostedZone,
    });
  }
}
