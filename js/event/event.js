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
                this.toBeEditedEvent.isBusy = false;
                $('#editEventModal').modal('show');
            },
            editEventModalSave: function() {
                var self = this;
                var body = {
                    event_group: self.toBeEditedEvent.event_group,
                    event_name: self.toBeEditedEvent.event_name,
                    event_comment: self.toBeEditedEvent.event_comment,
                    event_priority: Number(self.toBeEditedEvent.event_priority),
                    risk_score_low: Number(self.toBeEditedEvent.risk_score_low),
                    risk_score_high: Number(self.toBeEditedEvent.risk_score_high)
                };

                App.network.put('/v1/mjwebapisrv/events/' + self.toBeEditedEvent.event_id , {
                    data: body
                }).then(function(response){
                    self.eventList.reloadPage();
                    $('#editEventModal').modal('hide');
                });
            },
            createNewEvent: function() {
                var self = this;
                if(self.isCreatingNewEvent) {
                    return;
                }
                self.isCreatingNewEvent = true;

                var body = {
                    event_group: this.newEvent.eventGroup,
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
                    self.isCreatingNewEvent = false;
                });
            }
        }
    });
};