import { Cmd } from './Cmd'

async function main() {
  const cli: Cmd = new Cmd()
  await cli.execute()
}

main().catch((e) => {console.log('error', e)})
