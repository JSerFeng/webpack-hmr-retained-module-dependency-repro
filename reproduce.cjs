const assert = require("node:assert/strict");
const { setup } = require("./harness.cjs");
const config = require("./webpack.config.cjs");
const control = process.argv.includes("--control");
const h = setup(config);

(async () => {
  try {
    await h.start();
    h.edit(1); await h.compile("drop entry's synchronous dep import");
    const detached = await h.update();
    assert.equal(detached.error, undefined);
    if (control) await app.other();
    h.edit(2); await h.compile("cached dep starts requiring n");
    const edited = await h.update();
    h.save({ control, detached, edited, expectedStatus: "idle" });
    assert.equal(edited.error, undefined, "The changed factory arrived, but its new dependency did not");
    assert.equal(edited.status, "idle");
  } finally { await h.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
