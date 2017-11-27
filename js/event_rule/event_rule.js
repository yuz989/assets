var EventRule = function() {
    var eventRule = new Vue({
        el: "#eventRuleComponent",
        data: {
            eventList: new PaginableComponent({url: '/v1/mjwebapisrv/events',
                defaultPage: 1,
                defaultPageSize: 32,
            }),
            ruleList: new PaginableComponent(),
            searchEventKeyWord: "",
            selectedEvent: {event_name: "Select An Event", event_id: -1},
            newEventRule: {
                relationParam: '',
                relationComment: '',
                isBusy: false
            },
            tobeEditedRule: {},
            addRuleModalList: new PaginableComponent(),
            addRuleModalStep: 1
        },
        mounted: function() {
            var self = this;
            this.eventList.gotoPage(1);
        },
        methods: {
            addRuleToEventModal: function() {
                $("#addRuleModal").modal("show");
                var url = '/v1/mjwebapisrv/events/' + this.selectedEvent.event_id.toString() + '/rules';
                this.addRuleModalList.gotoPage(1, {
                    url: url,
                    filters: {search_type: 'reverse'}
                });
            },
            addRuleToEventModalSave: function() {
                var self = this;
                self.newEventRule.isBusy = true;
                var event_id = self.selectedEvent.event_id;
                var rule_id = self.addRuleModalList.getSelectedSingleItem().rule_id;
                var url = '/v1/mjwebapisrv/events/' + event_id.toString() + '/rules';
                App.network.post(url, {
                    data: {
                        rule_id: rule_id,
                        relation_param: self.newEventRule.relationParam,
                        relation_comment: self.newEventRule.relationComment
                    }
                }).then(function() {
                    self.addRuleModalStep = 1;
                    self.newEventRule.relationParam = '';
                    self.newEventRule.relationComment = '';
                    self.newEventRule.isBusy = false;
                    self.ruleList.reloadPage({delay: 0});
                    $("#addRuleModal").modal("hide");
                });
            },
            addRuleModalGotoStep: function(step) {
                this.addRuleModalStep = step;
            },
            removeRuleFromEventModal: function() {
                $('#removeRuleModal').modal('show');
            },
            removeRuleFromEventModalSave: function() {
                var self = this;
                self.ruleList.status.isLoading = true;
                var event_id = self.selectedEvent.event_id;
                var url = '/v1/mjwebapisrv/events/' + event_id.toString() + '/rules';
                var ruleIds = [];
                $.each(self.ruleList.items, function(index, elem) {
                    if(elem._selected == true) {
                        ruleIds.push(elem.rule_id);
                    }
                });
                App.network.delete(url, {
                    data: {
                        rule_ids: ruleIds
                    }
                }).then(function() {
                    self.ruleList.status.isLoading = false;
                    self.ruleList.reloadPage({delay: 0});
                    $("#removeRuleModal").modal("hide");
                });
            },
            editRuleModal: function(rule) {
                this.tobeEditedRule = Object.create(rule);
                $('#editRuleModal').modal('show');
            },
            editRuleModalSave: function() {
                var self = this;
                self.tobeEditedRule.isBusy = true;
                var event_id = self.selectedEvent.event_id;
                var url = '/v1/mjwebapisrv/events/' + event_id.toString() + '/rules';
                App.network.put(url, {
                    data: {
                        rule_id: self.tobeEditedRule.rule_id,
                        relation_param: self.tobeEditedRule.relation_param,
                        relation_comment: self.tobeEditedRule.relation_comment
                    }
                }).then(function() {
                    self.ruleList.status.isLoading = false;
                    self.ruleList.reloadPage({delay: 0});
                    $("#editRuleModal").modal("hide");
                    App.widget.alert("update complete");
                });
            },
            selectEvent: function(index) {
                this.eventList.selectItem(index);
                this.selectedEvent = this.eventList.items[index];
                this.ruleList.setUrl('/v1/mjwebapisrv/events/' + this.eventList.items[index].event_id.toString() + '/rules');
                this.ruleList.gotoPage(1);
            },
            searchEvent: function() {
                if(this.searchEventKeyWord == "") return;

                this.eventList.search({
                    filters: {
                        search_key_word: this.searchEventKeyWord
                    }
                });
            },
            checkEmptySearch: function() {
                if(this.searchEventKeyWord == "") {
                    this.eventList.gotoPage(1);
                }
            },
            _getRuleStatus: function(ruleStatus) {
                switch(ruleStatus) {
                    case 0:
                        return '灰度';
                    case 1:
                        return '生效';
                    case 2:
                        return '失效';
                    default:
                        return '?';
                }
            }
        }
    });
};