var RiskAudit = function() {
    var riskAudit = new Vue({
        el: "#riskAuditComponent",
        data: {
            filters: {
                type: 'false',
            },
            riskAuditList: new PaginableComponent({url: '/v1/mjwebapisrv/risks'}),
        },
        mounted: function() {
            var self = this;

            $('.selectpicker').selectpicker({
              size: 4,
              val: self.filters.type
            });

            self.riskAuditList.gotoPage(1, {
                filters: self.filters
            });
        },
        methods: {
        }
    });
};