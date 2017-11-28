var RiskSessionHistory = function() {
    var riskSessionHistory = new Vue({
        el: "#riskSessionHistoryComponent",
        data: {
            riskOrders: new PaginableComponent({url: '/v1/mjwebapisrv/risk_orders'}),
        },
        mounted: function() {
        },
        methods: {
        }
    });
};