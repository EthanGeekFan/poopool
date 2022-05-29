const { namey } = require("./name_generator");

async function testNamey() {
    const result = (await namey.new())[0];
    console.log(result);
}

testNamey();