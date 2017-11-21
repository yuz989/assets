var Event = function() {
    var event = new Vue({
        el: "#eventComponent",
        data: {
            eventList: new PaginableComponent({url: '/v1/mjwebapisrv/events'}),
            pageSize: "25"
        },
        mounted: function() {
            this.eventList.gotoPage(1);
        },
        methods: {
            onPageSizeChange: function() {
                this.eventList.pagination.pageSize = Number(this.pageSize);
                this.eventList.reloadPage();
            }
        }
    });
};