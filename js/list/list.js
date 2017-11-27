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

        this.transformEditedItemToRequestBody = param.transformEditedItemToRequestBody || function(item) {return item;}

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
                self.list.reloadPage({filters: tableSettings.filters, delay: 0});
                self.widget.addItemModal.saveButtonDisabled = false;
                riskList.riskListSummary[riskList.currentTable.name] += 1;
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
            var self = this;
            var listIds = [];

            self.list.status.isLoading = true;
            $.each(self.list.items, function(k,v) {
                if(v._selected == true) {
                    listIds.push(v.list_id);
                }
            });
            App.network.delete(self.list.url, {
                data: {
                    list_ids: listIds
                }
            }).then(function(response) {
                self.list.status.isLoading = false;
                self.list.reloadPage({filters: tableSettings.filters, delay: 0});
                $(self.widget.removeItemModal.name).modal('hide');
                riskList.riskListSummary[riskList.currentTable.name] -= 1;
            }).catch(function(response) {
                $(self.widget.removeItemModal.name).modal('hide');
                self.list.status.isLoading = false;
            });
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

        this.saveEditedItem = function(item) {
            var self = this;
            var url = this.url + '/' + item.list_id.toString();
            var data  = this.transformEditedItemToRequestBody(item);
            return App.network.put(url, {
                data: data
            }) .then(function(){
                self.list.reloadPage({filters: tableSettings.filters, delay: 0});
                $('#editListModal').modal('hide');
            });
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
            },
            transformEditedItemToRequestBody: function(item) {
                var body = {
                    list_type: item.list_type,
                    account_id: parseInt(item.account_id),
                    account_type: item.account_type,
                    list_comment: item.list_comment
                }
                return body;
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
            },
            transformEditedItemToRequestBody: function(item) {
                var body = {
                    list_type: item.list_type,
                    device_type: item.device_type,
                    device_id: item.device_id,
                    list_comment: item.list_comment
                }
                return body;
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
            },
           transformEditedItemToRequestBody: function(item) {
                var body = {
                    list_type: item.list_type,
                    ip: item.ip,
                    list_comment: item.list_comment
                }
                return body;
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
            editedItemTableName: "",
            editedItem: {}
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
            },
            editListModal: function(item) {
                this.editedItem = Object.create(item);
                $('#editListModal').modal('show');
            },
            editListModalSave: function() {
                this.currentTable.saveEditedItem(this.editedItem);
            }
        }
    });
};