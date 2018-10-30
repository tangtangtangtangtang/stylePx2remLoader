import compiler from './compiler.js';
import fs from 'fs'
import path from 'path'
test('Inserts name and outputs JavaScript', async () => {
    const stats = await compiler('example.vue');
    const output = stats.toJson().modules[0].source;
    fs.writeFile(path.resolve('../des/des.vue'), output)
    // console.log(output)
    //   expect(output).toBe(`export default "Hey Alice!\\n"`);
});