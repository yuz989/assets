var PaginableComponent = PaginableComponent || function(param) {
    param = param || {};
    this.url = param.url || '';
    this.pagination = {
        page: param.defaultPage || 1,
        pageSize: param.defaultPageSize || 32,
        total: 0,
        totalPages: 0
    };

    this.status = {
        isLoading: false,
        isAllSelected: false,
        selectedItemIndices: {}
    };
    this.items = [];

    this.setUrl = function(url) {
        this.url = url;
    };

    this.setPageSize = function(pageSize) {
        this.pagination.pageSize = pageSize;
    };

    this.gotoPage = function(page, param) {
        var self = this;
        var settings = {
            defaultDelay: 0
        };

        self.status.isLoading = true;

        param = param || {};
        param.delay = param.delay || settings.defaultDelay;

        var successCallback = param.success || function(d) {};
        var failCallback = param.fail || function(d) {};

        if( !param.url ) { param.url = self.url; }
        var requestUrl = param.url + '?page=' + page.toString() +
        '&page_size=' + self.pagination.pageSize.toString();

        if(param.filters) {
            $.each(param.filters, function(key, value) {
                if(value != '') {
                    requestUrl += '&' + key.toString() + '=' + value.toString();
                }
            });
        }

        App.network.fetch(requestUrl, {
            success: function(response) {
                self.pagination.page = response.page
                self.pagination.pageSize = response.page_size;
                self.pagination.total = response.total;
                self.pagination.totalPages = response.total_pages;
                self.items = response.items;
                successCallback(response);

                console.log(response);

                setTimeout(function() {
                    self._resetStatus();
                }, param.delay);

            },
            fail: function(response) {
                failCallback(response);

                setTimeout(function() {
                    self._resetStatus();
                }, param.delay);
            }
        });

    };

    this.toggleSelectAll = function() {
        var selection = this.status.isAllSelected;
        for(var i=0; i<this.items.length; ++i) {
            this.items[i]._selected = selection;
            if(selection) {
                this.status.selectedItemIndices[i] = true;
            } else {
                delete this.status.selectedItemIndices[i];
            }
        }
    };

    this.toggleSelectedItem = function(index) {
        if(this.items[index]._selected) {
            this.status.selectedItemIndices[index] = true;
        } else {
            delete this.status.selectedItemIndices[index];
            this.status.isAllSelected = false;
        }
    };


    this.selectSingleItem = function(index) {
        var self = this;
        if(self.items[index]._selected == false) {
            delete self.status.selectedItemIndices[index];
        } else {
            $.each(self.status.selectedItemIndices, function(k,v) {
                self.items[k]._selected = false;
                delete self.status.selectedItemIndices[k];
            });
            self.status.selectedItemIndices[index] = true;
        }
    };

    this.getSelectedSingleItem = function() {
        var selectedIndices = Object.keys(this.status.selectedItemIndices);
        if(selectedIndices.length > 0) {
            return this.items[selectedIndices[0]];
        } else {
            return {};
        }
    };

    this.hasItemSelected = function() {
        return Object.keys(this.status.selectedItemIndices).length > 0;
    };

    this.numSelectedItems = function() {
        return Object.keys(this.status.selectedItemIndices).length;
    };

    this.reloadPage = function(param) {
        if(this.isLoading()) {
            return;
        }
        param = param || {};
        param.delay = param.delay || 2000;

        this.gotoPage(this.pagination.page, param);
    };

    this.firstPage = function(param) {
        this.gotoPage(1, param);
    };

    this.lastPage = function(param) {
//        this.gotoPage(-1, param);
    }

    this.previousPage = function(param) {
        if(this.pagination.page==1) return;

        this.gotoPage(this.pagination.page - 1, param);
    };

    this.nextPage = function(param) {
        if(this.pagination.page==this.pagination.totalPages || this.pagination.totalPages == 0) return;
        this.gotoPage(this.pagination.page + 1, param);
    };

    this.currentPageStartIndex = function() {
        return (this.pagination.page - 1) * this.pagination.pageSize + (this.items.length == 0 ? 0 : 1);
    };

    this.currentPageEndIndex = function() {
        return (this.pagination.page - 1) * this.pagination.pageSize + this.items.length;
    };

    this.isLoading = function() {
        return this.status.isLoading;
    };

    this.total = function() {
        return this.pagination.total;
    };

    this.selectItem = function(index) {
        var self = this;
        if(this.items.length==0) return;
        if(index < this.items.length && index >= 0) {
            $.each(this.status.selectedItemIndices, function(k,v) {
                self.items[k]._selected = false;
            });
            self.items[index]._selected = true;
            self.status.selectedItemIndices = {};
            self.status.selectedItemIndices[index] = true;
        }
    };

    this.search = function(param) {
        this.gotoPage(this.pagination.page, param);
    };

    this._resetStatus = function() {
        this.status = {
            isLoading: false,
            isAllSelected: false,
            selectedItemIndices: {}
        };
    };

    this.removeSelectedItems = function(param) {
        var self = this;
    };
};