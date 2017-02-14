var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var conf = require('../../configuration.json');
var expected = 200;

String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
    }
    return content;
};

//get all projects
getAllProjects = 'https://todo.ly/api/projects.json';
//Create New Project
createNewProject = 'https://todo.ly/api/projects.json';
//Get Project By Id
getProjectById = 'https://todo.ly/api/projects/{0}.json';
//Update Project By Id
updateProjectById = 'https://todo.ly/api/projects/{0}.json';
//Delete Project By Id
deleteProjectById = 'https://todo.ly/api/projects/{0}.json';

describe('- acceptance test of projects with before and after', function () {

    var body = '';
    var expected = 200;

    beforeEach(function (done) {
        this.timeout(10000);

        var projectJson = {
            Content: "testCreateTemporalProject",
            Icon: '4'
        };

        request
            .post(createNewProject)
            .proxy(conf.proxy)
            .auth(conf.user, conf.pass)
            .send(projectJson)
            .end(function (err, res) {
                body = res.body;
                expect(res.status).to.equal(expected);
                done();
            })
    })

    afterEach(function (done) {
        this.timeout(10000);
        request
            .del(deleteProjectById.format(body.Id))
            .proxy(conf.proxy)
            .auth(conf.user, conf.pass)
            .end(function (err, res) {
                body = res.body;
                expect(res.status).to.equal(expected);
                done();
            })
    })


    it('- update project by id', function (done) {
        this.timeout(10000);
        expected = 200;
        var projectModifyJson = {Content: "testXXX"};
        request
            .put(updateProjectById.format(body.Id))
            .proxy(conf.proxy)
            .auth(conf.user, conf.pass)
            .send(projectModifyJson)
            .end(function (err, res) {
                body = res.body;
                expect(projectModifyJson.Content).to.equal(body.Content);
                done();
            })
    })

})
describe('- acceptance test of projects without before and after', function () {

    var body = '';
    var expected = 200;

    it('create a new project', function (done) {
        this.timeout(5000);
        expected = 200;
        var projectJson = {
            Content: "testCreateProject1",
            Icon: '4'
        };
        request
            .post(createNewProject)
            .proxy(conf.proxy)
            .auth(conf.user, conf.pass)
            .send(projectJson)
            .end(function (err, res) {
                body = res.body;
                expect(projectJson.Content).to.equal(body.Content);
                request
                    .del(deleteProjectById.format(body.Id))
                    .proxy(conf.proxy)
                    .auth(conf.user, conf.pass)
                    .end(function (err, res) {
                        expect(expected).to.equal(res.status);
                        done();
                    })
            })
    })

    it('- delete project by id', function (done) {
        this.timeout(10000);
        expected = 200;
        var projectModifyJson = {Content: "test"};
        var projectJson = {
            Content: "testDeleteProject",
            Icon: '4'
        };
        request
            .post(createNewProject)
            .proxy(conf.proxy)
            .auth(conf.user, conf.pass)
            .send(projectJson)
            .end(function (err, res) {
                body = res.body;
                expect(res.status).to.equal(expected);
                request
                    .del(deleteProjectById.format(body.Id))
                    .proxy(conf.proxy)
                    .auth(conf.user, conf.pass)
                    .end(function (err, res) {
                        body = res.body;
                        expect(true).to.equal(body.Deleted);
                        done();
                    })
            })
    })

})