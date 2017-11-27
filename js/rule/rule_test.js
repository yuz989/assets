var RuleTest = function() {
    var eventApp = new Vue({
        el: "#ruleTestComponent",
        data: {
            filter: {
                event_id: "0"
            },
            eventList: new PaginableComponent({url: '/v1/mjwebapisrv/events'}),
            isRunningTest: false
        },
        mounted: function() {
            $('.datepicker').datepicker();
            this.eventList.gotoPage(1);
        },
        methods: {
            runTest: function() {
                var self = this;

                if(self.isRunningTest == true) return;

                if(self.filter.event_id == "0") {
                    alert("error");
                    return;
                }

                self.isRunningTest = true;
                var url = '/v1/mjwebapisrv/rule_test/grey';
                var start_time = $('#filter_start_time').val();
                var end_time = $('#filter_end_time').val();
                var event_id = parseInt(this.filter.event_id);
                var body = {
                    start_time: start_time,
                    end_time: end_time,
                    event_id: event_id
                }
                App.network.post(url, {
                    data: body,
                    timeout: 600000
                }).then(function(response) {
                    console.log(response);
                    self.isRunningTest = false;
                }).catch(function(response) {
                    self.isRunningTest = false;
                });
            }
        }
    });
};