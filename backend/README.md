This is a node server that handles tracking users' proficiency with practice words and schedules when they should practice every word. Just like Anki!

## uasge
- `npm install`
- start your mongo server (install it if you haven't)
- if you haven't populated mongodb with practice words, run "hardcode_practices.ts" to do so.
  - `ts-node hardcode_practices.ts`
- run `npm run dev` to start the server
