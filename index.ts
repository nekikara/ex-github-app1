const fs = require('fs')
import { App } from "@octokit/app"
import { request } from "@octokit/request"
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const APP_ID = Number(process.env.APP_ID!)
  const owner = process.env.OWNER!
  const repo = process.env.REPO!
  const PEM = fs.readFileSync('private-key.pem', 'utf8');

  const app = new App({id: APP_ID, privateKey: PEM});
  const jwt = app.getSignedJsonWebToken();

  const installationOption =
  {
    owner,
    repo,
    headers: {
      authorization: `Bearer ${jwt}`,
      accept: "application/vnd.github.machine-man-preview+json",
    },
  }
  // @ts-ignore
  const { data } = await request("GET /repos/:owner/:repo/installation", installationOption);

  const installationId = data.id
  const installationAccessToken = await app.getInstallationAccessToken({
    installationId
  })

  const options = {
    owner,
    repo,
    headers: {
      authorization: `token ${installationAccessToken}`,
      accept: "application/vnd.github.machine-man-preview+json",
    },
    ref: 'deploy-event-test',
    task: 'deploy',
    auto_merge: false,
    environment: 'staging',
    payload: {
      deploy: 'test'
    }
  }
  // @ts-ignore
  const x = await request("POST /repos/:owner/:repo/deployments", options)
  console.log('result: ', x)
}

main().catch((e) => {console.log('error', e)})
