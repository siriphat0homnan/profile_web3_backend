const express = require("express");
const serverless = require("serverless-http");
const Web3 = require("web3");
let cors = require("cors");
const app = express();
app.use(cors());
const router = express.Router();

const contractAddress = "0x164bb61E0F89b47EE6a945260424C26605973536";
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const abi = require("../abi/profile.json");
const contract = new web3.eth.Contract(abi, contractAddress);

router.get("/", (req, res) => {
    res.json({ status: "Ok" });
});

router.get("/profile", (req, res) => {
    let address = req.query.address;
    let userInfo = {};
    new Promise(async () => {
        try {
            userInfo = await contract.methods
                .profile(address)
                .call({ from: address });
            // education
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
            // console.log(userInfo);

            // CompanyExperience
            let companyExperienceCount = await contract.methods
                .getCompanyExperienceCount()
                .call({ from: address });
            let companyExperience = [];
            for (let index = 0; index < companyExperienceCount; index++) {
                companyExperience.push(
                    await contract.methods
                        .getCompanyExperience(index)
                        .call({ from: address })
                );
            }

            // freelanceExperience
            let freelanceExperienceCount = await contract.methods
                .getFreelanceExperienceCount()
                .call({ from: address });
            let freelanceExperience = [];
            for (let index = 0; index < freelanceExperienceCount; index++) {
                freelanceExperience.push(
                    await contract.methods
                        .getFreelanceExperience(index)
                        .call({ from: address })
                );
            }

            // set data
            userInfo.educationCount = educationCount;
            userInfo.education = education;
            userInfo.companyExperienceCount = companyExperienceCount;
            userInfo.companyExperience = companyExperience;
            userInfo.freelanceExperienceCount = freelanceExperienceCount;
            userInfo.freelanceExperience = freelanceExperience;
            res.send(userInfo);
        } catch (error) {
            res.send(error);
        }
    });
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
