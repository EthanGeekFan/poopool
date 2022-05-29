const { namey } = require("./name_generator");

async function testNamey() {
    const result = await namey.new();
    console.log(result[0]);
}

testNamey();