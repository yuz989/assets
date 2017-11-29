var RuleAnalysis = function() {
    var eventApp = new Vue({
        el: "#ruleAnalysesComponent",
        data: {
            ruleAnalysisList: new PaginableComponent({url: '/v1/mjwebapisrv/rule_analyses'}),
            searchFilter: {
                rule_id: 0,
                event_id: 0,
                start_time: "",
                end_time: ""
            },
            eventRules: [],
            selectedEvent: {
                rules: []
            }
        },
        mounted: function() {
            var self = this;
            $('.datepicker').datepicker();
            App.network.fetch('/v1/mjwebapisrv/event_rules', {
                success: function(response) {
                    self.eventRules = response.items;
                    if(self.eventRules.length > 0) {
                        self.selectedEvent = self.eventRules[0];
                    }
                    self.ruleAnalysisList.gotoPage(1);
                }
            });
        },
        methods: {
            selectEvent: function() {
                if(this.searchFilter.event_id == 0) {
                    this.searchFilter.rule_id = 0;
                } else {
                    //!
                    for(var i=0; i<this.eventRules.length; i++) {
                        if(this.eventRules[i].event_id == this.searchFilter.event_id) {
                            this.selectedEvent = this.eventRules[i];
                            this.searchFilter.rule_id = 0;
                        }
                    }
                }
            },
            searchRuleAnalysis: function(page) {
                this.searchFilter.start_time = $('#filter_start_date').val()
                this.searchFilter.end_time = $('#filter_end_date').val()
                this.ruleAnalysisList.search(page, {
                    filters: this.searchFilter
                });
            }
        }
    });
};