/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradePrechecksFactory $q $rootScope module $state */
describe('Upgrade Landing Controller', function() {
    var controller,
        passingChecks = {
            updates_installed: true,
            network_sanity: true,
            high_availability: true,
            free_node_available: true
        },
        failingChecks = {
            updates_installed: false,
            network_sanity: false,
            high_availability: false,
            free_node_available: false
        },
        partiallyFailingChecks = {
            updates_installed: true,
            network_sanity: true,
            high_availability: false,
            free_node_available: false
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        passingChecksResponse = {
            data: passingChecks
        },
        failingChecksResponse = {
            data: failingChecks
        },
        partiallyFailingChecksResponse = {
            data: partiallyFailingChecks
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', 'upgradePrechecksFactory', '$q', '$httpBackend');

        //Create the controller
        controller = $controller('UpgradeLandingController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('Begin Upgrade', function() {
        it('should have a beginUpgrade function defined', function() {
            should.exist(controller.beginUpgrade);
        });
    });

    describe('Prechecks object', function() {

        it('should exist', function() {
            should.exist(controller.prechecks);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.prechecks.completed);
        });

        it('is not valid by default', function() {
            assert.isFalse(controller.prechecks.valid);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.prechecks.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.prechecks.checks);
                _.forEach(controller.prechecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });

        describe('runPrechecks function', function() {

            it('is defined', function() {
                should.exist(controller.prechecks.runPrechecks);
            });

            describe('when checks pass successfully', function () {
                beforeEach(function () {
                    bard.mockService(upgradePrechecksFactory, {
                        getAll: $q.when(passingChecksResponse)
                    });
                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to true', function () {
                    assert.isTrue(controller.prechecks.valid);
                });

                it('should update checks values to true', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(controller.prechecks.checks, function(value) {
                        assert.isTrue(value.status);
                    });  
                });
            });

            describe('when checks fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradePrechecksFactory, {
                        getAll: $q.when(failingChecksResponse)
                    });
                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should update checks values to false', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(controller.prechecks.checks, function(value) {
                        assert.isFalse(value.status);
                    });  
                });
            });

            describe('when checks partially fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradePrechecksFactory, {
                        getAll: $q.when(partiallyFailingChecksResponse)
                    });
                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should update checks values to true or false as per the response', function () {
                    assert.isObject(controller.prechecks.checks);   
                    _.forEach(partiallyFailingChecksResponse.data, function(value, key) {
                        expect(controller.prechecks.checks[key].status).toEqual(value);
                    });
                });
            });

            describe('when service call fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradePrechecksFactory, {
                        getAll: $q.reject(failingResponse)
                    });
                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should expose the errors through vm.prechecks.errors object', function () {
                    expect(controller.prechecks.errors).toEqual(failingResponse.data.errors);
                });
            });
        });

    });
});

// Bardjs' appModule() cannot be used to test States and states transitions
// @see: https://github.com/wardbell/bardjs#dont-use-appmodule-when-testing-routes
describe('Upgrade Landing Controller - States', function () {
    var controller;
    // inject the services using Angular "underscore wrapping"
    beforeEach(function () {
        module('crowbarApp');
        bard.inject('$state', '$controller');

        spyOn($state, 'go');

        controller = $controller('UpgradeLandingController');

    });

    it('Begin Upgrade button should redirect the user to /backup when clicked', function() {
        controller.prechecks.completed = true;
        controller.prechecks.valid = true;

        controller.beginUpgrade();

        expect($state.go).toHaveBeenCalledWith('upgrade.backup');
    });

    it('should avoid any redirection if prechecks are not successfully validated', function() {
        controller.prechecks.completed = false;
        controller.prechecks.valid = false;

        controller.beginUpgrade();

        expect($state.go).not.toHaveBeenCalled();
    });
});
