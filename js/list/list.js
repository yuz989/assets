var RiskList = function() {
    var tableSettings = {
        filters: {
            search_keyword: '',
            list_type: 'black'
        }
    }

    var Table = function(param) {
        this.newItem = {};
        this.name = param.name;
        this.url = param.url;
        this.widget = param.widget;
        this.list = new PaginableComponent({
            url: this.url
        });

        this.search = function() {
           if(this.searchKeyword != "") {
           }
        };

        this.gotoPage = function(page, param) {
            this.list.gotoPage(page, param);
        };

        this.reloadPage = function(param) {
            this.list.reloadPage({
                filters: tableSettings.filters,
                delay: 2000,
            });
        };

        this.addItemToList = function() {
            $(this.widget.addItemModal.name).modal('show');
        };

        this.saveNewItem = function() {
            var self = this;
            self.widget.addItemModal.saveButtonDisabled = true;

            App.network.post(self.url, {
                data: self.newItem
            }).then(function(response){
                self.lists.item.append(self.newItem);
                self.widget.addItemModal.saveButtonDisabled = false;
                $(self.widget.addItemModal.name).modal('hide');
                self.newItem = {};

            }).catch(function(response) {
                self.widget.addItemModal.saveButtonDisabled = false;
                $(self.widget.addItemModal.name).modal('hide');
            });
        };

        this.removeItemFromList = function() {
            $(this.widget.removeItemModal.name).modal('show');
        };

        this.deleteSelectedItems = function() {
            console.log(this.list.numSelectedItems());
        };

        this.setTableSettingsListType = function(listType) {
            tableSettings.filters.listType = listType;
            this.list.reloadPage({
                filters: tableSettings.filters
            });
        };

        this.getFilters = function() {
            return tableSettings.filters;
        };

    };

    var tables = {
        account: new Table({
            name: 'account',
            url: '/v1/mjwebapisrv/risklist/accounts',
            widget: {
                addItemModal: {
                    name: '#AddRiskAccountModal',
                    saveButtonDisabled: false
                },
                removeItemModal: {
                    name: '#RemoveRiskAccountModal',
                    saveButtonDisabled: false
                }
            }
        }),
        device: new Table({
            name: 'device',
            url: '/v1/mjwebapisrv/risklist/devices',
            widget: {
                addItemModal: {
                    name: '#AddRiskDeviceModal',
                    saveButtonDisabled: false
                },
                removeItemModal: {
                    name: '#RemoveRiskDeviceModal',
                    saveButtonDisabled: false
                }
            }
        }),
        ip: new Table({
            name: 'ip',
            url: '/v1/mjwebapisrv/risklist/ips',
            widget: {
                addItemModal: {
                    name: '#AddRiskIPModal',
                    saveButtonDisabled: false
                },
                removeItemModal: {
                    name: '#RemoveRiskIPModal',
                    saveButtonDisabled: false
                }
            }
        }),
    };

    var riskList = new Vue({
        el: "#riskListComponent",
        data: {
            riskListSummary: {},
            tableSettings: tableSettings,
            currentTable: tables.account,
            tables: tables,
        },
        created: function() {
            var self = this;
            App.network.fetch('/v1/mjwebapisrv/risklist/summary', {
                success: function(response) {
                    self.riskListSummary = response;
                }
            });
            self.currentTable.gotoPage(1, {
                filters: tableSettings.filters,
            });
        },
        methods: {
            displayRiskList: function(riskListName) {
                if(this.currentTable.list.isLoading()) { return; }
                this.currentTable = tables[riskListName];
                this.currentTable.gotoPage(1, {filters: this.tableSettings.filters, delay: 0});
            },
            setListType: function(listType) {
                if(this.currentTable.list.isLoading()) { return; }
                this.tableSettings.filters.list_type = listType;
                this.currentTable.gotoPage(this.currentTable.list.pagination.page, {filters: this.tableSettings.filters, delay: 0});
            }
        }
    });
};