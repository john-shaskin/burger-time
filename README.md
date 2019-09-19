# Burger Time!

This is a sample React app, created from Maximillian Schwarzmuller's Udemy course. From that course, it has been updated with CDK-based deployment infrastructure. This README briefly describes packaging and deployment of this React app. It should change, as I update the automation.

The app is built based on the `create-react-app` module, and has been ejected, to enable more full control.

## Local Dev Server

To run the app locally in dev mode, run

`npm start`

This will fire up the app on port 3000. Visit and test it by navigating to `http://localhost:3000` in your browser.

## Packaging

 To package the app for deployment:

 ```
 npm run build
 ```

 This will run webpack to prepare the app to be deployed as a SPA.

 ## Deployment

 I still need to hook up automation in the root-level path for deploying the CDK app, but for now you will need to navigate to the `infra` folder, which contains the CDK application.

 This deployment is based on AWS, as you would expect from using CDK. It deploys the React app as a static website using:

 * S3
 * CloudFront
 * Route53

 There is an option to configure this to exclude CloudFront. However there are currently a couple of problems with that.

 1. CloudFront gives us the ability to secure the website interaction with HTTPS. Using plain S3, the website is served up unencrypted.
 2. The Route53 integration to configure an alias for S3 in CDK is broken. So, you'd need to hack around that, and correctly configure the alias value to point to the S3 bucket's website fully qualified domain name OR manually fudge it via the console.

 Deploying:

 1. Ensure you have [configured AWS credentials](https://link-to-page-on-credentials-setup.amazon.com)
 2. Run the packaging scripts from the previous section, to ensure you have a new built package of website to deploy.
 3. Run

 ```
 cdk deploy
 ```
