const { assert } = require('chai');

/* eslint-disable no-undef */
//import our Contract
const Crowdfunding = artifacts.require('Crowdfunding');

require('chai').use(require('chai-as-promised')).should();

// contract("Crowdfunding", (accounts) => { //old style
contract('Crowdfunding', ([deployer, secondAcc]) => {
  // revised style
  let crowdfunding;

  before(async () => {
    crowdfunding = await Crowdfunding.deployed();
  });
  // Test Deployment
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await crowdfunding.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await crowdfunding.name();
      assert.equal(name, 'Marketplace for crowd funding');
    });
  });
  // Test Project Creation
  describe('projects', async () => {
    let result;
    let projectCount;
    before(async () => {
      result = await crowdfunding.createProject(
        'Test Name',
        'Test Desc',
        '1622420104',
        web3.utils.toWei('1', 'Ether'),
        { from: deployer },
      );
      projectCount = await crowdfunding.projectCount();
    });

    it('creates projects', async () => {
      // SUCCESS TESTS
      assert.equal(projectCount, 1);
      const event = result.logs[0].args; // pull from result logs
      assert.equal(event.id.toNumber(), projectCount.toNumber(), 'id is correct');
      assert.equal(event.name, 'Test Name', 'Name is correct');
      assert.equal(event.desc, 'Test Desc', 'Description is correct');
      assert.equal(event.target, web3.utils.toWei('1', 'Ether'), 'Target is correct');
      assert.equal(event.endDate, '1622420104', 'Project Close Date is correct');
      assert.equal(event.exists, true, 'Project Status is true');
      assert.equal(event.balance, 0, 'Project Balance is set to 0');
      // assert.equal(event.owner, accounts[0], 'Owner is correct'); // old style
      assert.equal(event.owner, deployer, 'Owner is correct'); // revised style
      // Failure : Project should have name
      await crowdfunding.createProject(
        '',
        'Test Desc',
        '1622420104',
        web3.utils.toWei('1', 'Ether'),
        {
          from: deployer,
        },
      ).should.be.rejected;
      // Failure : Project should have target
      await crowdfunding.createProject('Test Name', 'Test Desc', '1622420104', 0, {
        from: deployer,
      }).should.be.rejected;
      // Failure : Project should have endDate
      await crowdfunding.createProject(
        'Test Name',
        'Test Desc',
        '',
        web3.utils.toWei('1', 'Ether'),
        { from: deployer },
      ).should.be.rejected;
    });

    it('lists projects', async () => {
      // SUCCESS TESTS
      const project = await crowdfunding.projects(projectCount);
      assert.equal(project.id.toNumber(), projectCount.toNumber(), 'id is correct');
      assert.equal(project.name, 'Test Name', 'Name is correct');
      assert.equal(project.desc, 'Test Desc', 'Description is correct');
      assert.equal(project.target, web3.utils.toWei('1', 'Ether'), 'Target is correct');
      assert.equal(project.endDate, '1622420104', 'Project Close Date is correct');
      assert.equal(project.exists, true, 'Project Status is true');
      assert.equal(project.balance, 0, 'Project Balance is set to 0');
      // FAILURE TESTS
    });

    it('fund project', async () => {
      // SUCCESS TESTS
      // Another User Funded the project
      const resultA = await crowdfunding.fundProject(projectCount, {
        from: secondAcc,
        value: web3.utils.toWei('1', 'Ether'),
      });
      const event = resultA.logs[0].args; // pull from result logs
      assert.equal(event.id.toNumber(), projectCount.toNumber(), 'id is correct');
      assert.equal(event.owner, deployer, 'Owner incorrect');
      assert.equal(event.amount, web3.utils.toWei('1', 'Ether'), 'Project Balance is set to 1');
      assert.equal(event.funder, secondAcc, 'Contributor is not incorrect');
      // FAILURE TESTS : Send 0 Ether
      await crowdfunding.fundProject(projectCount, {
        from: secondAcc,
        value: 0,
      }).should.be.rejected;
    });

    it('close project', async () => {
      // SUCCESS TESTS
      const resultB = await crowdfunding.closeProject(projectCount, {
        from: deployer,
      });
      const event = resultB.logs[0].args; // pull from result logs
      assert.equal(event.id.toNumber(), projectCount.toNumber(), 'id is correct');
      assert.equal(event.name, 'Test Name', 'Name is correct');
      // FAILURE TESTS : Tries to fund a project that doesnt exists. ie. Project must have valid ID
      await crowdfunding.fundProject(99, {
        from: secondAcc,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected;
    });
  });
});
