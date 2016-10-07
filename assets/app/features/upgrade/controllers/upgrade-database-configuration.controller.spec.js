/*global bard $controller should $httpBackend */
describe('Upgrade Flow - Create Connect Database Controller', function () {
    // @ToDo Need to implement unit test, check below card
    // https://trello.com/c/w4ZiBPUh/30-3-16-create-connect-crowbar-db-ui-story-2-page-and-navigation
    var controller;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$q', '$httpBackend', '$rootScope');

        //Create the controller
        controller = $controller('UpgradeDatabaseConfigurationController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
    });

    it('should have an databaseForm model defined', function () {
        should.exist(controller.databaseForm);
    });

    it('should have empty "Username" field', function () {
        should.exist(controller.databaseForm.username);
        expect(controller.databaseForm.username).toEqual('');
    });

    it('should have empty "Password" field', function () {
        should.exist(controller.databaseForm.password);
        expect(controller.databaseForm.password).toEqual('');
    });

    it('should have empty "server" field', function () {
        should.exist(controller.databaseForm.server);
        expect(controller.databaseForm.server).toEqual('');
    });

    it('should have "port" field with default value 5432 ', function () {
        should.exist(controller.databaseForm.port);
        expect(controller.databaseForm.port).toEqual(5432);
    });

    it('should have empty "tablePrefix" field', function () {
        should.exist(controller.databaseForm.tablePrefix);
        expect(controller.databaseForm.tablePrefix).toEqual('');
    });
        
    it('should display "Username" field', function () {});

    it('username should be required field', function () {});

    it('username should not be lessThan 4 characters', function () {});

    it('username should not be greaterThan 250 characters', function () {});

    it('should display "Password" field', function () {});

    describe('Connect to Database tab is enabled', function () {

        it('should display "Server" field', function () {});

        it('should display "Port" field', function () {});

        it('should display "Table Prefix" field', function () {});

        it('should display "Test Connection" button', function () {});
    });

    describe('Create Database tab is enabled', function () {

        it('should hide "Server" field', function () {});

        it('should hide "Port" field', function () {});

        it('should hide "Table Prefix" field', function () {});

        it('should display "Create Database" button', function () {});

    });
});

