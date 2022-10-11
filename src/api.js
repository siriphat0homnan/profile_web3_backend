const express = require("express");
const serverless = require("serverless-http");
const Web3 = require("web3");
let cors = require("cors");

const app = express();
app.use(cors());
const router = express.Router();

const contractAddress = "0xdc35c71939AD0c4914fE241839f8A1a80b820EE9";
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const abi = require("../abi/profile.json");
const contract = new web3.eth.Contract(abi, contractAddress);

router.get("/profile", (req, res) => {
    let address = req.query.address;
    let userInfo = {};
    new Promise(async () => {
        try {
            userInfo = await contract.methods
                .profile(address)
                .call({ from: address });
            let educationCount = await contract.methods
                .getEducationCount()
                .call({ from: address });
            let education = [];
            for (let index = 0; index < educationCount; index++) {
                education.push(
                    await contract.methods
                        .getEducation(index)
                        .call({ from: address })
                );
            }
            userInfo.educationCount = educationCount;
            userInfo.education = education;
            // set data

            res.send(userInfo);
        } catch (error) {
            res.send(error);
        }
    });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
