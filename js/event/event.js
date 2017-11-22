var Event = function() {
    var event = new Vue({
        el: "#eventComponent",
        data: {
            eventList: new PaginableComponent({url: '/v1/mjwebapisrv/events'}),
            pageSize: "25",
            newEvent: {},
            toBeEditedEvent: {},
            isCreatingNewEvent: false
        },
        mounted: function() {
            this.eventList.gotoPage(1);
        },
        methods: {
            onPageSizeChange: function() {
                this.eventList.pagination.pageSize = Number(this.pageSize);
                this.eventList.reloadPage();
            },
            newEventModal: function() {
                $('#newEventModal').modal('show');
            },
            editEventModal: function(event) {
                this.toBeEditedEvent = Object.create(event);
                $('#editEventModal').modal('show');
            },
            createNewEvent: function() {
                var self = this;
                if(self.isCreatingNewEvent) {
                    return;
                }
                self.isCreatingNewEvent = true;

                var body = {
                    event_name: this.newEvent.eventName,
                    event_comment: this.newEvent.eventComment,
                    event_priority: Number(this.newEvent.eventPriority),
                    risk_score_low: Number(this.newEvent.riskScoreLow),
                    risk_score_high: Number(this.newEvent.riskScoreHigh)
                };
                App.network.post('/v1/mjwebapisrv/events', {
                    data: body
                }).then(function(response){
                    $('#newEventModal').modal('hide');
                    self.newEvent = {};
                    self.isCreatingNewEvent = false;

                    self.eventList.reloadPage();
                }).catch(function(response) {
                    //refine
                    alert('error');
                    self.isCreatingNewEvent = false;
                });
            }
        }
    });
};