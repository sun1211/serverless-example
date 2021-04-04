const _ = require("lodash");
const fetch = require("node-fetch");
const createMapper = require("map-factory");
const Router = require('cloudworker-router');
const router = new Router();
async function fetchData(tokenId) {
    try {
        var resp = await fetch('https://wax.api.atomicassets.io/atomicassets/v1/assets/' + `${tokenId}`);
        var repos = await resp.json();
        if (!repos.success || _.isEmpty(repos.data.data)) return repos;

        const mapper = createMapper();
        mapper
            .map("name")
            .to("name")
            .map("img")
            .to("image", (img) => {
                return 'ipfs://' + img;
            })
            .map("description")
            .to("description")
            .map()
            .removing(["name", "img", "description"])
            .to("attributes", (articles) => {
                let attributes = [];
                for (const [key, value] of Object.entries(articles)) {
                    let newAttributes = {
                        trait_type: key,
                        value: value,
                    };
                    attributes.push(newAttributes);
                }
                return attributes;
            });

        const actual = mapper.execute(repos.data.data);
        return actual;
    } catch (error) {
        console.log("error", error);
        throw error.message;
    }
}

addEventListener('fetch', event => {
    event.respondWith(router.resolve(event));
})

router.get('/assets/:asset_id', async (ctx) => {
    try {
        const data = await fetchData(ctx.params.asset_id)
        ctx.body = JSON.stringify(data);
        ctx.status = 200;
        ctx.header = { 'content-type': 'application/json' }
    } catch (error) {
        ctx.body = error.message;
        ctx.status = 500
        ctx.header = { 'content-type': 'application/json' }
    }
});

