var EventSession = function() {
    var eventSession = new Vue({
        el: "#eventSessionComponent",
        data: {
            filters: {
                start_date: '',
                end_date: '',
                event_id: '',
                session_data_id: '',
                event_id: '0'
            },
            eventSessionList: new PaginableComponent({url: '/v1/mjwebapisrv/event_sessions'}),
            eventSummary: []
        },
        mounted: function() {
            var self = this;
            $('.datepicker').datepicker();

            App.network.fetch('/v1/mjwebapisrv/event_summary', {
                success: function(response) {
                    self.eventSummary = response.items;
                    console.log(self.eventSummary);
                    self.eventSessionList.gotoPage(1);
                }
            });
        },
        methods: {
            onSearchClick: function() {
                this.filters.start_date = $('#filter_start_date').val()
                this.filters.end_date = $('#filter_end_date').val()

                eventSession.eventSessionList.gotoPage(1, {
                    filters: this.filters
                });
            }
        }
    });
};