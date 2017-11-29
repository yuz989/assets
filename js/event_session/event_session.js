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
            selectedEventSession: {
                riskCheckList: {}
            }
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
                eventSession.eventSessionList.search(page, {
                    filters: this.filters
                });
            },
            eventSessionDetailModal: function(eventSession) {
                var self = this;
                var url = '/v1/mjwebapisrv/event_sessions/' + eventSession.session_id.toString() + '/risk_check';
                App.network.get(url).then(function(response) {
                    self.selectedEventSession = eventSession;
                    if(response.data.result) {
                        self.selectedEventSession.riskCheckList = response.data.result;
                    } else {
                        self.selectedEventSession.riskCheckList = {};
                    }

                    console.log(self.selectedEventSession.riskCheckList);
                    $('#eventSessionDetailModal').modal('show');
                });
            }
        }
    });
};