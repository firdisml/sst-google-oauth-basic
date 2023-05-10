import { Api, Cognito, StackContext } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
  // Create Api
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
    },
    routes: {
      "GET /private": "packages/functions/src/private.handler",
      "GET /public": {
        function: "packages/functions/src/public.handler",
        authorizer: "none",
      },
    },
  });

  const auth = new Cognito(stack, "Auth", {
    identityPoolFederation: {
      google: {
        clientId:
          "85203977808-e3k1hb0dv8pf2e7pighn59li87atqus1.apps.googleusercontent.com",
      },
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });
}