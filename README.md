# Udacity Cloud Developer Program #
## Capstone Project - Pic-N-Thought App utilizing Amazon AWS to support the backend ##
### Gordon Seeler ###
##### Date ####
Jun 18, 2020
#### Summary ####
The **Pic-N-Thought Application** is a personal diary application providing the ability of adding an image, providing text about it, and selecting a mood icon that expresses the feeling about the picture. The app uses AWS Lambda, API Gateway, IAM, DynamoDB, Cloudwatch services and Serverless Framework to assemble and configure the backend. The client is written in React Angular Express Node.js.

#### Description ####
The **Serverless Framework** open source deployment software is implemented within a Node.js Express application. It is Infrastructure Code (IaC) which builds all the functions, resources, and permissions in a cloud. In this application, **Amazon AWS** is the cloud supporting the backend. **Angular React** is the client UI hooked into the cloud endpoints. 

The **Pic-N-Thought** app employs the third party service **Auth0** as an Identity Provider. It authenticates, generates a signed token, and provides an accessible endpoint for dynamically capturing the certificate required by the backend **AWS API Gateway** for it's custom authenticator. This custom authenticator uses the "sig" from the token to determine which of the several certificates is needed to check the validity of the signed token. For authenticated tokens, a time limited policy is generated allowing the user to access the available API resources. 

The API resources are supported by **AWS Lambda Functions** written in Node.js. These functions share a common api module called **api/db_access.ts** to interface with **AWS DynamoDB**. Every function employs ASYNC/AWAIT and PROMISE. All data access with **DynamoDB** is performed with Query only. The Pic-N-Thought database table has a local secondary index which features fast access to the data without any table scans.

Data is secured for a given user only. Multiple users see their own Pic-N-Thoughts only.

Data validation is setup for creating a new Pic-N-Thought and updating an existing Pic-N-Thought. The data validation uses the **API Gateway Request Validation**. Anything except the expected data payload ("thought", "mood", and "createdDt") will produce a 400 Bad Request.


* * *

#### GitHub Repository ####
https://github.com/linden416/Pic-N-Thought_App.git

This is the source repository for my **Pic-N-Thought** application. 
The following directories are defined within the **Pic-N-Thought_App** root directory:
- **backend** `<-- All the Node.js Express code for building serverless Lambda functions in AWS. Also contains Serverless.yaml`
- **client** `<-- Angular React code configured to run on port 3000 of the local host. My settings updated in config.ts`
- **screenshots** `<-- Supporting screenshots of full functioning application`
- **Cloudwatch_Logs** `<-- Sample exported AWS Cloudwatch logs supporting Lambda functions`

The following Postman Collection file has been provided:
**Pic-N-Thought APIs.postman_collection.json**

#### Screenshots ####
- **DynamoDB** 
   DynamoDB_Table.png
   DynamoDB_Index.png

- **API Gateway**
   API_Gateway.png
   API_Gateway_Custom_Authorizer.png

- **Lambda Functions**
   Lambda_functions.png   

- **IAM Roles**
   IAM_Roles_per_LambdaFxn.png

- **S3 Bucket**
   S3_Bucket.png
   S3_Bucket_Contents.png

- **Cloudwatch Logs**
   Cloudwatch_Logs.png

- **Code Separation**
   Code_Separation.png

- **DB Query**
   DB_Query.png

- **API Gateway Request Validation Configured**
   Request_Validation_API_Gateway.png
   Postman_Invalid_Request.png

- **Working App**
   Splash_page.png
   Two_User_Sessions.png
   Setup_Second_User.png   <-- Second user starts fresh with no Pic-N-Thoughts
   Add_New.png  <-- Adding a new Pic-N-Thought item
   Home_after_Add_New.png  <-- Home page after the add
   Update_the_PnT.png    <-- Update the Pic-N-Thought
   Home_after_Updating_PnT.png  <-- Home page after the update
   Home_after_Delete.png   <-- Home page after delete

* * *

#### Config.ts ####
```
const apiId = 'xc5w3qglll'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-wmbxg6y0.auth0.com',  // Auth0 domain
  clientId: 'rciXaLEQgZMYVMsQ49WqCs0dsm1oX1OO',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```

* * *

#### Installation:
I have my backend API services up and running. My application was deployed to the US-EAST-1 N. Virginia region. I have updated the client config.ts in my git repository.

1) Clone repository locally https://github.com/linden416/Pic-N-Thought_App.git
2) cd to **client** directory
3) enter:  **npm run start**
4) open browser http://localhost:3000

Refer to the **./client/src/config.ts** to view the ApiId, backend endpoint, and the Auth0 domain and client Id 


## References
[Semantic UI React](https://react.semantic-ui.com/)
[React Communicate Between Components](https://react-cn.github.io/react/tips/communicate-between-components.html)
[Introducing JSX](https://reactjs.org/docs/introducing-jsx.html)
[React Rendering Elements](https://reactjs.org/docs/rendering-elements.html)
