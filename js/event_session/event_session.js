var EventSession = function() {
    var eventSession = new Vue({
        el: "#eventSessionComponent",
        data: {
            filters: {
                start_date: '',
                end_date: '',
                event_id: '0',
                event_session_code: ''
            },
            eventSessionList: new PaginableComponent({url: '/v1/mjwebapisrv/event_sessions'}),
            eventSummary: [],
            selectedEventSession: {}
        },
        mounted: function() {
            var self = this;
            $('.datepicker').datepicker();

            App.network.fetch('/v1/mjwebapisrv/event_summary', {
                success: function(response) {
                    self.eventSummary = response.items;
                    self.eventSessionList.gotoPage(1);
                }
            });
        },
        methods: {
            onSearchClick: function(page) {
                this.filters.start_date = $('#filter_start_date').val()
                this.filters.end_date = $('#filter_end_date').val()
                if(this.filters.event_session_code != '') {
                    this.filters.event_session_code_type = 'order';
                }
                eventSession.eventSessionList.gotoPage(page, {
                    filters: this.filters
                });
            },
            eventSessionDetailModal: function(eventSession) {
                this.selectedEventSession = Object.create(eventSession);
                $('#eventSessionDetailModal').modal('show');
            }
        }
    });
};