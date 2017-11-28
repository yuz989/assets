var RiskSessionHistory = function() {
    var riskSessionHistory = new Vue({
        el: "#riskSessionHistoryComponent",
        data: {
            riskOrders: new PaginableComponent({url: '/v1/mjwebapisrv/risk_orders'}),
            riskOrderDetail: {
                types: {
                    MJ: {},
                    KOUNT: {}
                }
            },
            filters: {
                start_time: '',
                end_time: '',
                order_id: ''
            }
        },
        mounted: function() {
            $('.datepicker').datepicker();
            this.riskOrders.gotoPage(1);
        },
        methods: {
            getRiskOrderFieldByDataType: function(riskOrder, dataType, fieldNames) {
                if(riskOrder.types[dataType]) {
                    return riskOrder.types[dataType][fieldNames] || '-';
                } else {
                    return '-';
                }
            },
            riskOrderDetailModal: function(riskOrder) {
                this.riskOrderDetail = riskOrder;
                $('#riskOrderDetailModal').modal('show');
            },
            searchRiskOrder: function(pageNumber) {
                this.filters.start_time = $('#filter_start_date').val();
                this.filters.end_time = $('#filter_end_date').val();
                this.riskOrders.gotoPage(pageNumber || 1, {
                    filters: this.filters
                });
            }
        }
    });
};