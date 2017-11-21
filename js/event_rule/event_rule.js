var EventRule = function() {
    var eventRule = new Vue({
        el: "#eventRuleComponent",
        data: {
            event: new PaginableComponent({url: '/v1/mjwebapisrv/events'})
        },
        mounted: function() {
            this.eventList.gotoPage(1);
        },
        methods: {
        }
    });
};