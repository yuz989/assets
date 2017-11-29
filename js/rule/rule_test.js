var RuleTest = function() {
    var eventApp = new Vue({
        el: "#ruleTestComponent",
        data: {
            filter: {
                event_id: "0"
            },
            eventList: new PaginableComponent({url: '/v1/mjwebapisrv/events'}),
            result: {
                event_id: '',
                old_result: [],
                new_result: []
            },
            TEST_URL: '/v1/mjwebapisrv/rule_test/grey',
            testRunningTime: 0,
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
                self.isRunningTest = true;
                self.testRunningTime = 0;
                App.Vue.widget.alert.display("執行中...", 'warning');

                window.onclose = function() {
                    return 'exit?';
                };

                var start_time = $('#filter_start_time').val();
                var end_time = $('#filter_end_time').val();
                var event_id = parseInt(this.filter.event_id);
                var body = {
                    start_time: start_time,
                    end_time: end_time,
                    event_id: event_id
                };

                App.network.post(self.TEST_URL, {
                    data: body
                }).then(function(response) {
                    var requestId = response.data.result;
                    self._poll(requestId);
                }).catch(function(response) {
                    self.isRunningTest == false;
                });
            },
            _poll: function(requestId) {
                var self = this;
                var url = self.TEST_URL + '?request_id=' + requestId;
                var retryCount = 2;
                var pollFrequency = 1000;

                var errFunc = function(err) {
                    App.Vue.widget.alert.show(err, 'danger', 1000);
                    self.isRunningTest = false;
                };
                var succFunc = function() {
                    self.isRunningTest = false;
                };

                var startTime = new Date();
                var timer = setInterval(function() {
                    var endTime = new Date();
                    self.testRunningTime =  Math.round((endTime - startTime)/1000);
                }, 1000);

                (function loop() {
                    App.network.get(url)
                    .then(function(response) {
                        if(response.data.result == false) {
                            if(retryCount == 0) {
                                clearInterval(timer);
                                throw "exceed maximum retry count";
                            }
                            retryCount -= 1;
                            setTimeout(loop, pollFrequency);
                        } else {
                            clearInterval(timer);
                            self.result = response.data.result;
                            succFunc();
                        }
                    }).catch(function(exp) {
                        errFunc(exp);
                    });
                }());
            },
            riskLevelBackground: function(value) {
                var v = {
                    'NORMAL': 'risk-normal',
                    'HIGH': 'risk-high',
                    'LOW': 'risk-low'
                };
                return v[value];
            }
        }
    });
};