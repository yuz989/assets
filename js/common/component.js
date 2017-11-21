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
        selectedItemIndices: {},
    };
    this.items = [];

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

                setTimeout(function() {
                    self.status.isLoading = false;
                }, param.delay);

            },
            fail: function(response) {
                failCallback(response);

                setTimeout(function() {
                    self.status.isLoading = false;
                }, param.delay);
            }
        });

    };

    this.toggleSelectAll = function() {
        for(var i=0; i<this.items.length; ++i) {
            this.items[i]._selected = this.status.isAllSelected;
            if(this.status.isAllSelected) {
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
        this.gotoPage(this.pagination.page, param);
    };

    this.firstPage = function(param) {
        this.gotoPage(1, param);
    };

    this.lastPage = function(param) {
        this.gotoPage(-1, param);
    }

    this.previousPage = function(param) {
        if(this.pagination.page==1) return;

        this.gotoPage(this.pagination.page - 1, param);
    };

    this.nextPage = function(param) {
        if(this.pagination.page==this.pagination.totalPages) return;

        this.gotoPage(this.pagination.page + 1, param);
    };

    this.currentPageStartIndex = function() {
        return (this.pagination.page - 1) * this.pagination.pageSize + 1;
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

    this.search = function(param) {
        this.gotoPage(this.pagination.page, param.filters);
    };
};